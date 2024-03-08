import { Category } from "@prisma/client";
import Image from "next/image";

const colorMap = {
    SHRINE: "border-red-500",
    TEMPLE: "border-blue-500",
    OTHER: "border-green-500",
};

const CustomMarker = ({
    icon_url,
    icon_size_rem,
    icon_size_px,
    category,
}: {
    icon_url: string | null;
    icon_size_rem: number;
    icon_size_px: number;
    category: Category;
}) => {
    const icon = icon_url ? icon_url : "icons/placeholder.png";
    return (
        <div
            className={
                "iconContainer rounded-full overflow-hidden flex border-4 " +
                `${colorMap[category]}`
            }
            style={{
                width: icon_size_rem + "rem",
                height: icon_size_rem + "rem",
            }}
        >
            <Image
                src={icon}
                alt="Icon Image"
                width={icon_size_px}
                height={icon_size_px}
            />
        </div>
    );
};

export default CustomMarker;
