import SectionHeading from "./SectionHeading";
import GithubStats from "./GithubStats";
import { codingProfiles } from "@/data/profiles";
import { ArrowUpRight } from "lucide-react";

export default function CodingProfiles() {
  return (
    <section id="profiles" className="mx-auto max-w-5xl px-6 py-24 relative">
      <SectionHeading
        eyebrow="credentials"
        title="Distributed Identity"
        description="Verify coding performance and open-source contributions across decentralized platforms."
      />
      
      <div className="mt-12 space-y-6">
        {/* Github Live Section */}
        <GithubStats />

        {/* Coding Profiles Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {codingProfiles.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              className="glass-card group p-5 flex flex-col justify-between hover:border-cyan-500/20"
            >
              <div>
                <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  PLATFORM NODE
                </span>
                <h3 className="text-sm font-bold text-text group-hover:text-cyan-400 transition-colors">
                  {p.name}
                </h3>
                <p className="mt-2 font-mono text-xs text-muted">
                  @{p.username}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end border-t border-line pt-3">
                <span className="font-mono text-[9px] text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                  CONNECT <ArrowUpRight size={10} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
