import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { PlaceSchema } from "@/app/ValidationSchemas";
import { createErrorResponse } from "@/app/lib/errorHandling";
import { deleteImage } from "@/app/lib/api_utils";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create new place
export async function POST(req: NextRequest) {
    const body = await req.json();

    // Validate data
    const validation = PlaceSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, {
            status: 400,
        });

    try {
        const newPlace = await prisma.place.create({
            data: {
                ...body,
            },
        });
        return NextResponse.json(newPlace, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error occured while creating new place with prisma" },
            { status: 500 }
        );
    }
}

// Edit existing place
export async function PATCH(req: NextRequest) {
    const body = await req.json();

    // Validate data
    const validation = PlaceSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, {
            status: 400,
        });

    // Check if place exists
    const { slug } = body;
    const place = await prisma.place.findUnique({
        where: { slug: slug },
    });
    if (!place)
        return NextResponse.json({ error: "Invalid place" }, { status: 404 });

    // Update Place (set to body that was passed, so update all fields)
    const updatedPlace = await prisma.place.update({
        where: { id: place.id },
        data: body,
    });

    return NextResponse.json(updatedPlace);
}

// Delete place
export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const slug = body.slug;

    let place;
    try {
        place = await prisma.place.findUnique({
            where: { slug: slug },
        });
        if (!place)
            return NextResponse.json(
                { error: "Invalid place" },
                { status: 404 }
            );
    } catch (error) {
        console.error(
            "/api/place [DELETE] Could not find place in database with prisma: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    try {
        // Delete Images
        const images = await prisma.image.findMany({
            where: { place_id: place.id },
        });

        // Delete in parallel, but make sure all images are deleted before deleting folder
        const promises = [];
        for (const image of images) {
            promises.push(deleteImage(image.public_id));
        }
        await Promise.all(promises);
    } catch (error) {
        console.error(
            "/api/place [DELETEK] Failed to delete images from cloudinary: ",
            error
        );
        return createErrorResponse(error, 500);
    }

    try {
        const id = place.id.toString();
        const prefix = process.env.LOCAL ? "dev/" : "prod/";

        // Check if folder exists before deleting
        const { folders }: { folders: { name: string; path: string }[] } =
            await cloudinary.api.sub_folders(prefix);
        const exists = folders.some((obj) => obj.name === id);

        if (exists) {
            // Delete Cloudinary Folder
            const folder_name = prefix + id;
            cloudinary.api.delete_folder(folder_name);
        }
    } catch (error) {
        console.error("/api/place [DELETE] Failed to delete cloudinary folder");
        // If no folder exists and we cannot remove, just ignore the error
        return createErrorResponse(error, 500);
    }

    try {
        // Delete Place
        await prisma.place.delete({
            where: { slug: slug },
        });
    } catch (error) {
        console.error(
            "/api/place [DELETE] Failed to delete place in database with prisma"
        );
        return createErrorResponse(error, 500);
    }

    return NextResponse.json({});
}
