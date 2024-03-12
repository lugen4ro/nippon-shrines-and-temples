import { Box, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./NavBar";
import "./theme-config.css";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Nippon Shrines - Explore Japanese Shrines and Temples on map",
    description:
        "Explore renowned Japanese shrines and temples on a neat looking map.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={` ${inter.variable}`}>
                <Theme
                    accentColor="purple"
                    grayColor="gray"
                    panelBackground="solid"
                    scaling="100%"
                    radius="full"
                    className=""
                >
                    <Box className="flex flex-col h-screen">
                        <NavBar />
                        <main className="h-full">{children}</main>
                    </Box>
                </Theme>
            </body>
        </html>
    );
}
