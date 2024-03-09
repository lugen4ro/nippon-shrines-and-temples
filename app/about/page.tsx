import { Flex, Box, Container, Heading, Text, Link } from "@radix-ui/themes";
import { Metadata } from "next";
import React from "react";

// TODO: Style heading for all pages in on place (Cannot apply bottom-margin here...)
const AboutPage = () => {
    return (
        <Container className="py-5 px-5" size="3">
            <Heading as="h1">About this website</Heading>
            <Flex direction="column" gap="5">
                <Text>Hi there, thanks for visiting my website!</Text>
                <Text>
                    I created this website as a means to look around Japan and
                    explore major Shrines and Temples by map. Other existing
                    methods were either too cluttered with unrelated
                    information, too detailed and hard to navigate, or not in
                    the form of a simple clean map. I hope you enjoy using this
                    site as much as I do!
                </Text>
                <Text>
                    The explanations for the shrines and temples on each popup
                    card were auto-generated using Chat-GPT. I read through them
                    to make sure that they are accurate descriptions, but still
                    keep in mind that some inaccuracies might be present.
                </Text>
                <Text>
                    All images used are free material. Their sources are
                    displayed in the bottom right corner of each image.
                </Text>
                <Text>
                    The favicon / icon of the page is from{" "}
                    <Link
                        target="_blank"
                        href="https://github.com/twitter/twemoji"
                    >
                        twemoji
                    </Link>
                    .
                </Text>
            </Flex>
        </Container>
    );
};

export default AboutPage;

export const metadata: Metadata = {
    title: "About - Nippon Shrines",
    description: "About Nippon Shrines",
};
