import { Place } from "@prisma/client";
import { Box } from "@radix-ui/themes";
import L, { LeafletEventHandlerFnMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Marker } from "react-leaflet";
import { remToPx } from "../lib/size_utils";

const colorMap = {
    SHRINE: "border-red-500",
    TEMPLE: "border-blue-500",
    OTHER: "border-green-500",
};

interface Props {
    marker: Place;
    iconSizeRem: number;
    eventHandlers: LeafletEventHandlerFnMap;
    children: ReactNode;
}

const CustomMarker = ({
    marker,
    iconSizeRem,
    eventHandlers,
    children,
}: Props) => {
    return (
        <Marker
            position={[marker.geocode_latitude, marker.geocode_longitude]}
            icon={customIcon(marker, iconSizeRem)}
            key={marker.id}
            zIndexOffset={-100}
            eventHandlers={eventHandlers}
        >
            {children}
        </Marker>
    );
};

// Marker Icon
const customIcon = (marker: Place, iconSizeRem: number) => {
    const iconSizePx = remToPx(iconSizeRem);

    return L.divIcon({
        className: "customIcon",
        popupAnchor: [0, -iconSizePx / 2],
        iconAnchor: [iconSizePx / 2, iconSizePx / 2],
        html: renderToString(
            <Box
                className={
                    "iconContainer rounded-full overflow-hidden flex border-4 " +
                    `${colorMap[marker.category]}`
                }
                style={{
                    width: iconSizeRem + "rem",
                    height: iconSizeRem + "rem",
                }}
            >
                <Image
                    src={marker.icon_url ?? "/icons/placeholder.png"}
                    alt="Icon Image"
                    width={iconSizePx}
                    height={iconSizePx}
                />
            </Box>
        ),
    });
};

export default CustomMarker;
