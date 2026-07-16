"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const FEATURED = [
  {
    name: "WanderLust",
    tagline: "A full stack Airbnb clone with listings, reviews, authentication, & more.",
    stack: ["Node.js", "Express", "MongoDB", "EJS"],
    github: "https://github.com/hars7itIT/WanderLust",
    image: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
  },
  {
    name: "DevConnect",
    tagline: "Developer social platform to connect, share and collaborate.",
    stack: ["React", "Node.js", "MongoDB", "Tailwind"],
    github: "https://github.com/hars7itIT/DevConnect",
    image: "linear-gradient(135deg, #09090b 0%, #030712 100%)",
  },
  {
    name: "AI Chat App",
    tagline: "Real-time AI chat application with auth and modern UI.",
    stack: ["Next.js", "TypeScript", "AI API", "Tailwind"],
    github: "https://github.com/hars7itIT/ai-chat",
    image: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  },
];

export default function FeaturedProjects() {
  const handleScrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

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
        {FEATURED.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-surface/10 hover:border-cyan-500/20 shadow-xl overflow-hidden flex flex-col justify-between group transition-all"
          >
            {/* Visual Thumbnail */}
            <div
              className="h-28 w-full flex items-center justify-center relative select-none"
              style={{ background: p.image }}
            >
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
              <span className="font-mono text-xs font-black tracking-widest text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors uppercase">
                {p.name}
              </span>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-text">{p.name}</h4>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-[10px] text-muted leading-relaxed font-mono min-h-[40px]">
                  {p.tagline}
                </p>
              </div>

              {/* Tech Pills */}
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[8px] font-semibold text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/10 p-0.5 px-1.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
