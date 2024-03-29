#!/usr/bin/env node

import { Command } from "commander";
import csvParser from "csv-parser";
import dotenv from "dotenv";
import fs from "fs";
import iconv from "iconv-lite";
import { exit } from "process";
import sharp from "sharp";

type Env = "dev" | "prod";
dotenv.config();
const program = new Command();

function raiseError(message: string | any[]): never {
    if (typeof message === "string") console.error("[ERROR] " + message);
    else {
        console.error("[ERROR] " + message[0]);
        for (const m of message.splice(1)) {
            console.error(m);
        }
    }
    process.exit(1);
}

program
    .command("getPlaces <env>")
    .description("Get all places from database")
    .action(async (env: Env) => {
        // Parse env
        const { base_url, apiKey } = parseEnv(env);

        console.log("GET Places\n");

        // Get places from API
        const places = await getPlaces(base_url, apiKey);
        console.log("Place:");
        console.log(places);
    });

program
    .command("deletePlace <env> <place_slug>")
    .description("Get all places from database")
    .action(async (env: Env, place_slug: string) => {
        // Parse env
        const { base_url, apiKey } = parseEnv(env);

        console.log("DELETE Place -> " + place_slug + "\n");

        // Get places from API
        await deletePlace(base_url, apiKey, place_slug);
        console.log("Sucessfully deleted.");
    });

program
    .command("updatePlace <env> <place_slug>")
    .argument(
        "[dataDir]",
        "Path to directory containing places.csv and images directory (No trailing slash!)",
        process.env.DATA_DIR
    )
    .description("Update one place")
    .action(async (env: Env, place_slug: string, dataDir: string) => {
        // Parse env
        const { base_url, apiKey } = parseEnv(env);

        console.log("UPDATE Place -> " + place_slug + "\n");

        // Get data from CSV
        const data = await readCSV(dataDir + "/places.csv");

        // Get data for that place
        const place = data.find((place) => place.slug === place_slug);
        if (!place)
            raiseError("Place slug does not exist in CSV --> " + place_slug);

        // Get existing places from API
        const places = await getPlaces(base_url, apiKey);

        // Delete specified place if it already exists
        if (places.some((place) => place.slug === place_slug))
            await deletePlace(base_url, apiKey, place_slug);

        // Create Place
        const place_id = await createPlace(base_url, apiKey, place);

        // Create Images
        await createImages(base_url, apiKey, dataDir, place_slug);

        console.log("Sucessfully updated.");
    });

program
    .command("updatePlaces <env>")
    .argument(
        "[sync]",
        "If 'sync', delete all existing places, then upload all local ones. For any other value, upload all local places if they do not exist yet",
        "no-sync"
    )
    .argument(
        "[dataDir]",
        "Path to directory containing places.csv and images directory (No trailing slash!)",
        process.env.DATA_DIR
    )
    .description("Update all places")
    .action(async (env: Env, sync: string, dataDir: string) => {
        // Parse env
        const { base_url, apiKey } = parseEnv(env);

        console.log("UPDATE Places");

        // Parse force argument
        const fullSync = sync === "sync" ? true : false;
        console.log(
            fullSync
                ? "DELETING ALL EXISTING PLACES and uploading all local ones"
                : "Uploading all local places that do not exist yet. Nothing will be overwritten."
        );

        // Get data for all places from CSV
        const data = await readCSV(dataDir + "/places.csv");

        // Get existing places from API
        const places = await getPlaces(base_url, apiKey);

        // For full sync, delete all existing places
        if (fullSync) {
            for (const place of places) {
                await deletePlace(base_url, apiKey, place.slug);
            }
        }

        for (const place of data) {
            // Skip places that already exist when it is not a full sync
            if (!fullSync && places.some((p) => p.slug === place.slug))
                continue;

            // Create Place
            const place_id = await createPlace(base_url, apiKey, place);

            // Create Images
            await createImages(base_url, apiKey, dataDir, place.slug);
        }

        console.log("Sucessfully updated all places");
    });

program.parse(process.argv);

async function deletePlace(
    base_url: string,
    apiKey: string,
    place_slug: string
) {
    console.log("Deleting place -> " + place_slug);

    // DELETE API Request
    const res = await fetch(base_url + "/api/place", {
        method: "DELETE",
        body: JSON.stringify({ slug: place_slug }),
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
    });
    if (!res.ok) raiseError(["Failed to delete place", await res.json()]);
}

