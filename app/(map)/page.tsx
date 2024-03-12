import prisma from "@/prisma/client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import MapContainer from "./MapContainer";
import { Metadata } from "next";

const DynamicMap = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default async function Home() {
    const places = await prisma.place.findMany();
    return <MapContainer places={places} />;
}

export const metadata: Metadata = {
    title: "Nippon Shrines - Explore Japanese Shrines and Temples on map",
    description:
        "Explore renowned Japanese shrines and temples on a neat looking map.",
};
