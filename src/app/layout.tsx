import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { getContent } from "@/lib/content/store";
import "./globals.css";

// The design typeface (licensed files in ./fonts). CSS weights map to its cuts.
const neueHaas = localFont({
  variable: "--font-neue-haas",
  display: "swap",
  src: [
    { path: "./fonts/NeueHaasDisplay-Light.woff2", weight: "300" },
    { path: "./fonts/NeueHaasDisplay-Roman.woff2", weight: "400" },
    { path: "./fonts/NeueHaasDisplay-Medium.woff2", weight: "500" },
    { path: "./fonts/NeueHaasDisplay-Bold.woff2", weight: "700" },
    { path: "./fonts/NeueHaasDisplay-Black.woff2", weight: "900" },
  ],
});

// The few details the design sets in Inter, and the fallback while Neue Haas loads.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  // The design sets the tagline and quote in italic; without the italic
  // files the browser would slant the upright letters instead.
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return { title: settings.siteTitle, description: settings.siteDescription };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${neueHaas.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
