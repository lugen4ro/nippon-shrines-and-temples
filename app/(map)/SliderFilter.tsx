import * as Slider from "@radix-ui/react-slider";
import { Flex, Text } from "@radix-ui/themes";
import "leaflet/dist/leaflet.css";

const SliderFilter = ({
    sliderValue,
    setSliderValue,
}: {
    sliderValue: number[];
    setSliderValue: (value: number[]) => void;
}) => {
    return (
        <Flex
            direction="column"
            gap="2"
            className="h-20 bg-slate-100 p-2 rounded-xl bg-opacity-70"
        >
            <Flex justify="between">
                <Flex gap="2">
                    <Text className="font-bold">{"Prominence"} </Text>
                    <Text className="font-bold">{">"}</Text>
                </Flex>
                <Text className="font-bold">{sliderValue}</Text>
            </Flex>
            <Slider.Root
                className="w-full h-8 relative"
                min={0}
                max={100}
                step={10}
                value={sliderValue}
                onValueChange={(newValue) => setSliderValue(newValue)}
            >
                <Slider.Track
                    className={
                        "absolute top-0 h-1 bg-slate-400 -translate-y-1/2 w-full"
                    }
                ></Slider.Track>
                <Slider.Thumb
                    className="w-5 h-5 bg-purple-600 absolute rounded-full focus:outline-none shadow-md -translate-y-1/2 -translate-x-1/2"
                    style={{ translate: "" }}
                    aria-label="Volume"
                />
            </Slider.Root>
            <Text className="text-xxs">
                {"Filter by #reviews on Google Maps"}
            </Text>
        </Flex>
    );
};

export default SliderFilter;
