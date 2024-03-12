import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { VscCircleLargeFilled, VscCircleSmallFilled } from "react-icons/vsc";

export type MarkerSize = "small" | "large";

export const MarkerSizeToggler = ({
    value,
    setValue,
}: {
    value: MarkerSize;
    setValue: (newValue: MarkerSize) => void;
}) => {
    return (
        <ToggleGroup.Root
            className="ToggleGroup"
            type="single"
            defaultValue="small"
            value={value}
            onValueChange={(val: MarkerSize) => {
                if (val) setValue(val);
            }}
            aria-label="Marker Size Toggler"
        >
            <ToggleGroup.Item
                className="ToggleGroupItem"
                value="small"
                aria-label="Small Markers"
            >
                <VscCircleSmallFilled />
            </ToggleGroup.Item>

            <ToggleGroup.Item
                className="ToggleGroupItem"
                value="large"
                aria-label="Large Markers"
            >
                <VscCircleLargeFilled />
            </ToggleGroup.Item>
        </ToggleGroup.Root>
    );
};
