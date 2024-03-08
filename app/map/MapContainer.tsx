"use client";
import * as Slider from "@radix-ui/react-slider";
import { Box, Flex, Text } from "@radix-ui/themes";
import "leaflet/dist/leaflet.css";
import { Place } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import FilterButton from "./FilterButton";
import SliderFilter from "./SliderFilter";

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
    const [sliderValue, setSliderValue] = useState([0]);

    const maxReviews = places.reduce(
        (maxValue, obj) => Math.max(maxValue, obj.total_reviews),
        -Infinity
    );

    // Filter by category
    places = places.filter((place) => {
        if (place.total_reviews < (maxReviews * sliderValue[0]) / 100)
            return false;
        if (place.category === "SHRINE") return showShrine;
        if (place.category === "TEMPLE") return showTemple;
    });

    return (
        <>
            <Box height="100%" width="100%" className="relative">
                <Flex
                    direction="column"
                    gap="6"
                    className="absolute z-50 right-10 top-10 w-40 "
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
                    {/* <SliderFilter */}
                    {/*     sliderValue={sliderValue} */}
                    {/*     setSliderValue={setSliderValue} */}
                    {/* /> */}
                </Flex>
                <DynamicMap markers={places} />
                {/* <Map markers={places} /> */}
            </Box>
        </>
    );
};

export default MapContainer;
