import { Category } from "@prisma/client";
import { Badge as BadgeRadix, Box, Text } from "@radix-ui/themes";
import React from "react";

// Radix colors from radix-colors
type Color =
    | "tomato"
    | "red"
    | "ruby"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "brown"
    | "orange"
    | "sky"
    | "mint"
    | "lime"
    | "yellow"
    | "amber"
    | "gold"
    | "bronze"
    | "gray";

const mapping: {
    [key in Category]: { symbol: string; bgColor: string; fgColor: string };
} = {
    SHRINE: { symbol: "神", bgColor: "bg-red-100", fgColor: "text-red-600" },
    TEMPLE: { symbol: "寺", bgColor: "bg-blue-100", fgColor: "text-blue-600" },
    OTHER: { symbol: "？", bgColor: "bg-green-100", fgColor: "text-green-600" },
};

const Badge = ({
    category,
    className,
}: {
    category: Category;
    className?: string;
}) => {
    const m = mapping[category];
    return (
        <Box
            className={
                `flex-none w-9 h-9 ml-1 flex justify-center items-center rounded-full ${m.bgColor} ${m.fgColor} ` +
                className
            }
        >
            <Text size="5" className="font-semibold">
                {m.symbol}
            </Text>
        </Box>
    );
};

export default Badge;
