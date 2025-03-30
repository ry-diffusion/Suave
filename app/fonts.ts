import { Font } from "@react-pdf/renderer";
import { Inter, Dosis, Outfit, Roboto_Condensed } from "next/font/google";

export const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const dosis = Dosis({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dosis",
});

export const condensed = Roboto_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-condensed",
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/Inter.ttf",
    },

    {
      src: "/Inter-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

export const displayFamily = inter;
