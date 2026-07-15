"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "@/data/skills";
import { Sparkles, Terminal, Code2, Layers, Cpu, Wrench, ShieldAlert } from "lucide-react";

const GROUP_ICONS: Record<string, any> = {
  "Languages": Code2,
  "Frontend": Layers,
  "Backend": Terminal,
  "Database": Cpu,
  "AI & ML": Sparkles,
  "Tools": Wrench,
  "Other": ShieldAlert,
};

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24 relative">
      <SectionHeading
        eyebrow="capabilities"
        title="Technical Toolkit"
        description="Structured by domain and system layer. Curated through shipping real apps and active classroom exploration."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => {
          const Icon = GROUP_ICONS[group.label] || Code2;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="glass-card group overflow-hidden"
            >
              {/* Card Title / Tab Header */}
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.01] px-5 py-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-cyan-400 group-hover:animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white tracking-wide">{group.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500/50" />
                </div>
              </div>

              {/* Skills List */}
              <ul className="p-5 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center justify-between font-mono text-xs text-slate-300 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.8)]" />
                      {item}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">STABLE</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
