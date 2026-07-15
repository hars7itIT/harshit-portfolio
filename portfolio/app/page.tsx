import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ParticleBackground from "@/components/ParticleBackground";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import CodingProfiles from "@/components/CodingProfiles";
import Contact from "@/components/Contact";
import AIChatWidget from "@/components/AIChatWidget";

export default function Home() {
  return (
    <main className="relative">
      <ParticleBackground />
      <Nav />
      <div className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <CodingProfiles />
        <Contact />
      </div>
      <AIChatWidget />
      <footer className="relative z-10 border-t border-line px-6 py-8 text-center">
        <p className="font-mono text-xs text-muted">
          built by Harshit Gupta · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
