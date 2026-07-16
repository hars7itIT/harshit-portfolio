"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

export default function FeaturedProjects() {
  const handleScrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  // Select first three projects to feature
  const featured = projects.slice(0, 3);
  
  // Custom design gradient backgrounds for each featured card
  const gradients = [
    "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
    "linear-gradient(135deg, #050515 0%, #0c0f24 100%)",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h3 className="font-mono text-xs font-bold text-text uppercase tracking-widest flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Featured Projects
        </h3>
        <button
          onClick={handleScrollToProjects}
          className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 group cursor-pointer"
        >
          View All <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {featured.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-surface/10 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)] hover:-translate-y-1 shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300"
          >
            {/* Visual Thumbnail */}
            <div
              className="h-32 w-full flex items-center justify-center relative select-none"
              style={{ background: gradients[i] || gradients[0] }}
            >
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
              <span className="font-mono text-xs font-black tracking-widest text-cyan-400/25 group-hover:text-cyan-400/40 transition-colors uppercase">
                {p.name}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-text group-hover:text-cyan-400 transition-colors">{p.name}</h4>
                  <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">{p.status}</span>
                </div>
                <p className="text-[10px] text-muted leading-relaxed font-mono min-h-[50px]">
                  {p.tagline}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                {/* Tech Pills */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1">
                  {p.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[8px] font-semibold text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/10 p-0.5 px-1.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex gap-2 pt-1">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-line bg-surface/20 py-1.5 font-mono text-[8px] text-muted hover:bg-surface/30 hover:text-text transition-colors"
                      title="Source Code"
                    >
                      <Github size={9} /> Code
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-1.5 font-mono text-[8px] text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all hover:shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                      title="Live Demo"
                    >
                      <ArrowUpRight size={9} /> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
