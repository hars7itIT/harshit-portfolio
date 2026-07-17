import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Sans, Bricolage_Grotesque, Orbitron, Rajdhani, Audiowide } from "next/font/google";
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

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-audiowide",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harshitgupta.dev"),
  title: "Harshit G. | CSE",
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
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Harshit G. | CSE",
    description:
      "Building full-stack and AI-powered software. Explore projects, skills, and the journey so far.",
    type: "website",
    images: "/profile.jpg"
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit G. | CSE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${instrument.variable} ${bricolage.variable} ${orbitron.variable} ${rajdhani.variable} ${audiowide.variable}`}>
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
