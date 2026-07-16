"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck } from "lucide-react";

const LINES = [
  { prompt: "initialize --core", output: "JARVIS Cognitive Core Online..." },
  { prompt: "whoami", output: "Harshit Gupta // Identity Synced" },
  { prompt: "status --system", output: "B.E. Computer Science, 2nd Year — UIET, Panjab University" },
  { prompt: "specialization", output: "Full-Stack Development, Intelligent Systems & Agentic AI" },
  { prompt: "location", output: "Azamgarh, UP → Chandigarh, India [Active]" },
  { prompt: "boot --interface", output: "Holographic system mapping complete. Ready." }
];

export default function TerminalLoader() {
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fadeAway, setFadeAway] = useState(false);

  useEffect(() => {
    // Check if it's already loaded in this session
    const hasLoaded = sessionStorage.getItem("hasLoadedBefore");
    if (hasLoaded === "true") {
      return; // Do not mount the loading screen
    }
    
    setMounted(true);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    // Line typing speed
    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= LINES.length) {
          clearInterval(lineInterval);
          // Wait after last line and trigger fade
          setTimeout(() => {
            setFadeAway(true);
            sessionStorage.setItem("hasLoadedBefore", "true");
          }, 450);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => {
      clearInterval(progressInterval);
      clearInterval(lineInterval);
    };
  }, []);

  if (!mounted || fadeAway) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#06060f] flex items-center justify-center p-6">
      {/* HUD scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-25 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl rounded-2xl border border-cyan-500/20 bg-slate-950/90 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-md"
      >
        {/* Holographic Glowing Border Corners */}
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-tl-sm" />
        <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-br-sm" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5 bg-slate-950/40">
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-400">
            <Terminal size={12} className="text-cyan-400 animate-pulse" /> SYSTEM SECURE BOOT v2.0
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-0.5 font-mono text-[9px] text-cyan-400">
            <ShieldCheck size={10} className="animate-pulse" /> JARVIS COGNITION
          </div>
        </div>

        {/* Terminal output */}
        <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 min-h-[280px]">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="mb-3 border-l-2 border-cyan-500/20 pl-3">
              <span className="text-cyan-400 select-none">$</span>{" "}
              <span className="text-white font-medium">{line.prompt}</span>
              <div className="text-slate-450 mt-0.5 text-xs sm:text-sm">{line.output}</div>
            </div>
          ))}
          {visibleLines < LINES.length && (
            <span className="inline-block h-4 w-1.5 animate-pulse bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] align-middle ml-1" />
          )}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full shadow-[0_0_8px_#06b6d4] transition-all duration-100"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
