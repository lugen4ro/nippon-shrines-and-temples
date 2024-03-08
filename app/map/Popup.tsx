import { Place } from "@prisma/client";
import { Box, Flex, Heading, Link, Text } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Image } from "../api/images/[id]/route";
import NextImage from "next/image";
import Badge from "./Badge";

const CustomPopup = ({ marker }: { marker: Place }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get<Image[]>("/api/images/" + marker.id).then((res) => {
            setImages(res.data);
        });
    }, []);

    return (
        <Box>
            {
                <Carousel
                    images={images}
                    isLoading={isLoading}
                    onLoad={() => setIsLoading(false)}
                />
            }

            <Box className="p-3">
                <Flex justify="between">
                    <Box>
                        <Heading size="6">{marker.name}</Heading>
                        <Text size="5">{marker.name_jp}</Text>
                    </Box>
                    <Badge category={marker.category} />
                </Flex>

                <Text className="block py-3">{marker.desc}</Text>

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
    onLoad,
}: {
    images: Image[];
    isLoading: boolean;
    onLoad: () => void;
}) => {
    const settings = {
        fade: true,
        // lazyLoad: true,
        // dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: isLoading ? false : true,
        className: "slides",
    };

    return (
        <Slider {...settings}>
            {isLoading && <Skeleton className="SkeletonImage" />}
            {images.map(({ url, icon, source_url, source_name }, index) => (
                <Box key={index} className="popupImageContainer">
                    <img
                        src={url}
                        alt={`Slide ${index + 1}`}
                        onLoad={icon ? onLoad : () => {}}
                        style={{ display: isLoading ? "none" : "block" }}
                    />
                    {!isLoading && (
                        <Box className="absolute bottom-2 right-2 bg-slate-300 bg-opacity-70 px-2 rounded">
                            <a target="_blank" href={source_url}>
                                <Text className="text-xxs text-black">
                                    Source: {source_name}
                                </Text>
                            </a>
                        </Box>
                    )}
                </Box>
            ))}
        </Slider>
    );
};

// <NextImage
//     src={url}
//     alt={`Slide ${index + 1}`}
//     onLoad={icon ? onLoad : () => {}}
//     fill
// />
