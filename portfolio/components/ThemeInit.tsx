"use client";

import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  return null;
}

export function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.classList.toggle("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}
