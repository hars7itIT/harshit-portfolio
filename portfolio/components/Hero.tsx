"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Cpu, Sparkles, Code, Terminal, Wifi } from "lucide-react";

// Types
type SkillHoverData = {
  name: string;
  percent: string;
  projects: string;
  level: string;
};

// Tech Stack Data
const TECH_STACK_ITEMS: SkillHoverData[] = [
  { name: "HTML5", percent: "95%", projects: "12 projects", level: "Expert" },
  { name: "CSS3", percent: "90%", projects: "12 projects", level: "Expert" },
  { name: "JavaScript", percent: "92%", projects: "15 projects", level: "Expert" },
  { name: "React", percent: "90%", projects: "8 projects", level: "Expert" },
  { name: "Node.js", percent: "85%", projects: "6 projects", level: "Advanced" },
  { name: "Express.js", percent: "82%", projects: "6 projects", level: "Advanced" },
  { name: "MongoDB", percent: "80%", projects: "5 projects", level: "Advanced" },
  { name: "MySQL", percent: "85%", projects: "4 projects", level: "Advanced" },
  { name: "Git", percent: "88%", projects: "All projects", level: "Advanced" },
  { name: "GitHub", percent: "90%", projects: "All projects", level: "Expert" },
  { name: "VS Code", percent: "95%", projects: "Daily IDE", level: "Expert" },
  { name: "Python", percent: "80%", projects: "4 projects", level: "Advanced" },
  { name: "C++", percent: "90%", projects: "Data Structures", level: "Expert" },
];

