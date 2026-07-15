"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileCode, ChevronRight, Github, ExternalLink, Cpu, HardDrive, Info, Layers } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { projects, Project } from "@/data/projects";

type Category = "All" | "Full Stack" | "AI" | "College Project";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] ?? null);

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

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24 relative">
      {/* Background neon orb */}
      <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <SectionHeading
        eyebrow="directory"
        title="Project Registry Explorer"
        description="Inspect full-stack nodes, system configurations, and architectural plans inside a holographic file explorer."
      />

      {/* Holographic Finder Container */}
      <div className="mt-12 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[500px] relative">
        
        {/* Tech Corner Brackets */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />

        {/* 1. Sidebar (Folder Navigator) */}
        <div className="lg:col-span-3 border-r border-white/5 bg-slate-950/20 p-4 space-y-6">
          <div>
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Directories
            </span>
            <ul className="space-y-1.5 font-mono text-xs">
              {(["All", "Full Stack", "AI", "College Project"] as Category[]).map((cat) => (
                <li key={cat}>
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
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Folder size={14} className={selectedCategory === cat ? "text-cyan-400" : "text-slate-500"} />
                    <span>{cat === "All" ? "root" : cat.toLowerCase().replace(/\s+/g, "-")}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-white/5">
            <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              System Volume
            </span>
            <div className="space-y-2 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>DISK SPACE:</span>
                <span className="text-white">84.2 GB / 256 GB</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                <div className="bg-cyan-500 h-full w-[33%]" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. File List (Folder Contents) */}
        <div className="lg:col-span-4 border-r border-white/5 p-4 space-y-3 max-h-[500px] overflow-y-auto">
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
                      ? "bg-white/5 border-cyan-500/30 text-white shadow-[0_0_12px_rgba(6,182,212,0.05)]"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode size={16} className={active ? "text-cyan-400" : "text-slate-500"} />
                    <div className="truncate">
                      <div className="font-mono text-xs font-semibold">
                        {p.name.toLowerCase()}{getFileExtension(p.category)}
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono mt-0.5">
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-500 transition-transform ${active ? "translate-x-0.5" : ""}`} />
                </button>
              );
            })}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 font-mono text-xs text-slate-600">
                Directory is empty.
              </div>
            )}
          </div>
        </div>

        {/* 3. Preview Pane (Inspector Layout) */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between max-h-[500px] overflow-y-auto">
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
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedProject.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1 uppercase tracking-wider">
                      Type: {selectedProject.category} // {selectedProject.status}
                    </p>
                  </div>

                  <p className="text-slate-350 text-xs leading-relaxed">{selectedProject.tagline}</p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-white/5 border border-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Features & Architecture summary */}
                  <div className="space-y-3 font-mono text-[10px] text-slate-400">
                    <div className="border-t border-white/5 pt-3">
                      <span className="text-cyan-400 font-bold block mb-1">KEY FEATURES</span>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProject.features.slice(0, 3).map((f) => (
                          <li key={f} className="truncate">{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <span className="text-purple-400 font-bold block mb-1">ARCHITECTURE BLUEPRINT</span>
                      <p className="leading-relaxed text-[10px]">{selectedProject.architecture.substring(0, 110)}...</p>
                    </div>
                  </div>
                </div>

                {/* Footer connection triggers */}
                <div className="border-t border-white/5 pt-4 flex gap-2.5">
                  {selectedProject.github ? (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 font-mono text-[10px] text-slate-350 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Github size={12} /> Source Code
                    </a>
                  ) : (
                    <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/5 py-2 font-mono text-[10px] text-slate-600">
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
              <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-slate-650 text-center py-12">
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
