import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--bg-dark)",
        surface: "var(--glass-bg)",
        line: "var(--glass-border)",
        text: "var(--fg-light)",
        muted: "var(--text-muted)",
        signal: "var(--neon-cyan)",
        signaldim: "var(--neon-cyan-glow)",
        warn: "var(--neon-pink)",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
