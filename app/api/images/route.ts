import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Image } from "./[id]/route";

// Return all
export async function GET(req: NextRequest) {
    console.log("/api/images [GET] Get images");
    const images = await prisma.image.findMany();

    const res: Image[] = images.map((image) => ({
        public_id: image.public_id,
        url: image.url,
        width: image.width,
        height: image.height,
        icon: image.icon,
        source_name: image.source_name,
        source_url: image.source_url,
    }));

    return NextResponse.json(res);
}
