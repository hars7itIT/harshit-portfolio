"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Terminal, BrainCircuit, Activity, Database, GitBranch } from "lucide-react";

const TRAITS = [
  { 
    title: "Builder Mindset", 
    detail: "Learns concepts by shipping real code, not just reading docs. Believer in rapid prototyping and iterative debugging.",
    icon: Terminal,
    color: "text-cyan-400"
  },
  { 
    title: "Full-Stack Native", 
    detail: "Seamlessly handles database modeling, server middleware, and pixel-perfect interactive client UI.",
    icon: Database,
    color: "text-purple-400"
  },
  { 
    title: "AI & Agentic Systems", 
    detail: "Integrates LLMs and vector embeddings to construct context-aware assistants, mock platforms, and diagnostic systems.",
    icon: BrainCircuit,
    color: "text-pink-400"
  },
  { 
    title: "Public Debugging", 
    detail: "Shares solutions to edge cases and workspace anomalies in real-time, helping the developer community.",
    icon: GitBranch,
    color: "text-emerald-400"
  },
  { 
    title: "Continuous Synthesis", 
    detail: "Treats academic coursework and independent projects as interconnected threads in an ongoing engineering evolution.",
    icon: Activity,
    color: "text-amber-400"
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24 relative">
      <SectionHeading
        eyebrow="identity"
        title="Engineering next-gen software and agentic architectures"
        description="Currently a second-year CSE student at UIET, Panjab University. Building tools that parse, reason, and interface at the edge."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        
        {/* Left Card: Core Philosophy / Avatar info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md"
        >
          <div>
            <h3 className="text-xl font-bold text-text mb-4">Core Philosophy</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              "The best way to predict the future is to build it." I view programming not as typing syntax, but as architecting workflows that solve genuine problems. 
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Whether optimizing a SQL database query, designing a custom CSS layout, or building an LLM interface, my focus is on performance, security, and responsive design.
            </p>
          </div>

          <div className="mt-8 border-t border-line pt-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
              <BrainCircuit className="text-cyan-400 h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="font-mono text-xs text-cyan-400 font-semibold tracking-wider">SYSTEM STATUS</div>
              <div className="text-text text-xs">Continuously Learning & Building</div>
            </div>
          </div>
        </motion.div>

        {/* Right Card: Interactive Timeline of Traits */}
        <div className="lg:col-span-3 relative border-l border-line pl-8 space-y-8">
          {TRAITS.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Glowing vertical connector node */}
                <span className="absolute -left-[45px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-line bg-ink flex items-center justify-center transition-all group-hover:border-cyan-400/80 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-800 transition-colors group-hover:bg-cyan-400" />
                </span>
                
                {/* Hover glassmorphic panel */}
                <div className="rounded-xl border border-transparent p-4 transition-all group-hover:border-line group-hover:bg-surface/10 group-hover:backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${t.color}`} />
                    <h3 className="font-mono text-sm font-semibold text-text">{t.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{t.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
