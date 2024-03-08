"use client";
import { Place } from "@prisma/client";
import L, { MarkerCluster } from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import CustomMarker from "./Marker";
import CustomPopup from "./Popup";
interface Props {
    markers: Place[];
}

function convertRemToPixels(rem: number) {
    return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
}
const iconSizeRem = 6; // rem
const iconSizePixel = convertRemToPixels(iconSizeRem);

const Map = ({ markers }: Props) => {
    return (
        <MapContainer
            center={[36.5, 137.0]}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            className="z-0"
            zoomControl={false} // No overlay zoom contorls
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />

            <MarkerClusterGroup
                chunkedLoading
                showCoverageOnHover={false} // When you mouse over a cluster it shows the bounds of its markers.
                spiderfyOnMaxZoom={false} // When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers
                maxClusterRadius={iconSizePixel / 2} // default 80, can use function
                iconCreateFunction={createCustomClusterIcon}
            >
                {markers.map((marker) => (
                    <Marker
                        position={[
                            marker.geocode_latitude,
                            marker.geocode_longitude,
                        ]}
                        icon={customIcon(marker)}
                        key={marker.id}
                        zIndexOffset={-100}
                    >
                        <Popup>{<CustomPopup marker={marker} />}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

// Marker Icon
const customIcon = (marker: Place) => {
    return L.divIcon({
        className: "customIcon",
        popupAnchor: [0, -iconSizePixel / 2],
        iconAnchor: [iconSizePixel / 2, iconSizePixel / 2],
        html: renderToString(
            <CustomMarker
                icon_url={marker.icon_url}
                icon_size_rem={iconSizeRem}
                icon_size_px={iconSizePixel}
                category={marker.category}
            />
        ),
    });
};

// Cluster Icon
const createCustomClusterIcon = function (cluster: MarkerCluster) {
    return L.divIcon({
        html: `<span class="cluster-icon" style="height:${iconSizeRem / 2}rem;width:${iconSizeRem / 2}rem">${cluster.getChildCount()}</span>`,
    });
};

export default Map;
