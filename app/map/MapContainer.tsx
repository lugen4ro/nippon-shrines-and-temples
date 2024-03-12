"use client";
import { Place } from "@prisma/client";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Box, Flex } from "@radix-ui/themes";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { VscCircleLargeFilled, VscCircleSmallFilled } from "react-icons/vsc";
import FilterButton from "./FilterButton";
import { MarkerSize, MarkerSizeToggler } from "./MarkerSizeToggle";
import Map from "./Map";

const DynamicMap = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

interface Props {
    places: Place[];
}

const MapContainer = ({ places }: Props) => {
    const [showShrine, setShowShrine] = useState(true);
    const [showTemple, setShowTemple] = useState(true);
    const [markerSize, setMakerSize] = useState<MarkerSize>("small");
    // const [sliderValue, setSliderValue] = useState([0]);

    // const maxReviews = places.reduce(
    //     (maxValue, obj) => Math.max(maxValue, obj.total_reviews),
    //     -Infinity
    // );

    // Filter by category
    places = places.filter((place) => {
        // if (place.total_reviews < (maxReviews * sliderValue[0]) / 100)
        //     return false;
        if (place.category === "SHRINE") return showShrine;
        if (place.category === "TEMPLE") return showTemple;
    });

    return (
        <>
            <Box height="100%" width="100%" className="relative">
                <Flex
                    direction="column"
                    gap="3"
                    className="absolute z-50 top-6 right-6 w-40 "
                    display={{ initial: "none", sm: "flex" }} // Show Filter buttons only above tablets for now
                >
                    <FilterButton
                        category="SHRINE"
                        show={showShrine}
                        setShow={setShowShrine}
                    />
                    <FilterButton
                        category="TEMPLE"
                        show={showTemple}
                        setShow={setShowTemple}
                    />
                    <MarkerSizeToggler
                        value={markerSize}
                        setValue={setMakerSize}
                    />
                    {/* <SliderFilter */}
                    {/*     sliderValue={sliderValue} */}
                    {/*     setSliderValue={setSliderValue} */}
                    {/* /> */}
                </Flex>
                {/* <DynamicMap markers={places} markerSize={markerSize} /> */}
                <Map markers={places} markerSize={markerSize} />
                {/* <Map markers={places} /> */}
            </Box>
        </>
    );
};

export default MapContainer;
