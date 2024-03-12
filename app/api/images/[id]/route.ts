import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export interface Image {
    public_id: string;
    url: string;
    width: number;
    height: number;
    icon: boolean;
    source_name: string;
    source_url: string;
}

// Return image public_ids ordered by order column
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log("/api/images [GET] Get images");
        // Get image metadata from database
        const image_data = await prisma.image.findMany({
            where: { place_id: parseInt(params.id) },
            // order by public id as well such that when we have multiple with the same order, we stil get consistent order
            orderBy: [{ icon: "desc" }, { public_id: "asc" }], // icon desc so we get main image first
        });

        // Return array of public id and order
        const res: Image[] = image_data
            .map((img) => ({
                public_id: img.public_id,
                url: "/api/image?public_id=" + img.public_id,
                width: img.width,
                height: img.height,
                icon: img.icon,
                source_name: img.source_name,
                source_url: img.source_url,
            }))
            .filter(
                (img) => !(img.icon && img.public_id.split("/")[1] === "icon")
            ); // Don't return icon image

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error occured while getting images" },
            { status: 500 }
        );
    }
}
