"use client";

import { motion } from "framer-motion";
import { TimelineEntry } from "@/data/timeline";

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative mx-auto max-w-4xl py-12">
      {/* Central vertical track line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-20 md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-12">
        {entries.map((e, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={e.title} className="relative flex flex-col md:flex-row md:justify-between">
              
              {/* Timeline dot node */}
              <div className="absolute left-4 top-6 z-10 -ml-1.5 h-3 w-3 rounded-full border border-cyan-400 bg-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.8)] md:left-1/2 md:top-6 md:-translate-x-1/2 md:ml-0" />

              {/* Left Column (Desktop spacing / alternate placement) */}
              <div className={`w-full pl-10 md:w-[45%] md:pl-0 ${isEven ? "md:text-right md:order-1" : "md:order-3 md:invisible md:h-0"}`}>
                {isEven && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-6"
                  >
                    <span className="font-mono text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-400/10 px-2 py-0.5 rounded">
                      {e.year}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white leading-snug">{e.title}</h3>
                    <p className="mt-1 font-mono text-xs text-purple-400">{e.place}</p>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">{e.detail}</p>
                  </motion.div>
                )}
              </div>

              {/* Middle Spacer (Desktop Only) */}
              <div className="hidden md:block md:w-[6%] md:order-2" />

              {/* Right Column (Desktop spacing / alternate placement) */}
              <div className={`w-full pl-10 md:w-[45%] md:pl-0 ${!isEven ? "md:order-3" : "md:order-1 md:invisible md:h-0"}`}>
                {!isEven && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-6"
                  >
                    <span className="font-mono text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-400/10 px-2 py-0.5 rounded">
                      {e.year}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white leading-snug">{e.title}</h3>
                    <p className="mt-1 font-mono text-xs text-purple-400">{e.place}</p>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">{e.detail}</p>
                  </motion.div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
