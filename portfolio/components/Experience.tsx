import SectionHeading from "./SectionHeading";
import Timeline from "./Timeline";
import { experienceTimeline } from "@/data/timeline";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="experience"
        title="Projects, in the order they happened"
        description="No internships yet — the experience here is what's been built, debugged, and shipped."
      />
      <Timeline entries={experienceTimeline} />
    </section>
  );
}
