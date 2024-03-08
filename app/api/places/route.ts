import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Make dynamic so even with new data added after deploy, we can get those records
export const dynamic = "force-dynamic";

// Return all places
export async function GET(req: NextRequest) {
    console.log("/api/places [GET] Get places");
    const places = await prisma.place.findMany();

    const res = places.map((place) => ({ id: place.id, slug: place.slug }));

    return NextResponse.json(res);
}
