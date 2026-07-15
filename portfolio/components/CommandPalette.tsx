"use client";

import { useEffect, useState } from "react";
import { toggleTheme } from "@/components/ThemeInit";

const COMMANDS = [
  { label: "Go to About", action: () => scrollToId("about") },
  { label: "Go to Education", action: () => scrollToId("education") },
  { label: "Go to Skills", action: () => scrollToId("skills") },
  { label: "Go to Experience", action: () => scrollToId("experience") },
  { label: "Go to Projects", action: () => scrollToId("projects") },
  { label: "Go to Achievements", action: () => scrollToId("achievements") },
  { label: "Go to Coding Profiles", action: () => scrollToId("profiles") },
  { label: "Go to Contact", action: () => scrollToId("contact") },
  { label: "Download Resume", action: () => window.open("/resume.pdf", "_blank") },
  { label: "Toggle Dark / Light Mode", action: () => toggleTheme() },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/70 backdrop-blur-sm pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-md border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="font-mono text-signal text-sm">$</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className="w-full bg-transparent font-mono text-sm text-text placeholder:text-muted outline-none"
          />
          <kbd className="text-[10px] text-muted font-mono border border-line rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm text-muted font-mono">No matches.</li>
          )}
          {filtered.map((c) => (
            <li key={c.label}>
              <button
                onClick={() => {
                  c.action();
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-2 text-sm font-mono text-text hover:bg-surface2 hover:text-signal transition-colors"
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
