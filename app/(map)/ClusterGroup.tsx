"use client";
import L, { MarkerCluster } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import { remToPx } from "../lib/size_utils";
import { MarkerSize } from "./MarkerSizeToggle";

interface Props {
    iconSizeRem: number;
    markerSize: MarkerSize;
    children: ReactNode;
}

const CustomMarkerClusterGroup = ({
    iconSizeRem,
    markerSize,
    children,
}: Props) => {
    const iconSizePx = remToPx(iconSizeRem);
    const maxClusterRadius = (zoomLevel: number) => {
        return iconSizePx / 3;
    };
    const disableClusteringAtZoom = markerSize === "small" ? 12 : 13;

    const fontSize = markerSize === "small" ? "0.9rem" : "1.5rem";
    const clusterSize = `${iconSizeRem / 2}rem`;

    return (
        <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false} // When you mouse over a cluster it shows the bounds of its markers.
            spiderfyOnMaxZoom={false} // When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers
            maxClusterRadius={maxClusterRadius}
            iconCreateFunction={(cluster: MarkerCluster) => {
                const iconSizeRem = markerSize === "small" ? 3 : 6;
                return L.divIcon({
                    html: `<span class="cluster-icon" style="height:${clusterSize}; width:${clusterSize}; font-size:${fontSize}">${cluster.getChildCount()}</span>`,
                });
            }}
            disableClusteringAtZoom={disableClusteringAtZoom}
        >
            {children}
        </MarkerClusterGroup>
    );
};

export default CustomMarkerClusterGroup;
