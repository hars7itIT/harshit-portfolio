"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Trophy, Code2, Award, ArrowUpRight } from "lucide-react";
import Timeline from "./Timeline";
import GithubStats from "./GithubStats";
import { educationTimeline } from "@/data/timeline";
import { codingProfiles, achievements } from "@/data/profiles";

type Tab = "education" | "achievements" | "profiles";

interface AcademicCredentialsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function AcademicCredentials({ activeTab, setActiveTab }: AcademicCredentialsProps) {
  // Listen for scroll behavior or external events if any
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Log action to window event for JARVIS to observe
    window.dispatchEvent(new CustomEvent("jarvis-behavior-tracked", { detail: tab }));
  };

  return (
    <section id="academic-credentials" className="mx-auto max-w-5xl px-6 py-20 relative border-t border-line">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Tabs Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-line pb-4 gap-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
            Credentials & Background
          </span>
          <h2 className="text-xl font-bold text-text uppercase tracking-tight mt-1">
            Academic & Standing Registry
          </h2>
        </div>

        {/* Tab selection chips */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "profiles", label: "Coding Profiles", icon: Code2 },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`rounded-xl px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                  active
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-transparent border-line text-muted hover:text-text hover:bg-white/5"
                }`}
              >
                <Icon size={12} className={active ? "text-cyan-400 animate-pulse" : "text-slate-500"} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panel Content Inspector */}
      <div className="mt-8 rounded-2xl border border-line bg-surface/35 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl min-h-[400px]">
        {/* Glow corners */}
        <div className="absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-cyan-400/40" />
        <div className="absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-cyan-400/40" />
        <div className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-400/40" />
        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-cyan-400/40" />

        <AnimatePresence mode="wait">
          {activeTab === "education" && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="education"
            >
              <div>
                <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Academic Timeline
                </h3>
                <p className="text-[11px] text-muted font-mono mt-1">
                  B.E. Computer Science & Engineering at UIET, Panjab University, Chandigarh.
                </p>
              </div>

              <Timeline entries={educationTimeline} />

              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-line/50">
                <div className="rounded-xl border border-line bg-surface/40 p-5">
                  <h4 className="font-mono text-xs font-semibold text-cyan-400">Relevant Coursework</h4>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Data Structures & Algorithms, Differential Equations, Database Systems, Object-Oriented
                    Programming, Computer Networks.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-surface/40 p-5">
                  <h4 className="font-mono text-xs font-semibold text-purple-400">Future Learning Goals</h4>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    Deepen LangChain / RAG knowledge, get comfortable with cloud deployment (AWS), and
                    ship WanderLust to production with authentication and payments.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
              id="achievements"
            >
              <div>
                <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Distinctions & Certifications
                </h3>
                <p className="text-[11px] text-muted font-mono mt-1">
                  Highlights of competitive programming standings, certifications, and academic excellence.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((a) => (
                  <div 
                    key={a.title} 
                    className="rounded-xl border border-line bg-surface/40 p-5 flex gap-4 items-start hover:border-cyan-500/20 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Award className="text-cyan-400 h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-semibold text-text">{a.title}</h4>
                      <p className="mt-2 text-xs text-muted leading-relaxed">{a.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "profiles" && (
            <motion.div
              key="profiles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
              id="profiles"
            >
              <div>
                <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Distributed Identity
                </h3>
                <p className="text-[11px] text-muted font-mono mt-1">
                  Verify coding performance and open-source contributions across decentralized platforms.
                </p>
              </div>

              {/* GitHub stats card */}
              <GithubStats />

              {/* Coding Profiles Grid */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {codingProfiles.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-line bg-surface/40 p-4 flex flex-col justify-between hover:border-cyan-500/20 group transition-all"
                  >
                    <div>
                      <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        PLATFORM NODE
                      </span>
                      <h4 className="text-xs font-bold text-text group-hover:text-cyan-400 transition-colors">
                        {p.name}
                      </h4>
                      <p className="mt-1 font-mono text-[10px] text-muted">
                        @{p.username}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-end border-t border-line/50 pt-2 text-[8px] text-slate-500 font-mono group-hover:text-cyan-400 transition-colors gap-1">
                      CONNECT <ArrowUpRight size={8} />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
