import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Sans, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ThemeInit from "@/components/ThemeInit";
import Tracker from "@/components/Tracker";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harshitgupta.dev"),
  title: "Harshit Gupta — CSE Student & Full-Stack / AI Engineer",
  description:
    "Portfolio of Harshit Gupta, a second-year Computer Science & Engineering student at UIET, Panjab University, building full-stack and AI-powered software — WanderLust, FixIQ, and more.",
  keywords: [
    "Harshit Gupta",
    "Full Stack Developer",
    "AI Engineer",
    "UIET Panjab University",
    "Portfolio",
    "WanderLust",
    "FixIQ",
  ],
  openGraph: {
    title: "Harshit Gupta — CSE Student & Full-Stack / AI Engineer",
    description:
      "Building full-stack and AI-powered software. Explore projects, skills, and the journey so far.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit Gupta — CSE Student & Full-Stack / AI Engineer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${instrument.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">
        <ThemeInit />
        <Tracker />
        <ScrollProgress />
        <CustomCursor />
        <CommandPalette />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
