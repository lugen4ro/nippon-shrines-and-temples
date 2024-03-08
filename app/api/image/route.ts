import { deleteImage } from "@/app/lib/api_utils";
import { createErrorResponse } from "@/app/lib/errorHandling";
import { iconSize, imageHeight, imageWidth } from "@/app/settings";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest) {
    // Get public id from body
    const { public_id } = await req.json();

    try {
        deleteImage(public_id);
    } catch (error) {
        console.error("/api/image [DELETE] Error deleting image: ", error);
        return createErrorResponse(error, 500);
    }

    return NextResponse.json({});
}

export async function GET(req: NextRequest) {
    const public_id = req.nextUrl.searchParams.get("public_id") as string;
    console.log("/api/image [GET] Image - " + public_id);

    let image_data;
    try {
        image_data = await prisma.image.findUnique({
            where: { public_id: public_id },
        });
    } catch (error) {
        console.error(
            "/api/image [GET] Error getting image with prisma: ",
            error
        );
        return createErrorResponse(error, 500);
    }
    if (!image_data)
        return NextResponse.json(
            { error: "Image not found in Database" },
            { status: 404 }
        );

    // Fetch images from cloudinary
    let res;
    try {
        console.log(
            "/api/image [GET] Fetching Image from cloudinary - " + public_id
        );
        res = await fetch(image_data.url); // The return value is *not* serialized
    } catch (error) {
        console.error(
            "/api/image [GET] Error getting image from cloudinary: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    // Return Image
    const contentType = res.headers.get("content-type"); // ex) img/png
    const response = new NextResponse(res.body);
    response.headers.set("content-type", contentType!);

    console.log("/api/image [GET] Success - " + public_id);

    return response;
}

async function uploadToCloudinary(imageBuffer: Buffer, folder_name: string) {
    // Seperate development and production images
    folder_name = (process.env.LOCAL ? "dev/" : "prod/") + folder_name;

    const base64File = Buffer.from(imageBuffer).toString("base64");
    const imageMimeType = "image/webp";

    console.log("Uploading to cloudinary folder -> " + folder_name);

    return await cloudinary.uploader.upload(
        `data:${imageMimeType};base64,${base64File}`,
        { folder: folder_name, resource_type: "image" }
    );
}

// Create new Image
export async function POST(req: NextRequest) {
    // Process form data
    let source_name;
    let source_url;
    let place_slug;
    let icon;
    let formData;

    try {
        // Get form data
        console.log("Waiting for form data");
        formData = await req.formData();
        console.log("Got form data");

        // Get fields
        source_name = formData.get("source_name") as string;
        source_url = formData.get("source_url") as string;
        place_slug = formData.get("place_slug") as string;
        icon = formData.get("icon") === "true" ? true : false;
    } catch (error) {
        console.error("/api/image [POST] Error processing form data: ", error);
        return createErrorResponse(error, 400, "Error processing form data");
    }

    // Check if place exists
    let place;
    try {
        place = await prisma.place.findUnique({
            where: { slug: place_slug },
        });
    } catch (error) {
        console.error(
            "/api/image [POST] Error getting place with prisma: ",
            error
        );
        return createErrorResponse(error, 500);
    }
    if (!place)
        return NextResponse.json({ error: "Invalid place" }, { status: 404 });

    // Turn image into buffer
    let buffer;
    try {
        // Process Image
        const imageFile = formData.get("image");
        console.log("imageFile -> ", imageFile);

        if (imageFile instanceof File) {
            // Transform ReadableStream into buffer
            buffer = await imageFile!.arrayBuffer();
        } else {
            throw new Error("Image not a instance of 'File'");
        }
    } catch (error) {
        console.error(
            "/api/image [POST] Could not read image as buffer: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    // Transform Image with sharp
    console.log("Transforming image with sharp...");
    let newBuffer;
    let iconBuffer;
    try {
        // const newWidth = 500;
        const newWidth = imageWidth;
        const newHeight = imageHeight;
        newBuffer = await sharp(buffer)
            .resize({ width: newWidth, height: newHeight, fit: "cover" })
            .toFormat("webp")
            .toBuffer();

        // Transform Icon Image
        if (icon) {
            // Make icon 75% of the height of the image and crop at the center
            const iconHeightFactor = 0.75;
            const img = sharp(buffer);
            const metadata = await img.metadata();
            const w = metadata.width as number;
            const h = metadata.height as number;
            const len = Math.round(h * iconHeightFactor);
            iconBuffer = await img
                .extract({
                    left: Math.round((w - len) / 2),
                    top: Math.round(h * ((1 - iconHeightFactor) / 2)),
                    width: len,
                    height: len,
                })
                .resize({ width: iconSize, height: iconSize, fit: "cover" })
                .toFormat("webp")
                .toBuffer();
        }
    } catch (error) {
        console.error(
            "/api/image [POST] Error transforming image with sharp: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    console.log("Uploading image to cloudinary...");
    let res_img;
    let res_icon;
    try {
        // Upload Image
        res_img = (await uploadToCloudinary(
            newBuffer,
            place.id.toString()
        )) as {
            public_id: string;
            width: number;
            height: number;
            format: string;
            bytes: number;
            url: string;
        };

        // Upload Icon Image
        if (icon) {
            res_icon = (await uploadToCloudinary(iconBuffer!, "icon")) as {
                public_id: string;
                width: number;
                height: number;
                format: string;
                bytes: number;
                url: string;
            };
        }
    } catch (error) {
        console.error(
            "/api/image [POST] Error uploading to Cloudinary: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    console.log("Updating database with prisma...");
    let newImage;
    try {
        // Create new Image entry in database
        newImage = await prisma.image.create({
            data: {
                public_id: res_img.public_id,
                width: res_img.width,
                height: res_img.height,
                format: res_img.format,
                url: res_img.url,
                bytes: res_img.bytes,
                place_id: place.id,
                icon: icon,
                source_name: source_name,
                source_url: source_url,
            },
        });

        // For icon
        let newIcon;
        if (icon) {
            newIcon = await prisma.image.create({
                data: {
                    public_id: res_icon!.public_id,
                    width: res_icon!.width,
                    height: res_icon!.height,
                    format: res_icon!.format,
                    url: res_icon!.url,
                    bytes: res_icon!.bytes,
                    place_id: place.id,
                    icon: icon,
                    source_name: source_name,
                    source_url: source_url,
                },
            });
        }
    } catch (error) {
        console.error(
            "/api/image [POST] Error while create image entry with prisma: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    try {
        // Update place icon_url
        if (icon) {
            const newPlace = await prisma.place.update({
                where: { id: place.id },
                data: { icon_url: res_icon!.url },
            });
            if (!newPlace)
                return NextResponse.json(
                    { error: "Failed to update place" },
                    { status: 404 }
                );
        }
    } catch (error) {
        console.error(
            "/api/image [POST] Error updating place icon_url with prisma: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    return NextResponse.json(newImage, { status: 201 });
}
