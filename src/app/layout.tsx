import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Fallback for Neue Haas Grotesk Display Pro (the design typeface), which is
// used automatically when available — see README.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Andy Lenárt — Departures 1322",
  description:
    "Departures 1322, Collection 01 by Andy Lenárt: 10 designs, 10 tracks. Every garment holds a world of sound.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
