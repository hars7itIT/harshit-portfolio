"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileCode, ChevronRight, Github, ExternalLink, Cpu, HardDrive, Info, Layers, Monitor, Network, Server, LayoutGrid, Minimize2, Maximize2, Activity, Home } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { projects, Project } from "@/data/projects";

type Category = "All" | "Full Stack" | "AI" | "College Project";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] ?? null);

  // Hook 1: Listen for JARVIS category filter requests
  useEffect(() => {
    const handleFilter = (e: Event) => {
      const cat = (e as CustomEvent).detail as Category;
      setSelectedCategory(cat);
      const firstOfCat = projects.find((p) => cat === "All" || p.category === cat);
      setSelectedProject(firstOfCat ?? null);
    };

    window.addEventListener("jarvis-filter", handleFilter);
    return () => window.removeEventListener("jarvis-filter", handleFilter);
  }, []);

  // Hook 2: Dispatch event for project explanation when card selected
  useEffect(() => {
    if (selectedProject) {
      const event = new CustomEvent("jarvis-explain-project", { detail: selectedProject });
      window.dispatchEvent(event);
    }
  }, [selectedProject]);

  // Filter projects by category
  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.category === selectedCategory;
  });

  const getFileExtension = (cat: string) => {
    if (cat === "Full Stack") return ".app";
    if (cat === "AI") return ".ai";
    return ".sh";
  };

  const getProjectFlow = (slug: string) => {
    switch (slug) {
      case "womenhealthcare":
        return [
          { label: "Client", icon: Monitor },
          { label: "Next.js App", icon: Network },
          { label: "API Routes", icon: FileCode },
          { label: "PostgreSQL DB", icon: HardDrive },
        ];
      case "wanderlust":
        return [
          { label: "EJS Pages", icon: Monitor },
          { label: "Express App", icon: Network },
          { label: "Mongoose", icon: Layers },
          { label: "MongoDB", icon: HardDrive },
        ];
      case "fixiq":
        return [
          { label: "Browser Client", icon: Monitor },
          { label: "Vanilla JS", icon: FileCode },
          { label: "Anthropic API", icon: Cpu },
          { label: "Anthropic Server", icon: Server },
        ];
      case "uiet-attendance-tracker":
      default:
        return [
          { label: "Browser Client", icon: Monitor },
          { label: "Admin Panel", icon: LayoutGrid },
          { label: "Subject Routes", icon: FileCode },
          { label: "Memory State", icon: HardDrive },
        ];
    }
  };

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24 relative">
      {/* Background neon orb */}
      <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/30 pb-6 mb-2">
        <SectionHeading
          eyebrow="directory"
          title="Project Registry Explorer"
          description="Inspect full-stack nodes, system configurations, and architectural plans inside a holographic file explorer."
        />
        {/* Explorer Status Card */}
        <div className="flex items-center gap-3 bg-surface/10 border border-line rounded-xl px-4 py-2.5 backdrop-blur-sm self-start sm:self-auto shadow-md">
          <div className="h-7 w-7 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <LayoutGrid size={13} />
          </div>
          <div>
            <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Explorer Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
          <div className="h-1.5 w-1.5 rounded-full border border-slate-700 ml-4 hidden sm:block" />
        </div>
      </div>

      {/* Holographic Finder Container */}
      <div className="mt-12 rounded-2xl border border-line bg-surface/40 backdrop-blur-md overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[560px] relative group hover:border-cyan-500/20 transition-all duration-300">
        
        {/* Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />

        {/* 1. Sidebar (Folder Navigator) */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-line bg-surface/20 p-4 flex flex-col sm:flex-row lg:flex-col justify-between gap-4 lg:space-y-6">
          <div className="w-full sm:w-2/3 lg:w-auto">
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Directories
            </span>
            <ul className="flex sm:flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none font-mono text-xs w-full lg:w-auto shrink-0">
              {(["All", "Full Stack", "AI", "College Project"] as Category[]).map((cat) => (
                <li key={cat} className="shrink-0">
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      // Auto-select first project in new category if any
                      const firstOfCat = projects.find((p) => cat === "All" || p.category === cat);
                      setSelectedProject(firstOfCat ?? null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedCategory === cat
                        ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20"
                        : "text-muted hover:text-text hover:bg-white/5"
                    }`}
                  >
                    <Folder size={14} className={selectedCategory === cat ? "text-cyan-400" : "text-slate-500"} />
                    <span>{cat === "All" ? "root" : cat.toLowerCase().replace(/\s+/g, "-")}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-0 sm:pt-4 sm:border-t lg:border-t border-line w-full sm:w-1/3 lg:w-auto">
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              System Volume
            </span>
            <div className="space-y-2 font-mono text-[10px] text-muted">
              <div className="flex justify-between">
                <span>DISK SPACE:</span>
                <span className="text-text">84.2 GB / 256 GB</span>
              </div>
              <div className="w-full bg-surface/20 h-1 rounded overflow-hidden">
                <div className="bg-cyan-500 h-full w-[33%]" />
              </div>
            </div>
          </div>
 
          {/* Holographic 3D Cube Visual */}
          <div className="hidden lg:block pt-4 border-t border-line/40 relative overflow-hidden group/cube">
            <svg viewBox="0 0 200 160" className="w-full h-auto text-cyan-500/10">
              {/* Grid Lines Background */}
              <path d="M 20 80 L 100 40 L 180 80 L 100 120 Z" fill="none" stroke="rgba(6,182,212,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              <path d="M 20 80 L 20 120 L 100 160 L 180 120 L 180 80" fill="none" stroke="rgba(6,182,212,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="100" y1="120" x2="100" y2="160" stroke="rgba(6,182,212,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              
              {/* 3D Animated Isometric Cube */}
              <g className="animate-pulse duration-[3s]">
                {/* Bottom Face */}
                <polygon points="100,125 60,105 100,85 140,105" fill="rgba(6,182,212,0.02)" stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
                
                {/* Top Face */}
                <polygon points="100,75 60,55 100,35 140,55" fill="rgba(168,85,247,0.03)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8" />
                
                {/* Side Faces */}
                <polygon points="60,105 60,55 100,75 100,125" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
                <polygon points="140,105 140,55 100,75 100,125" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
                
                {/* Core glowing cube */}
                <polygon points="100,108 75,95 100,82 125,95" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.5)" strokeWidth="1.2" />
                <polygon points="100,92 75,79 100,66 125,79" fill="rgba(168,85,247,0.2)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.2" />
                <line x1="75" y1="95" x2="75" y2="79" stroke="rgba(6,182,212,0.5)" strokeWidth="1.2" />
                <line x1="125" y1="95" x2="125" y2="79" stroke="rgba(6,182,212,0.5)" strokeWidth="1.2" />
                <line x1="100" y1="108" x2="100" y2="92" stroke="rgba(6,182,212,0.5)" strokeWidth="1.2" />
              </g>
              
              {/* Tech Bracket Accents */}
              <path d="M 15 35 L 15 15 L 35 15" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
              <path d="M 185 35 L 185 15 L 165 15" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
              <path d="M 15 125 L 15 145 L 35 145" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
              <path d="M 185 125 L 185 145 L 165 145" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        {/* 2. File List (Folder Contents) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-line flex flex-col justify-between max-h-[560px]">
          <div className="p-4 space-y-3 overflow-y-auto custom-scroll flex-1">
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Contents: {selectedCategory === "All" ? "root" : selectedCategory.toLowerCase().replace(/\s+/g, "-")}
            </span>
            <div className="space-y-1.5">
              {filteredProjects.map((p) => {
                const active = selectedProject?.slug === p.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 border transition-all ${
                      active
                        ? "bg-surface/25 border-cyan-500/30 text-text shadow-[0_0_12px_rgba(6,182,212,0.05)]"
                        : "bg-transparent border-transparent text-muted hover:text-text hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCode size={16} className={active ? "text-cyan-400" : "text-slate-500"} />
                      <div className="truncate">
                        <div className="font-mono text-xs font-semibold">
                          {p.name.toLowerCase()}{getFileExtension(p.category)}
                        </div>
                        <span className="text-[9px] text-slate-550 uppercase tracking-wider block font-mono mt-0.5">
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-550 transition-transform ${active ? "translate-x-0.5" : ""}`} />
                  </button>
                );
              })}
              {filteredProjects.length === 0 && (
                <div className="text-center py-12 font-mono text-xs text-slate-655">
                  Directory is empty.
                </div>
              )}
            </div>
          </div>
 
          {/* Middle Column Status Footer */}
          <div className="border-t border-line bg-surface/5 px-4 py-3 flex items-center justify-between font-mono text-[9px] text-slate-500 select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{filteredProjects.length} ITEMS</span>
            </div>
            <span>LAST SYNC: 2 MIN AGO</span>
            
            {/* Holographic Frequency wave visual */}
            <div className="flex items-end gap-0.5 h-3">
              {[8, 12, 4, 10, 6].map((h, index) => (
                <span
                  key={index}
                  className="w-[1.5px] bg-cyan-400/50 rounded-full"
                  style={{
                    height: `${h}px`,
                    animation: `pulse 1s ease-in-out infinite alternate`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Preview Pane (Inspector Layout) */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between max-h-[500px] lg:max-h-[560px] overflow-y-auto custom-scroll">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* File Header */}
                  <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                        {selectedProject.slug === "womenhealthcare" ? (
                          <Activity size={18} />
                        ) : selectedProject.slug === "wanderlust" ? (
                          <Home size={18} />
                        ) : selectedProject.slug === "fixiq" ? (
                          <Cpu size={18} />
                        ) : (
                          <LayoutGrid size={18} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text flex items-center gap-1.5 leading-tight">
                          {selectedProject.name}
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                        </h3>
                        <p className="text-[9px] text-cyan-400 font-mono tracking-wider mt-0.5 uppercase">
                          TYPE: {selectedProject.category} // {selectedProject.status}
                        </p>
                      </div>
                    </div>
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5 text-slate-650 select-none">
                      <Minimize2 size={12} className="hover:text-cyan-400 transition-colors cursor-pointer" />
                      <Maximize2 size={12} className="hover:text-cyan-400 transition-colors cursor-pointer" />
                    </div>
                  </div>

                  {selectedProject.image && (
                    <div className="h-28 w-full rounded-lg overflow-hidden border border-line relative select-none bg-slate-950/30">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    </div>
                  )}

                  <p className="text-muted text-xs leading-relaxed">{selectedProject.tagline}</p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-surface/10 border border-line px-2 py-0.5 font-mono text-[9px] text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Features & Architecture summary */}
                  <div className="space-y-3 font-mono text-[10px] text-muted">
                    <div className="border-t border-line pt-3">
                      <span className="text-cyan-400 font-bold block mb-1">KEY FEATURES</span>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProject.features.slice(0, 3).map((f) => (
                          <li key={f} className="truncate">{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-line pt-3">
                      <span className="text-purple-400 font-bold block mb-1">ARCHITECTURE BLUEPRINT</span>
                      <p className="leading-relaxed text-[10px]">{selectedProject.architecture}</p>
                    </div>

                    {/* Dynamic flow diagram */}
                    <div className="border-t border-line pt-4">
                      <div className="flex items-center justify-between gap-1 bg-slate-950/30 border border-line/45 rounded-xl p-3 mt-1 select-none">
                        {getProjectFlow(selectedProject.slug).map((node, index, arr) => {
                          const NodeIcon = node.icon;
                          return (
                            <div key={index} className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div className="flex flex-col items-center gap-1 flex-1">
                                <div className="h-8 w-8 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.05)]">
                                  <NodeIcon size={14} className="animate-pulse" />
                                </div>
                                <span className="text-[7px] text-slate-500 font-mono tracking-wide text-center truncate w-full">
                                  {node.label}
                                </span>
                              </div>
                              {index < arr.length - 1 && (
                                <ChevronRight size={10} className="text-slate-655 shrink-0 self-center mb-4" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer connection triggers */}
                <div className="border-t border-line pt-4 flex gap-2.5">
                  {selectedProject.github ? (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface/20 py-2 font-mono text-[10px] text-muted hover:bg-surface/30 hover:text-text transition-colors"
                    >
                      <Github size={12} /> Source Code
                    </a>
                  ) : (
                    <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2 font-mono text-[10px] text-slate-600">
                      Closed Source
                    </span>
                  )}
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-2 font-mono text-[10px] text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    >
                      <ExternalLink size={12} /> Live Link
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-slate-500 text-center py-12">
                <Info size={24} className="text-slate-600 mb-2" />
                Select a file to inspect metadata.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
