"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, ArrowUpRight, ShieldCheck, Activity, Wifi, Compass } from "lucide-react";
import JarvisVoiceAssistant from "./JarvisVoiceAssistant";

const LINES = [
  { prompt: "initialize --core", output: "JARVIS Cognitive Core Online..." },
  { prompt: "whoami", output: "Harshit Gupta // Identity Synced" },
  { prompt: "status --system", output: "B.E. Computer Science, 2nd Year — UIET, Panjab University" },
  { prompt: "specialization", output: "Full-Stack Development, Intelligent Systems & Agentic AI" },
  { prompt: "location", output: "Azamgarh, UP → Chandigarh, India [Active]" },
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisibleLines(LINES.length);
      setShowProfile(true);
      setLoadProgress(100);
      return;
    }
    
    // Simulate loading progress bar
    const progressInterval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    if (visibleLines < LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 600);
      return () => {
        clearTimeout(t);
        clearInterval(progressInterval);
      };
    } else {
      const t = setTimeout(() => setShowProfile(true), 300);
      return () => {
        clearTimeout(t);
        clearInterval(progressInterval);
      };
    }
  }, [visibleLines]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-12"
    >
      {/* Background Aurora Orbs (Bleeding through grid) */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[450px] w-[450px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Futuristic Scanline HUD Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-20" />

      <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-8">
        
        {/* Interactive Holographic Jarvis Voice Assistant */}
        <JarvisVoiceAssistant avatarSrc="/profile.jpg" name="Harshit Gupta" />

        {/* 3-Column Holographic Layout */}
        <div className="grid gap-6 lg:grid-cols-4 w-full">
          
          {/* Left HUD Panel (Diagnostics) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-between rounded-xl border border-white/5 bg-slate-950/20 p-5 font-mono text-[10px] text-slate-400 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />

            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2 flex items-center justify-between">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">SYSTEM DIAGNOSTICS</span>
                <Activity size={12} className="text-cyan-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>COGNITIVE LOAD:</span>
                  <span className="text-white">14.8%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[14.8%] shadow-[0_0_8px_#06b6d4]" />
                </div>
                <div className="flex justify-between">
                  <span>MEM POOL ALLOC:</span>
                  <span className="text-white">824MB / 2.0GB</span>
                </div>
                <div className="flex justify-between">
                  <span>SECTOR VECTOR:</span>
                  <span className="text-cyan-400">0x4F9A</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="flex items-center gap-1"><Wifi size={10} className="text-emerald-400 animate-pulse" /> LINK SECURE</span>
              <span className="text-slate-500">12:00:00</span>
            </div>
          </motion.div>

          {/* Center Main HUD Panel (Terminal Core) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-slate-950/90 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden backdrop-blur-md"
          >
            {/* Holographic Glowing Border Corners */}
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-tl-sm" />
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-br-sm" />

            {/* Header Panel Bar */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-slate-400">
                <Terminal size={11} className="text-cyan-400" /> COGNITIVE CORE SYSTEM v2.0
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-0.5 font-mono text-[9px] text-cyan-400">
                <ShieldCheck size={10} className="animate-pulse" /> JARVIS SECURE
              </div>
            </div>

            {/* Code Output Segment */}
            <div className="px-6 py-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="mb-3 border-l-2 border-cyan-500/20 pl-3">
                  <span className="text-cyan-400 select-none">$</span>{" "}
                  <span className="text-white font-medium">{line.prompt}</span>
                  <div className="text-slate-450 mt-1 text-slate-400">{line.output}</div>
                </div>
              ))}
              {visibleLines < LINES.length && (
                <span className="inline-block h-3.5 w-1.5 animate-pulse bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] align-middle" />
              )}
            </div>

            {/* Loading progress meter */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full shadow-[0_0_8px_#06b6d4] transition-all" style={{ width: `${loadProgress}%` }} />
            </div>
          </motion.div>

          {/* Right HUD Panel (Tracking) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-between rounded-xl border border-white/5 bg-slate-950/20 p-5 font-mono text-[10px] text-slate-400 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />

            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2 flex items-center justify-between">
                <span className="text-cyan-400 font-bold uppercase tracking-wider">COGNITIVE MODULES</span>
                <Compass size={12} className="text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>RESUME CHECKER:</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="flex justify-between">
                  <span>ROADMAP GENERATOR:</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="flex justify-between">
                  <span>MOCK INTERVIEWER:</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="flex justify-between">
                  <span>CHAT CONTEXT:</span>
                  <span className="text-purple-400">SYNCED</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-right text-slate-500 font-bold">
              HARSHIT.SYS // 127.0.0.1
            </div>
          </motion.div>

        </div>

        {/* Profile Card & Info */}
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-4"
          >
            {/* Title / Name */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl uppercase">
              <span className="block opacity-85 text-xs font-bold tracking-[0.3em] uppercase text-cyan-400 mb-2 font-mono">
                System Interface Initialization Complete
              </span>
              Harshit Gupta
            </h1>
            
            {/* Tagline */}
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed font-mono">
              [SYSTEM_CORE] Building premium next-gen applications, automated AI agents, and secure database backends.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase transition-all hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <span>Initialize Core Explorer</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              
              <a
                href="/Harshit_Gupta_Resume.docx"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs font-bold text-slate-350 tracking-wider uppercase transition-all hover:bg-white/10 hover:border-cyan-500/30 hover:text-white"
              >
                <span>Read System Credentials</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
