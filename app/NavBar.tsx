import { Box, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import LogoIcon from "../public/icons/icon.svg";
import Image from "next/image";

const NavBar = () => {
    return (
        <nav className="navbar z-50 px-5 py-2 relative">
            <Flex justify="between" className="items-center pr-3">
                <Link href="/">
                    <Flex gap="3" className="items-center">
                        <Image
                            src="/icons/icon.png"
                            alt="Logo Icon"
                            width="32"
                            height="32"
                        />
                        <Text size="5" weight="bold">
                            Nippon Shrines
                        </Text>
                    </Flex>
                </Link>
                <Link href="/about">About</Link>
            </Flex>
        </nav>
    );
};

export default NavBar;
