import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import NetProvider from "@/components/NetProvider";
import React from "react";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/react";
import { displayFamily, dosis, oswald, condensed } from "./fonts";
import NavBar from "@/components/global/nav-bar";
import { cn } from "@/lib/utils";

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
            accentColor="mint"
            radius="small"
            scaling="110%"
            panelBackground="solid"
            appearance="dark"
          >
            <div className={`flex flex-col min-h-screen mx-auto`}>
              <NavBar />
              <div className="flex-1">{children}</div>
            </div>
          </Theme>
        </body>
        <Analytics />
      </NetProvider>
    </html>
  );
}
