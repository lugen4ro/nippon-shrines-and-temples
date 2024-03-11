import { Place } from "@prisma/client";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import {
    Box,
    Button,
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

const CustomPopup = ({ marker }: { marker: Place }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get<Image[]>("/api/images/" + marker.id).then((res) => {
            setImages(res.data);
        });
    }, []);

    const prefecture =
        prefectureMap[marker.prefecture_slug].prefecture_romaji.split(" ")[0];

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
                        <Box>
                            <Heading size="6" className="inline-block">
                                {marker.name}
                            </Heading>
                            <RadixBadge ml="2">
                                <Text size="2">{prefecture}</Text>
                            </RadixBadge>
                        </Box>
                        <Text size="5">{marker.name_jp}</Text>
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
        dots: isLoading ? false : true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: isLoading ? false : true,
        className: "slides",
    };

    const slider = useRef<Slider>(null);

    return (
        <>
            <Slider {...settings} ref={slider}>
                {isLoading && <Skeleton className="SkeletonImage" />}
                {images.map(({ url, icon, source_url, source_name }, index) => (
                    <Box key={index} className="popupImageContainer relative">
                        <img
                            src={url}
                            alt={`Slide ${index + 1}`}
                            onLoad={icon ? onLoad : () => {}}
                            style={{ display: isLoading ? "none" : "block" }}
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
                ))}
            </Slider>
        </>
    );
};
