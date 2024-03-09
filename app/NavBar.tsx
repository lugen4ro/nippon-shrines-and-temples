import { Box, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import LogoIcon from "../public/icons/icon.svg";
import Image from "next/image";

const NavBar = () => {
    return (
        <nav className=" border-b px-5 py-2">
            <Flex justify="between" className="items-center pr-3">
                <Link href="/map">
                    <Flex gap="2" className="items-center">
                        <Image
                            src="/icons/icon.png"
                            alt="Logo Icon"
                            width="32"
                            height="32"
                        />
                        <Text size="6">Nippon Shrines</Text>
                    </Flex>
                </Link>
                <Link href="/about">About</Link>
            </Flex>
        </nav>
    );
};

export default NavBar;
