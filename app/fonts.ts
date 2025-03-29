import {
  Oswald,
  Dosis,
  Outfit,
  Red_Hat_Text,
  Roboto_Condensed,
} from "next/font/google";

export const oswald = Oswald({
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

export const displayFamily = dosis;
