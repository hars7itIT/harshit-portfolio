"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TerminalLoader from "@/components/TerminalLoader";
import ParticleBackground from "@/components/ParticleBackground";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import CodingProfiles from "@/components/CodingProfiles";
import Contact from "@/components/Contact";
import JarvisVoiceAssistant from "@/components/JarvisVoiceAssistant";
import { Home as HomeIcon, User, Code2, Briefcase, GraduationCap, Trophy, Mail, Github, Linkedin, MessageSquareCode } from "lucide-react";
import { socialLinks } from "@/data/profiles";

const SIDEBAR_ITEMS = [
  { id: "hero", label: "Home", icon: HomeIcon },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: MessageSquareCode },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Home() {
  const [activeItem, setActiveItem] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      // Determine active section for sidebar highlights
      if (scrollPos < (document.getElementById("about")?.offsetTop ?? 9999)) {
        setActiveItem("hero");
      } else {
        for (let i = SIDEBAR_ITEMS.length - 1; i >= 1; i--) {
          const el = document.getElementById(SIDEBAR_ITEMS[i].id);
          if (el && scrollPos >= el.offsetTop) {
            setActiveItem(SIDEBAR_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hook: Alert JARVIS about scrolling behavior
  useEffect(() => {
    if (activeItem !== "hero") {
      const event = new CustomEvent("jarvis-behavior-tracked", { detail: activeItem });
      window.dispatchEvent(event);
    }
  }, [activeItem]);

  const handleScrollTo = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <main className="relative bg-[#06060f] min-h-screen text-text overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <TerminalLoader />
      <ParticleBackground />
      <Nav />

      {/* Futuristic Left Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-16 z-40 border-r border-line bg-ink/40 backdrop-blur-md items-center py-24 justify-between select-none">
        
        {/* Top App Icon / Marker */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
          <div className="h-6 w-[1px] bg-cyan-500/20" />
        </div>

        {/* Mid Navigation Icons */}
        <nav className="flex flex-col items-center gap-5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`relative p-2 rounded-xl border transition-all duration-300 group/item cursor-pointer ${
                  isActive 
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] scale-105" 
                    : "bg-transparent border-transparent text-muted hover:text-cyan-400 hover:bg-white/5"
                }`}
                title={item.label}
              >
                <Icon size={16} />
                
                {/* Floating tooltip */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 p-1.5 px-2.5 rounded-lg bg-ink border border-line text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity z-50 shadow-xl whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Social Icons */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-[1px] bg-cyan-500/20" />
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-purple-400 transition-colors"
            title="GitHub Profile"
          >
            <Github size={15} />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-cyan-400 transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin size={15} />
          </a>
          <a
            href={`mailto:${socialLinks.email}`}
            className="text-muted hover:text-emerald-400 transition-colors"
            title="Send Email"
          >
            <Mail size={15} />
          </a>
        </div>
      </aside>

      {/* Main Container Layout */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 md:pl-24 relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left/Center Column (Content Scroll) */}
          <div className="lg:col-span-8 space-y-16">
            <Hero />
            
            {/* Holographic JARVIS Online Indicator Card */}
            <div className="rounded-2xl border border-line bg-surface/10 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden group hover:border-cyan-500/10 transition-all select-none">
              
              {/* Glowing Corner Accents */}
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400/50" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400/50" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400/50" />

              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                {/* Holographic avatar ring wrapper */}
                <div className="relative h-16 w-16 rounded-full border border-cyan-500/20 p-1 flex items-center justify-center bg-slate-950/80 shrink-0">
                  <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: "12s" }} />
                  <div className="absolute -inset-2 rounded-full border border-dashed border-purple-400/15 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
                  <img
                    src="/profile.jpg"
                    alt="Harshit Gupta"
                    className="h-full w-full object-cover rounded-full grayscale brightness-95 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-mono text-sm font-bold text-text uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>JARVIS</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </h4>
                  <p className="font-mono text-[10px] text-muted uppercase mt-0.5 tracking-wider">
                    AI Portfolio Assistant • <span className="text-cyan-400">Online & Secured</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="font-mono text-[9px] text-muted block uppercase">cognitive load</span>
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest">14.8% IDLE</span>
              </div>
            </div>

            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Achievements />
            <CodingProfiles />
            <Contact />
          </div>

          {/* Right Column (Sticky JARVIS Agent panel) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 mt-8 lg:mt-0">
            <JarvisVoiceAssistant avatarSrc="/profile.jpg" name="Harshit Gupta" />
          </aside>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line md:pl-16 px-6 py-8 text-center bg-slate-950/40">
        <p className="font-mono text-[10px] text-muted tracking-wider uppercase">
          built by Harshit Gupta · {new Date().getFullYear()} · powered by next.js & tailwind css
        </p>
      </footer>
    </main>
  );
}
