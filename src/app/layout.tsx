import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getContent } from "@/lib/content/store";
import "./globals.css";

// Fallback for Neue Haas Grotesk Display Pro (the design typeface), which is
// used automatically when available — see README.
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
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
