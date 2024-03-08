"use client";
import { Category } from "@prisma/client";
import { Box, Flex, Text } from "@radix-ui/themes";
import React from "react";
import { useState } from "react";
import Badge from "./Badge";

interface Props {
    category: Category;
    show: boolean;
    setShow: (val: boolean) => void;
}

const FilterButton = ({ category, show, setShow }: Props) => {
    let text;
    if (category === "TEMPLE") text = "Temple";
    else if (category === "SHRINE") text = "Shrine";
    else text = "Other";

    return (
        <Box className="bg-slate-100 rounded-2xl bg-opacity-70 hover:scale-105 transition-transform duration-200 ease-in-out">
            <button className="p-2" onClick={() => setShow(!show)}>
                <Flex align="center" gap="3">
                    <Badge
                        category={category}
                        className={
                            "inline-flex " +
                            (!show && "bg-slate-200 text-slate-900")
                        }
                    />
                    <Text
                        size="5"
                        className={show ? "font-bold" : "font-light"}
                    >
                        {text}
                    </Text>
                </Flex>
            </button>
        </Box>
    );
};

export default FilterButton;
