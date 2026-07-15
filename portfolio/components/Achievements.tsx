import SectionHeading from "./SectionHeading";
import { achievements } from "@/data/profiles";
import { Award, Target } from "lucide-react";

export default function Achievements() {
  return (
    <section id="achievements" className="mx-auto max-w-5xl px-6 py-24 relative">
      <SectionHeading
        eyebrow="milestones"
        title="Distinctions & Certifications"
        description="Highlights of competitive programming standings, certifications, hackathons, and research initiatives."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {achievements.map((a) => (
          <div 
            key={a.title} 
            className="glass-card p-6 flex gap-4 items-start border-white/5"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Award className="text-cyan-400 h-5 w-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-semibold text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{a.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
