"use client";
import { Place } from "@prisma/client";
import L, { LeafletEvent, Map as MapLeaflet, MarkerCluster } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode, useState } from "react";
import { renderToString } from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import useWindowSize from "../lib/useWindowSize";
import CustomMarker from "./Marker";
import CustomPopup from "./Popup";
import { MarkerSize, MarkerSizeToggler } from "./MarkerSizeToggle";
import { Box } from "@radix-ui/themes";
import { remToPx } from "../lib/size_utils";
import CustomMarkerClusterGroup from "./ClusterGroup";

interface Props {
    markers: Place[];
    markerSize: MarkerSize;
}

const Map = ({ markers, markerSize }: Props) => {
    const [map, setMap] = useState<MapLeaflet | null>(null);

    const iconSizeRem = markerSize === "small" ? 3 : 6;
    const iconSizePixel = remToPx(iconSizeRem);

    console.log(markerSize);

    const [width, height] = useWindowSize(); // [width, height]
    const isMobile = width < 768;

    // When popup is opened, automaticaly center it horizontally
    const markerEventHandlers =
        isMobile && map
            ? {
                  popupopen: (e: LeafletEvent) => {
                      // find the pixel location on the map where the popup anchor is
                      let px = map.project(e.target._popup._latlng);

                      // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
                      // px.y -= e.target._popup._container.clientHeight / 2; // doesn't work on first click since the component is not rendered
                      px.y -= 250;

                      // pan to new center
                      map.panTo(map.unproject(px), { animate: true });
                  },
              }
            : {};

    return (
        <MapContainer
            center={[36.5, 137.0]}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            className="z-0"
            zoomControl={false} // No overlay zoom contorls
            ref={setMap}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />

            {/* Since changing the maxClusterRadius for an existing MarkerClusterGroup doesn't work, just create two seperate ones */}
            {/* For Small Marers */}
            {markerSize === "small" ? (
                <CustomMarkerClusterGroup
                    iconSizeRem={iconSizeRem}
                    markerSize={markerSize}
                >
                    {markers.map((marker) => (
                        <CustomMarker
                            key={marker.id}
                            marker={marker}
                            iconSizeRem={iconSizeRem}
                            markerSize={markerSize}
                            eventHandlers={markerEventHandlers}
                        >
                            <Popup autoPan={isMobile ? false : true}>
                                {<CustomPopup marker={marker} />}
                            </Popup>
                        </CustomMarker>
                    ))}
                </CustomMarkerClusterGroup>
            ) : null}

            {/* For Large Marers */}
            {markerSize === "large" ? (
                <CustomMarkerClusterGroup
                    iconSizeRem={iconSizeRem}
                    markerSize={markerSize}
                >
                    {markers.map((marker) => (
                        <CustomMarker
                            key={marker.id}
                            marker={marker}
                            iconSizeRem={iconSizeRem}
                            markerSize={markerSize}
                            eventHandlers={markerEventHandlers}
                        >
                            <Popup autoPan={isMobile ? false : true}>
                                {<CustomPopup marker={marker} />}
                            </Popup>
                        </CustomMarker>
                    ))}
                </CustomMarkerClusterGroup>
            ) : null}
        </MapContainer>
    );
};

export default Map;
