import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NetProvider from "./components/NetProvider";
import { AuthProvider } from "./AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Suave",
  description: "A sua ferramenta do IF Goiano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      <NetProvider>
        <AuthProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-slate-300`}
          >
            {children}
          </body>
        </AuthProvider>
      </NetProvider>
    </html>
  );
}
