"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, Terminal, Cpu, Award, Sparkles, Code, User, Compass, HelpCircle } from "lucide-react";
import { educationTimeline } from "@/data/timeline";

export default function Hero() {
  const triggerResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/Harshit_Gupta_Resume.docx";
    link.download = "Harshit_Gupta_Resume.docx";
    link.click();
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="lg:col-span-8 space-y-12">
      {/* Intro Header */}
      <div className="space-y-6">
        {/* Status chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] text-emerald-400 tracking-wider uppercase select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for Opportunities
        </div>

        <h1 className="text-4xl font-black tracking-tight text-text sm:text-6xl uppercase leading-none">
          Hi, I&apos;m <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-500 font-extrabold">
            Harshit Gupta
          </span>
        </h1>

        <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted flex flex-wrap gap-2 uppercase">
          <span>Full Stack Developer</span>
          <span className="text-cyan-500/40">•</span>
          <span>AI Enthusiast</span>
          <span className="text-cyan-500/40">•</span>
          <span>Problem Solver</span>
        </p>

        <p className="max-w-2xl text-sm sm:text-base text-muted leading-relaxed font-mono">
          2nd Year CSE Student at UIET Chandigarh. I build modern, responsive, and scalable web applications with clean code and great user experiences.
        </p>

        {/* Quick CTAs */}
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={triggerResumeDownload}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-cyan-500 px-6 py-3 font-mono text-xs font-bold text-slate-950 tracking-wider uppercase transition-all hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Download size={14} />
            <span>Download Resume</span>
          </button>
          
          <button
            onClick={() => handleScrollTo("projects")}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/20 px-6 py-3 font-mono text-xs font-bold text-text tracking-wider uppercase transition-all hover:bg-surface/40 hover:border-cyan-500/30 cursor-pointer"
          >
            <Code size={14} className="text-cyan-400" />
            <span>View Projects</span>
          </button>
        </div>
      </div>

      {/* Grid: What I Do + Stats */}
      <div className="grid gap-4 sm:grid-cols-4 w-full">
        {/* What I Do Card */}
        <div className="sm:col-span-2 rounded-2xl border border-line bg-surface/20 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/25 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={40} className="text-cyan-400" />
          </div>
          <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            What I Do
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed font-mono">
            I build full stack web apps and AI powered solutions that solve user world problems.
          </p>
          <button
            onClick={() => handleScrollTo("about")}
            className="mt-4 font-mono text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 group/btn cursor-pointer"
          >
            Know More <ArrowUpRight size={10} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>

        {/* Stats card: 10+ Projects */}
        <div className="rounded-2xl border border-line bg-surface/20 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/25 transition-all text-center sm:text-left">
          <div className="text-3xl font-black text-text font-mono tracking-tight group-hover:text-cyan-400 transition-colors">10+</div>
          <div className="font-mono text-[9px] font-bold text-muted uppercase tracking-wider mt-1">Projects Completed</div>
        </div>

        {/* Stats card: 2+ Years */}
        <div className="rounded-2xl border border-line bg-surface/20 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/25 transition-all text-center sm:text-left">
          <div className="text-3xl font-black text-text font-mono tracking-tight group-hover:text-cyan-400 transition-colors">2+</div>
          <div className="font-mono text-[9px] font-bold text-muted uppercase tracking-wider mt-1">Years of Learning</div>
        </div>

        {/* Stats card: 15+ Tech */}
        <div className="rounded-2xl border border-line bg-surface/20 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/25 transition-all text-center sm:text-left sm:col-span-2">
          <div className="text-3xl font-black text-text font-mono tracking-tight group-hover:text-cyan-400 transition-colors">15+</div>
          <div className="font-mono text-[9px] font-bold text-muted uppercase tracking-wider mt-1">Technologies Mastered</div>
        </div>

        {/* Stats card: Passion */}
        <div className="rounded-2xl border border-line bg-surface/20 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/25 transition-all text-center sm:text-left sm:col-span-2">
          <div className="text-3xl font-black text-text font-mono tracking-tight group-hover:text-cyan-400 transition-colors">100%</div>
          <div className="font-mono text-[9px] font-bold text-muted uppercase tracking-wider mt-1">Passion & Dedication</div>
        </div>
      </div>
    </div>
  );
}