export default function Hero() {
  const [activeState, setActiveState] = useState<"idle" | "listening" | "thinking" | "speaking" | "offline">("idle");
  const [hoveredSkill, setHoveredSkill] = useState<SkillHoverData | null>(null);

  // Live portfolio metrics (simulating active real-time updates)
  const [metrics, setMetrics] = useState({
    projectsCount: 10,
    githubRepos: 24,
    techLearned: 15,
    commits: 348,
    uptime: "00:00:00"
  });

  // Sound play helper
  const triggerBeep = (type: "click" | "hover" | "boot" | "alert") => {
    if (typeof window === "undefined" || !window.AudioContext) return;
    const savedMute = sessionStorage.getItem("jarvis_muted");
    if (savedMute === "true") return;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1050, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch(e) {}
  };

  // Listen to Jarvis State changes
  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const state = (e as CustomEvent).detail as any;
      setActiveState(state);
    };

    window.addEventListener("jarvis-state-changed", handleStateChange);

    // Live Metrics Ticker Loop
    const metricsInterval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        commits: prev.commits + (Math.random() > 0.97 ? 1 : 0) // Simulates live updates
      }));
    }, 4000);

    // Uptime clock
    const start = Date.now();
    const uptimeInterval = setInterval(() => {
      const diff = Date.now() - start;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setMetrics((prev) => ({ ...prev, uptime: `${hours}:${minutes}:${seconds}` }));
    }, 1000);

    return () => {
      window.removeEventListener("jarvis-state-changed", handleStateChange);
      clearInterval(metricsInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  const handleScrollToProjects = () => {
    triggerBeep("click");
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const triggerResumeView = () => {
    triggerBeep("click");
    window.open("/Harshit_Gupta_Resume.docx", "_blank");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-stretch select-none font-mono">
      {/* -----------------------------------------------------------
          LEFT COLUMN: Intro + What I Do + Tech Stack (Span 7)
          ----------------------------------------------------------- */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        
        {/* Intro block */}
        <div className="space-y-4 text-left">
          {/* Status chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[9px] text-emerald-400 tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            Available for Opportunities
          </div>

          <h1 className="text-3xl font-black tracking-tight text-text sm:text-5xl uppercase leading-none font-orbitron">
            Hi, I&apos;m <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-500 font-black">
              Harshit Gupta
            </span>
          </h1>

          <p className="text-[10px] sm:text-xs font-bold tracking-wider text-cyan-400 uppercase font-rajdhani flex items-center gap-2">
            <span>Full Stack Developer</span>
            <span className="opacity-30">•</span>
            <span>AI Enthusiast</span>
            <span className="opacity-30">•</span>
            <span>Problem Solver</span>
          </p>

          <p className="text-xs text-muted leading-relaxed font-sans font-medium">
            2nd Year CSE Student at UIET Chandigarh. I build modern, responsive, and scalable web applications with clean code and great user experiences.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={triggerResumeView}
              onMouseEnter={() => triggerBeep("hover")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-cyan-500 px-5 py-2.5 text-[10px] font-bold text-slate-950 tracking-wider uppercase transition-all hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <Download size={12} />
              <span>Download Resume</span>
            </button>
            
            <button
              onClick={handleScrollToProjects}
              onMouseEnter={() => triggerBeep("hover")}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/20 px-5 py-2.5 text-[10px] font-bold text-text tracking-wider uppercase transition-all hover:bg-surface/40 hover:border-cyan-500/30 cursor-pointer"
            >
              <Code size={12} className="text-cyan-400" />
              <span>View Projects</span>
            </button>
          </div>
        </div>

        {/* WHAT I DO SECTION */}
        <div className="space-y-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            // What I Do
          </div>
          
          <div className="grid gap-3 grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-xl border border-line bg-surface/15 p-3.5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/25 transition-all">
              <h4 className="text-[10px] font-bold text-text uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Full Stack Developer
              </h4>
              <p className="mt-1 text-[9px] text-muted font-sans font-medium">Building End-to-End Web Applications</p>
              <div className="mt-3 w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div className="bg-cyan-400 h-full w-[85%] transition-all duration-500" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-line bg-surface/15 p-3.5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/25 transition-all">
              <h4 className="text-[10px] font-bold text-text uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                AI & ML Enthusiast
              </h4>
              <p className="mt-1 text-[9px] text-muted font-sans font-medium">Exploring Intelligent Solutions</p>
              <div className="mt-3 w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div className="bg-purple-400 h-full w-[70%] transition-all duration-500" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-line bg-surface/15 p-3.5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/25 transition-all">
              <h4 className="text-[10px] font-bold text-text uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                Problem Solver
              </h4>
              <p className="mt-1 text-[9px] text-muted font-sans font-medium">Solving Real-world Challenges</p>
              <div className="mt-3 w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div className="bg-pink-400 h-full w-[90%] transition-all duration-500" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-line bg-surface/15 p-3.5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/25 transition-all">
              <h4 className="text-[10px] font-bold text-text uppercase flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Fast Learner
              </h4>
              <p className="mt-1 text-[9px] text-muted font-sans font-medium">Always Exploring New Technologies</p>
              <div className="mt-3 w-full bg-slate-900 h-1 rounded overflow-hidden">
                <div className="bg-amber-400 h-full w-[95%] transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* TECH STACK SECTION WITH DYNAMIC HOVER */}
        <div className="space-y-3 relative">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span>// Tech Stack</span>
            <span className="text-[8px] text-cyan-400 lowercase tracking-normal">hover nodes for parameters</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TECH_STACK_ITEMS.map((item) => (
              <button
                key={item.name}
                onMouseEnter={() => {
                  triggerBeep("hover");
                  setHoveredSkill(item);
                }}
                onMouseLeave={() => setHoveredSkill(null)}
                className="px-2.5 py-1.5 rounded-xl border border-line bg-surface/15 hover:border-cyan-500/40 text-[9px] font-bold text-muted hover:text-cyan-400 transition-colors uppercase cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Hover parameters tooltip */}
          <AnimatePresence>
            {hoveredSkill && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 bg-slate-955 border border-cyan-500/35 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 font-mono text-[9px] min-w-[200px]"
              >
                <div className="border-b border-white/5 pb-1.5 mb-1.5 flex items-center justify-between">
                  <span className="font-bold text-text uppercase tracking-widest">{hoveredSkill.name}</span>
                  <span className="text-cyan-400 font-bold">{hoveredSkill.percent}</span>
                </div>
                <div className="space-y-0.5 text-muted">
                  <div>LEVEL: <span className="text-text uppercase font-bold">{hoveredSkill.level}</span></div>
                  <div>EXPERIENCE: <span className="text-text uppercase font-bold">{hoveredSkill.projects}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* -----------------------------------------------------------
          CENTER COLUMN: System Status + Hologram Robot Avatar (Span 5)
          ----------------------------------------------------------- */}
      <div className="lg:col-span-5 flex flex-col justify-between items-center bg-slate-955 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-lg relative overflow-hidden group hover:border-cyan-500/25 transition-all duration-300">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />

        {/* System Status Ticker */}
        <div className="w-full bg-slate-900/60 rounded-xl p-3 space-y-1.5 border border-line select-none text-left">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
            <span>Portfolio Status Metrics</span>
            <span className="text-cyan-400 animate-pulse uppercase">Uptime: {metrics.uptime}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
            <div className="flex justify-between border-r border-white/5 pr-2">
              <span className="text-muted uppercase">Projects:</span>
              <span className="text-text">{metrics.projectsCount}+ Nodes</span>
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-muted uppercase">Github:</span>
              <span className="text-text">{metrics.githubRepos} Repos</span>
            </div>
            <div className="flex justify-between border-r border-white/5 pr-2">
              <span className="text-muted uppercase">Commits:</span>
              <span className="text-cyan-400 animate-pulse">{metrics.commits} Total</span>
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-muted uppercase">Jarvis Core:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping" />
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Concentric Rotating Holographic rings & Robot Avatar centerpiece */}
        <div className="relative flex flex-col items-center justify-center p-6 my-4 select-none">
          
          {/* Concentric rotating holographic svg rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-110">
            <svg className={`w-52 h-52 absolute transform transition-transform ${activeState === 'speaking' || activeState === 'listening' ? 'animate-spin' : 'animate-pulse'}`} style={{ animationDuration: activeState === 'speaking' ? "8s" : activeState === 'listening' ? "5s" : "15s" }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                className={`fill-none stroke-dasharray-[3,3] ${
                  activeState === "listening"
                    ? "stroke-purple-500/40"
                    : activeState === "speaking"
                      ? "stroke-cyan-400/50"
                      : activeState === "thinking"
                        ? "stroke-pink-500/40"
                        : activeState === "offline"
                          ? "stroke-rose-500/10"
                          : "stroke-cyan-500/20"
                }`}
                strokeWidth="0.75"
              />
            </svg>
            
            <svg className={`w-44 h-44 absolute transform transition-transform ${activeState === 'speaking' || activeState === 'thinking' ? 'animate-spin' : 'animate-pulse'}`} style={{ animationDuration: activeState === 'speaking' ? "5s" : "12s", animationDirection: "reverse" }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`fill-none ${
                  activeState === "listening"
                    ? "stroke-purple-500/50"
                    : activeState === "speaking"
                      ? "stroke-cyan-400/60"
                      : activeState === "thinking"
                        ? "stroke-pink-500/50"
                        : activeState === "offline"
                          ? "stroke-rose-500/20"
                          : "stroke-cyan-500/30"
                }`}
                strokeWidth="1.25"
                strokeDasharray="20 40 10 30"
              />
            </svg>

            <div className={`w-36 h-36 rounded-full absolute border border-dashed transition-all duration-500 ${
              activeState === "listening"
                ? "border-purple-500/30 animate-pulse"
                : activeState === "speaking"
                  ? "border-cyan-400/40 animate-ping"
                  : activeState === "thinking"
                    ? "border-pink-500/30 animate-pulse"
                    : activeState === "offline"
                      ? "border-rose-500/15"
                      : "border-cyan-500/15"
            }`} style={{ animationDuration: "1.5s" }} />
          </div>

          {/* Core circular robot avatar container */}
          <div 
            className={`relative h-28 w-28 rounded-full border p-1 flex items-center justify-center bg-slate-950/90 shadow-[0_0_30px_rgba(6,182,212,0.05)] cursor-pointer select-none z-10 transition-all duration-500 ${
              activeState === "listening"
                ? "border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)] scale-105"
                : activeState === "speaking"
                  ? "border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)] scale-105"
                  : activeState === "thinking"
                    ? "border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.35)] scale-105 animate-pulse"
                    : activeState === "offline"
                      ? "border-rose-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] grayscale opacity-50"
                      : "border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
            }`}
          >
            <img
              src="/jarvis-avatar.jpg"
              alt="JARVIS Assistant"
              className="h-full w-full object-cover rounded-full"
            />

            {/* Glowing state scanning bar indicator */}
            {activeState === "thinking" && (
              <div className="absolute inset-x-0 h-0.5 bg-pink-400 shadow-[0_0_8px_#ec4899] animate-scanline" />
            )}
          </div>

          {/* Floating HUD node texts */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <span className="absolute top-2 left-6 text-[7px] text-slate-500 border border-line bg-surface/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">REACT.JS</span>
            <span className="absolute top-6 right-2 text-[7px] text-purple-400/60 border border-purple-500/10 bg-purple-500/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse" style={{ animationDelay: '0.4s' }}>AI.NODE</span>
            <span className="absolute bottom-4 left-2 text-[7px] text-slate-500 border border-line bg-surface/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse" style={{ animationDelay: '0.8s' }}>NODE.JS</span>
            <span className="absolute bottom-6 right-4 text-[7px] text-cyan-400/60 border border-cyan-500/10 bg-cyan-500/5 px-1 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse" style={{ animationDelay: '1.2s' }}>C++</span>
          </div>

        </div>

        {/* Jarvis Title Label */}
        <div className="text-center space-y-1 select-none">
          <h4 className="font-audiowide text-base tracking-widest text-text uppercase flex items-center justify-center gap-1.5">
            JARVIS
          </h4>
          <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-center">
            <span className={`h-1.5 w-1.5 rounded-full ${activeState === 'offline' ? 'bg-rose-500' : 'bg-emerald-400 animate-pulse'}`} />
            AI PORTFOLIO ASSISTANT • {activeState === 'offline' ? 'MUTED' : 'ONLINE'}
          </p>
        </div>

      </div>
    </div>
  );
}
