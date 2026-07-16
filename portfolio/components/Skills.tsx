"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "@/data/skills";
import { Sparkles, Terminal, Code2, Layers, Cpu, Wrench, ShieldAlert, Award } from "lucide-react";
import { useState, useEffect } from "react";

const GROUP_ICONS: Record<string, any> = {
  "Languages": Code2,
  "Frontend": Layers,
  "Backend": Terminal,
  "Database": Cpu,
  "AI & ML": Sparkles,
  "Tools": Wrench,
  "Other": ShieldAlert,
};

// Radar Chart Axis Config
const RADAR_AXES = [
  { label: "Frontend", value: 92, angle: 0 },
  { label: "Backend", value: 85, angle: 60 },
  { label: "Database", value: 82, angle: 120 },
  { label: "AI & ML", value: 88, angle: 180 },
  { label: "Problem Solving", value: 90, angle: 240 },
  { label: "Core Languages", value: 90, angle: 300 },
];

export default function Skills() {
  const [radarProgress, setRadarProgress] = useState(0);

  // Sound play helper
  const playHoverSound = () => {
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
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch(e) {}
  };

  useEffect(() => {
    // Animate radar shape on mount
    const timer = setTimeout(() => {
      setRadarProgress(1);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Compute Radar shape path coordinates
  const centerX = 150;
  const centerY = 140;
  const maxRadius = 90;

  const getCoordinates = (axisIndex: number, pct: number) => {
    const angleRad = (RADAR_AXES[axisIndex].angle - 90) * (Math.PI / 180);
    const radius = maxRadius * (pct / 100) * radarProgress;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return `${x},${y}`;
  };

  const pointsPath = RADAR_AXES.map((axis, i) => getCoordinates(i, axis.value)).join(" ");

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24 relative select-none">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <SectionHeading
        eyebrow="capabilities"
        title="Technical Toolkit"
        description="Structured by domain and system layer. Curated through shipping real apps and active classroom exploration."
      />

      {/* Main Grid: Radar Chart + Skill Cards */}
      <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: Animated Holographic Radar Chart (Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center bg-slate-950/40 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
          {/* Glowing Corners */}
          <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-cyan-400" />
          <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-cyan-400" />
          <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-cyan-400" />
          <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-cyan-400" />

          <div className="w-full border-b border-white/5 pb-2 mb-4 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">
            // Core Competencies Radar
          </div>

          <div className="relative w-full flex justify-center">
            {/* SVG Radar */}
            <svg className="w-[300px] h-[280px]" viewBox="0 0 300 280">
              {/* Concentric grid rings: 20%, 40%, 60%, 80%, 100% */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, gridIdx) => {
                const ringPoints = RADAR_AXES.map((axis, i) => {
                  const angleRad = (axis.angle - 90) * (Math.PI / 180);
                  const r = maxRadius * scale;
                  const x = centerX + r * Math.cos(angleRad);
                  const y = centerY + r * Math.sin(angleRad);
                  return `${x},${y}`;
                }).join(" ");
                return (
                  <polygon
                    key={gridIdx}
                    points={ringPoints}
                    className="fill-none stroke-white/5 stroke-dasharray-[2,2]"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Axis lines */}
              {RADAR_AXES.map((axis, i) => {
                const angleRad = (axis.angle - 90) * (Math.PI / 180);
                const x = centerX + maxRadius * Math.cos(angleRad);
                const y = centerY + maxRadius * Math.sin(angleRad);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    className="stroke-white/5"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Axis Labels */}
              {RADAR_AXES.map((axis, i) => {
                const angleRad = (axis.angle - 90) * (Math.PI / 180);
                const offset = 18;
                const x = centerX + (maxRadius + offset) * Math.cos(angleRad);
                const y = centerY + (maxRadius + offset) * Math.sin(angleRad) + 3;
                let textAnchor: "start" | "end" | "middle" = "middle";
                if (Math.cos(angleRad) > 0.1) textAnchor = "start";
                else if (Math.cos(angleRad) < -0.1) textAnchor = "end";

                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    className="font-mono text-[8px] font-bold fill-slate-500 uppercase tracking-wide"
                    textAnchor={textAnchor}
                  >
                    {axis.label}
                  </text>
                );
              })}

              {/* Plotted Shape */}
              {radarProgress > 0 && (
                <polygon
                  points={pointsPath}
                  className="fill-cyan-500/15 stroke-cyan-400/70"
                  strokeWidth="1.5"
                />
              )}

              {/* Plotted shape nodes */}
              {RADAR_AXES.map((axis, i) => {
                if (radarProgress === 0) return null;
                const coords = getCoordinates(i, axis.value).split(",");
                return (
                  <circle
                    key={i}
                    cx={coords[0]}
                    cy={coords[1]}
                    r="3"
                    className="fill-slate-950 stroke-cyan-400"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          <div className="w-full text-center mt-3 text-[9px] text-muted leading-relaxed font-sans font-medium">
            Radar values represent weighted competence mappings based on shipped codebases, academic projects, and conceptual understanding.
          </div>
        </div>

        {/* RIGHT COLUMN: Skill Cards Group Matrix (Span 7) */}
        <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group, i) => {
            const Icon = GROUP_ICONS[group.label] || Code2;
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="glass-card group overflow-hidden border border-line bg-surface/10 hover:border-cyan-500/25 transition-all"
              >
                {/* Header Tab */}
                <div className="flex items-center justify-between border-b border-line bg-surface/15 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-mono text-[10px] font-bold text-text uppercase tracking-wider">{group.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400/60" />
                  </div>
                </div>

                {/* Capability lists */}
                <ul className="p-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      onMouseEnter={playHoverSound}
                      className="flex items-center justify-between font-mono text-[10px] text-muted hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-cyan-500/70" />
                        {item}
                      </span>
                      <span className="text-[8px] text-slate-650 uppercase font-semibold">STABLE</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