async function getPlaces(
    base_url: string,
    apiKey: string
): Promise<{ id: number; slug: string }[]> {
    console.log("Retrieving places");

    const res = await fetch(base_url + "/api/places", {
        headers: { "x-api-key": apiKey },
    });
    if (!res.ok)
        raiseError(["Failed to get places over API", await res.json()]);

    return res.json();
}

async function createPlace(
    base_url: string,
    apiKey: string,
    place: csvPlace
): Promise<number> {
    console.log("Creating place -> " + place.slug);

    // POST API Request
    const res = await fetch(base_url + "/api/place", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(place),
    });
    if (!res.ok)
        raiseError(["Failed to create place with API", await res.json()]);

    const place_id: string = (await res.json()).id;
    console.log("Created place -> " + place_id);
    return parseInt(place_id);
}

async function readCSV(filePath: string): Promise<csvPlace[]> {
    try {
        const data: csvPlaceRaw[] = [];

        // Read the CSV file asynchronously and parse its content
        const fileStream = fs.createReadStream(filePath);

        // Create a promise to handle the stream events
        await new Promise((resolve, reject) => {
            fileStream
                .pipe(iconv.decodeStream("utf8"))
                .pipe(csvParser())
                .on("data", (row) => {
                    data.push(row);
                })
                .on("end", () => {
                    resolve(data);
                })
                .on("error", (error) => {
                    reject(error);
                });
        });

        // Parse raw data
        const parsedData = data.map((place) => {
            // Check fields
            if (
                !categories.includes(place.category) ||
                !prefectureSlugs.includes(place.prefecture_slug)
            )
                raiseError("Invalid schema for place -> " + place.slug);

            const newPlace: csvPlace = {
                ...place,
                desc: place.desc.trim(),
                category: place.category,
                prefecture_slug: place.prefecture_slug,
                geocode_latitude: parseFloat(place.geocode_latitude),
                geocode_longitude: parseFloat(place.geocode_longitude),
                total_reviews: parseInt(place.total_reviews.replace(/,/g, "")),
            };
            return newPlace;
        });

        return parsedData;
    } catch (error) {
        raiseError(["Error reading CSV file", error]);
    }
}

async function createImage(
    base_url: string,
    apiKey: string,
    place_slug: string,
    filePath: string,
    sourceName: string,
    sourceUrl: string
) {
    let formData;
    try {
        // Is main / icon?
        const icon = filePath.split(".")[0].endsWith("main");

        // Load file as 'File'
        let file = new File([fs.readFileSync(filePath)], filePath);

        // Preprocess image if too large (Vercel only accepts body of up to 4MB)
        const fileSize = getFileSizeInMegaBytes(file);
        if (fileSize > 3) {
            const width = 1000;
            console.log(
                `Image too large, resizing before upload --> ${fileSize.toFixed(2)} MB`
            );
            file = await resizeFile(file, width); // width of 1000 should be small enough, but also good enough quality
            console.log(
                `File size after resize to width ${width} --> ${getFileSizeInMegaBytes(file).toFixed(2)}MB`
            );
        }

        // Create form data
        formData = new FormData();
        formData.append("image", file);
        formData.append("source_name", sourceName);
        formData.append("source_url", sourceUrl);
        formData.append("place_slug", place_slug);
        formData.append("icon", icon.toString());
    } catch (error) {
        raiseError([
            "Failed to create formData to send image POST request",
            error,
        ]);
    }

    const res = await fetch(base_url + "/api/image", {
        method: "POST",
        body: formData,
        headers: { "x-api-key": apiKey },
    });
    if (!res.ok)
        raiseError(["Error creating image with API", await res.json()]);
}

// async function createImages(imageDirs, p, root_dir) {
async function createImages(
    base_url: string,
    apiKey: string,
    dataDir: string,
    place_slug: string
) {
    console.log("Creating images for -> " + place_slug);

    const imageDir = dataDir + "/images/" + place_slug;

    // Get all image files for this place
    let files = await listFiles(imageDir);

    // if directory is empty, just skip (allow places without images)
    if (!files || files.length === 0) {
        console.log("No images found for -> " + place_slug);
        return;
    }

    // Remove sources.json from image files
    files = files.filter((f) => f !== "source.json");

    // Check that a "main.<ext>" image exists which is used as the main image / icon
    if (!files.some((f) => f.startsWith("main.")))
        raiseError([
            "No image with filename main.<ext> for place -> " + place_slug,
            files,
        ]);

    // Parse sources file content
    const sourceDict = await parseSourceFile(imageDir);

    // Upload each image
    for (const file of files) {
        // Only look at image files
        if (!hasImageExtension(file)) continue;

        const file_path = imageDir + "/" + file;

        // Uplaod Image
        await createImage(
            base_url,
            apiKey,
            place_slug,
            file_path,
            sourceDict[file].source_name,
            sourceDict[file].source_url
        );
    }
}

