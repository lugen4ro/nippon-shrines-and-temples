import prisma from "@/prisma/client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import MapContainer from "./MapContainer";
import { Metadata } from "next";
import { Image } from "../api/images/[id]/route";
import { Place } from "@prisma/client";

const DynamicMap = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export interface PlaceWithImages extends Place {
    images: Image[];
}

export default async function Home() {
    // Get all places
    const places = await prisma.place.findMany();

    // Get info about images of each place
    const images = await prisma.image.findMany({
        orderBy: [{ icon: "desc" }, { public_id: "asc" }], // icon desc so we get main image first
    });
    const res: Image[] = images.map((image) => ({
        public_id: image.public_id,
        url: image.url,
        width: image.width,
        height: image.height,
        icon: image.icon,
        source_name: image.source_name,
        source_url: image.source_url,
    }));

    const placesWithImages: PlaceWithImages[] = places.map((place) => {
        const placeImages = images.filter(
            (image) =>
                image.place_id === place.id &&
                image.public_id.split("/")[1] !== "icon"
        );

        return { ...place, images: placeImages };
    });

    return <MapContainer places={placesWithImages} />;
}

export const metadata: Metadata = {
    title: "Nippon Shrines - Explore Japanese Shrines and Temples on map",
    description:
        "Explore renowned Japanese shrines and temples on a neat looking map.",
};
