import SectionHeading from "./SectionHeading";
import Timeline from "./Timeline";
import { educationTimeline } from "@/data/timeline";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="education"
        title="Academic timeline"
        description="B.E. Computer Science & Engineering at UIET, Panjab University, Chandigarh."
      />
      <Timeline entries={educationTimeline} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-surface/60 p-5">
          <h3 className="font-mono text-sm font-semibold text-signal">Relevant coursework</h3>
          <p className="mt-2 text-sm text-muted">
            Data Structures & Algorithms, Differential Equations, Database Systems, Object-Oriented
            Programming, Computer Networks.
          </p>
        </div>
        <div className="rounded-md border border-line bg-surface/60 p-5">
          <h3 className="font-mono text-sm font-semibold text-signal">Future learning goals</h3>
          <p className="mt-2 text-sm text-muted">
            Deepen LangChain / RAG knowledge, get comfortable with cloud deployment (AWS), and
            ship WanderLust to production with auth and payments.
          </p>
        </div>
      </div>
    </section>
  );
}
