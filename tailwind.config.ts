import type { Config } from "tailwindcss";
import { radixThemePreset } from "radix-themes-tw";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        fontSize: {
            xxs: "0.5rem",
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            height: {
                screen: ["100vh", "100dvh"] as any, // as any to circumvent typescript wrongfully seeing this as an arror
            },
            minHeight: {
                screen: ["100vh", "100dvh"] as any,
            },
            maxHeight: {
                screen: ["100vh", "100dvh"] as any,
            },
        },
    },
    plugins: [],
    // presets: [radixThemePreset],
};
export default config;
