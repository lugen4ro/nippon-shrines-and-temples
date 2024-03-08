import { Box, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import LogoIcon from "../public/icons/icon.svg";
import Image from "next/image";

const NavBar = () => {
    return (
        <nav className=" border-b px-5 py-2">
            <Flex justify="between" className="items-center pr-3">
                <Flex gap="2" className="items-center">
                    {/* <LogoIcon /> */}
                    <Image
                        src="/icons/icon.png"
                        alt="Logo Icon"
                        width="32"
                        height="32"
                    />
                    <Text size="6">Nippon Shrines</Text>
                </Flex>
                <Flex gap="8">
                    <Link href="/map">Map</Link>
                    <Link href="/about">About</Link>
                </Flex>
                <Text>{""}</Text>
            </Flex>
        </nav>
    );
};

export default NavBar;
