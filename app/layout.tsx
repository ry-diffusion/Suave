import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import NetProvider from "@/components/NetProvider";
import React from "react";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/react";
import { displayFamily, condensed } from "./fonts";
import NavBar from "@/components/global/nav-bar";

export const metadata: Metadata = {
  title: "Suave",
  description: "A sua ferramenta do IF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${displayFamily.variable} ${condensed.variable}`}
    >
      <NetProvider>
        <body className={`antialiased`}>
          <Theme
            accentColor="bronze"
            radius="medium"
            scaling="100%"
            grayColor="sage"
            appearance="dark"
          >
            <div
              className={`flex flex-col min-h-screen mx-auto bg-[var(--gray-2)] max-w-screen overflow-hidden`}
            >
              <NavBar />

              <div className="flex flex-1 items-center justify-center">
                {children}
              </div>
            </div>
          </Theme>
        </body>
        <Analytics />
      </NetProvider>
    </html>
  );
}