// List all files in a directory
function listFiles(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

async function parseSourceFile(imageDir: string) {
    try {
        const sourceFile = fs.readFileSync(imageDir + "/source.json", "utf-8");
        const sources = JSON.parse(sourceFile).sources;

        // Map sourceDict[<ImageName>] = {source_name: SourceName, source_url: https://examplesourcename.com}>
        let sourceDict: {
            [key: string]: { source_name: string; source_url: string };
        } = {};

        for (const source of sources) {
            if (source.images === "all") {
                let files = await listFiles(imageDir);

                for (const file of files) {
                    if (file === "source.json") continue;
                    sourceDict[file] = {
                        source_name: source.source_name,
                        source_url: source.source_url,
                    };
                }
                break;
            }
            for (const img of source.images) {
                sourceDict[img] = {
                    source_name: source.source_name,
                    source_url: source.source_url,
                };
            }
        }
        return sourceDict;
    } catch (error) {
        raiseError(["Error parsing source file", error]);
    }
}

function hasImageExtension(filename: string) {
    return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

/**
 * Get appropriate url and apiKey for environemnt type
 *
 * @param {string} env - Environment to use. Either "dev" or "prod"
 * @returns {{ base_url: string, apiKey: string }}
 */
function parseEnv(env: string) {
    if (env !== "dev" && env !== "prod") {
        console.error("[ERROR] <env> argument only accepts 'dev' or 'prod'");
        process.exit(1);
    }
    let base_url;
    let apiKey;
    if (env === "dev") {
        base_url = process.env.BASE_URL_DEV as string;
        apiKey = process.env.API_KEY_DEV as string;
    } else {
        base_url = process.env.BASE_URL_PROD as string;
        apiKey = process.env.API_KEY_PROD as string;
    }

    if (!apiKey)
        raiseError(
            "No API Key defined. Make sure you execute command in directory that has a .env file with the API_KEY"
        );

    console.log("Base url -> " + base_url);
    console.log("API KEY -> " + apiKey);
    console.log("");
    return { base_url, apiKey };
}

function getFileSizeInMegaBytes(file: File): number {
    return file.size / (1024 * 1024);
}

async function resizeFile(file: File, width: number): Promise<File> {
    const fileBuffer = await file.arrayBuffer();

    const processedBuffer = await sharp(fileBuffer)
        .resize({ width: width })
        .toBuffer();

    const processedFile: File = new File([processedBuffer], file.name, {
        type: file.type,
    });

    return processedFile;
}

const categories = ["TEMPLE", "SHRINE", "OTHER"];
type Category = (typeof categories)[number];

type csvPlace = {
    slug: string;
    name: string;
    name_jp: string;
    desc: string;
    category: Category;
    prefecture_slug: PrefectureSlug;
    geocode_latitude: number;
    geocode_longitude: number;
    gmap_link: string;
    total_reviews: number;
    wiki_link: string;
};

type csvPlaceRaw = { [key in keyof csvPlace]: string };

type PrefectureSlug = (typeof prefectureSlugs)[number];
const prefectureSlugs = [
    "hokkaido",
    "aomori",
    "iwate",
    "miyagi",
    "akita",
    "yamagata",
    "fukushima",
    "ibaraki",
    "tochigi",
    "gunma",
    "saitama",
    "chiba",
    "tokyo",
    "kanagawa",
    "niigata",
    "toyama",
    "ishikawa",
    "fukui",
    "yamanashi",
    "nagano",
    "gifu",
    "shizuoka",
    "aichi",
    "mie",
    "shiga",
    "kyoto",
    "osaka",
    "hyogo",
    "nara",
    "wakayama",
    "tottori",
    "shimane",
    "okayama",
    "hiroshima",
    "yamaguchi",
    "tokushima",
    "kagawa",
    "ehime",
    "kochi",
    "fukuoka",
    "saga",
    "nagasaki",
    "kumamoto",
    "oita",
    "miyazaki",
    "kagoshima",
    "okinawa",
];
