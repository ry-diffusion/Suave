import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import NetProvider from "@/components/NetProvider";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    weight: "500",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    weight: "400",
});

export const metadata: Metadata = {
    title: "Suave",
    description: "A sua ferramenta do IF",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="pt-BR">
        <NetProvider>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-slate-300`}
            >
            {children}
            </body>
        </NetProvider>
        </html>
    );
}
