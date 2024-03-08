import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(public_id: string) {
    const image_data = await prisma.image.findUnique({
        where: { public_id: public_id },
    });
    if (!image_data)
        return NextResponse.json(
            { error: "Image not found in Database" },
            { status: 404 }
        );

    // Delete Image from Cloudinary
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    // Delete Image from Database
    await prisma.image.delete({
        where: { public_id },
    });
}
