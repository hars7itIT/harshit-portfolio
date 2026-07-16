"use client";

import { useEffect, useState } from "react";
import { toggleTheme } from "@/components/ThemeInit";

const COMMANDS = [
  { label: "Start Portfolio Tour", action: () => triggerAvatarClick() },
  { label: "Unmute / Enable AI Speech Mode", action: () => setMuteState(false) },
  { label: "Mute Jarvis Assistant", action: () => setMuteState(true) },
  { label: "Go to About", action: () => scrollToId("about") },
  { label: "Go to Education / Credentials", action: () => scrollToId("academic-credentials") },
  { label: "Go to Skills Toolkit", action: () => scrollToId("skills") },
  { label: "Go to Projects Directory", action: () => scrollToId("projects") },
  { label: "Go to Experience Timeline", action: () => scrollToId("experience") },
  { label: "Go to Contact Uplink", action: () => scrollToId("contact") },
  { label: "View Resume PDF", action: () => window.open("/resume.pdf", "_blank") },
  { label: "Toggle Dark / Light Theme", action: () => toggleTheme() },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function triggerAvatarClick() {
  window.dispatchEvent(new CustomEvent("jarvis-avatar-click"));
}

function setMuteState(muted: boolean) {
  window.dispatchEvent(new CustomEvent("jarvis-mute-toggle", { detail: muted }));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // sound play
  const playBeep = (type: "click" | "hover") => {
    if (typeof window === "undefined" || !window.AudioContext) return;
    const savedMute = sessionStorage.getItem("jarvis_muted");
    if (savedMute === "true") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "click" ? 850 : 1100, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playBeep("click");
        setOpen((v) => !v);
      }
      // Slash command (if not currently typing inside input elements)
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        playBeep("click");
        setOpen(true);
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
      className="fixed inset-0 z-[999] flex items-start justify-center bg-slate-950/75 backdrop-blur-md pt-[15vh] select-none"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-cyan-500/25 bg-slate-950/95 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corners */}
        <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-cyan-400" />

        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3.5 bg-slate-950/30">
          <span className="font-mono text-cyan-400 text-sm font-bold animate-pulse">$</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search system commands... (e.g. tour, skills)"
            className="w-full bg-transparent font-mono text-xs text-text placeholder:text-slate-600 outline-none uppercase tracking-wide"
          />
          <kbd className="text-[8px] text-muted font-mono border border-line rounded px-1.5 py-0.5 select-none bg-white/5">
            ESC
          </kbd>
        </div>
        
        <ul className="max-h-64 overflow-y-auto py-2 custom-scroll">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-xs text-slate-500 font-mono uppercase tracking-wide">No command matches found.</li>
          )}
          {filtered.map((c) => (
            <li key={c.label}>
              <button
                onClick={() => {
                  playBeep("click");
                  c.action();
                  setOpen(false);
                  setQuery("");
                }}
                onMouseEnter={() => playBeep("hover")}
                className="w-full text-left px-4 py-2.5 text-[10px] font-mono text-text hover:bg-cyan-500/5 hover:text-cyan-400 transition-colors uppercase tracking-wide flex items-center justify-between group/cmd cursor-pointer"
              >
                <span>{c.label}</span>
                <span className="text-[8px] opacity-0 group-hover/cmd:opacity-40 transition-opacity">EXECUTE</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
