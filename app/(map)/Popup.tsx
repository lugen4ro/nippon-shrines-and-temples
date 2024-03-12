import { Place } from "@prisma/client";
import {
    Box,
    Flex,
    Heading,
    Link,
    Badge as RadixBadge,
    Text,
} from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Image } from "../api/images/[id]/route";
import prefectureMap from "../data/prefectures";
import Badge from "./Badge";
import { PlaceWithImages } from "./page";

const CustomPopup = ({ marker }: { marker: PlaceWithImages }) => {
    const images = marker.images;
    const [isLoading, setIsLoading] = useState(
        images.length === 0 ? false : true
    );

    const prefecture =
        prefectureMap[marker.prefecture_slug].prefecture_romaji.split(" ")[0];

    return (
        <Box>
            {
                <Carousel
                    images={images}
                    isLoading={isLoading}
                    marker={marker}
                    onLoad={() => setIsLoading(false)}
                />
            }

            <Box className="p-3">
                <Flex justify="between">
                    <Box>
                        <Box>
                            <Heading size="6" className="inline-block">
                                {marker.name}
                            </Heading>
                        </Box>
                        <Text size="5">{marker.name_jp}</Text>
                        <RadixBadge ml="2">
                            <Text size="2">{prefecture}</Text>
                        </RadixBadge>
                    </Box>
                    <Badge category={marker.category} />
                </Flex>

                <Text className="block py-3" size={{ initial: "1", sm: "2" }}>
                    {marker.desc}
                </Text>

                <Flex gap="2" justify="between" className="px-10">
                    <Flex justify="start" gap="2">
                        <Link target="_blank" href={marker.gmap_link}>
                            Google Maps
                        </Link>
                        <Text>{"(" + marker.total_reviews + " reviews)"}</Text>
                    </Flex>
                    <Box>
                        {marker.wiki_link && (
                            <Link target="_blank" href={marker.wiki_link}>
                                Wikipedia
                            </Link>
                        )}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default CustomPopup;

const Carousel = ({
    images,
    isLoading,
    marker,
    onLoad,
}: {
    images: Image[];
    isLoading: boolean;
    marker: Place;
    onLoad: () => void;
}) => {
    const settings = {
        fade: true,
        dots: isLoading || images.length === 0 ? false : true,
        // infinite: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: isLoading || images.length === 0 ? false : true,
        className: "slides",
    };

    const slider = useRef<Slider>(null);

    return (
        <>
            {!isLoading && images.length === 0 && (
                <Box className="noimage flex justify-center items-center bg-slate-200">
                    <Text className="" size="5">
                        No Images available... :/
                    </Text>
                </Box>
            )}
            {(isLoading || images.length !== 0) && (
                <Slider {...settings} ref={slider}>
                    {isLoading && <Skeleton className="SkeletonImage" />}
                    {images.map(
                        ({ url, icon, source_url, source_name }, index) => (
                            <Box
                                key={index}
                                className="popupImageContainer relative"
                            >
                                <img
                                    src={url}
                                    alt={`Slide ${index + 1} for ${marker.name} / ${marker.name_jp}`}
                                    onLoad={icon ? onLoad : () => {}}
                                    style={{
                                        display: isLoading ? "none" : "block",
                                    }}
                                />
                                {!isLoading && (
                                    <Box className="absolute bottom-1 right-1 bg-slate-300 bg-opacity-60 px-1.5 rounded ">
                                        <a
                                            target="_blank"
                                            href={source_url}
                                            className="flex items-center"
                                        >
                                            <Text className="text-xxs text-black">
                                                Source: {source_name}
                                            </Text>
                                        </a>
                                    </Box>
                                )}
                            </Box>
                        )
                    )}
                </Slider>
            )}
        </>
    );
};
