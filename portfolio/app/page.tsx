"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import TerminalLoader from "@/components/TerminalLoader";
import ParticleBackground from "@/components/ParticleBackground";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import AcademicCredentials from "@/components/AcademicCredentials";
import Contact from "@/components/Contact";
import JarvisVoiceAssistant from "@/components/JarvisVoiceAssistant";
import { Home as HomeIcon, User, Code2, Briefcase, GraduationCap, Trophy, Mail, Github, Linkedin, MessageSquareCode, Sparkles, BookOpen, ChevronRight } from "lucide-react";
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
  const [activeCredentialsTab, setActiveCredentialsTab] = useState<"education" | "achievements" | "profiles">("education");
  const [isDockExpanded, setIsDockExpanded] = useState(false);

  // Sound play helper
  const playBeep = (type: "click" | "hover") => {
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
      osc.frequency.setValueAtTime(type === "click" ? 850 : 1100, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      if (scrollPos < (document.getElementById("about")?.offsetTop ?? 9999)) {
        setActiveItem("hero");
      } else {
        const credsEl = document.getElementById("academic-credentials");
        if (credsEl && scrollPos >= credsEl.offsetTop && scrollPos < credsEl.offsetTop + credsEl.offsetHeight) {
          setActiveItem(activeCredentialsTab === "profiles" ? "education" : activeCredentialsTab);
          return;
        }

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
  }, [activeCredentialsTab]);

  useEffect(() => {
    if (activeItem !== "hero") {
      const event = new CustomEvent("jarvis-behavior-tracked", { detail: activeItem });
      window.dispatchEvent(event);
    }
  }, [activeItem]);

  const handleScrollTo = (id: string) => {
    playBeep("click");
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "education" || id === "achievements" || id === "profiles" || id === "coding-profiles") {
      const tab = id === "coding-profiles" || id === "profiles" ? "profiles" : (id as "education" | "achievements");
      setActiveCredentialsTab(tab);
      const el = document.getElementById("academic-credentials");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
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

      {/* Windows 11 style expanding Left Sidebar Dock */}
      <aside 
        onMouseEnter={() => {
          setIsDockExpanded(true);
          playBeep("hover");
        }}
        onMouseLeave={() => setIsDockExpanded(false)}
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-45 border-r border-line bg-slate-950/70 backdrop-blur-xl items-center py-20 justify-between select-none transition-all duration-300 ${
          isDockExpanded ? "w-44 px-4" : "w-16 px-0"
        }`}
      >
        {/* Top Dock branding */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <svg viewBox="0 0 100 100" className="h-5 w-5 text-cyan-400 animate-pulse">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="8" />
            <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" className="font-sans font-black text-[38px] fill-current">H</text>
          </svg>
          {isDockExpanded && (
            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-1.5 animate-pulse">
              harshit.sys
            </span>
          )}
        </div>

        {/* Sidebar Navigation links */}
        <nav className="flex flex-col items-start gap-4 w-full">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                onMouseEnter={() => playBeep("hover")}
                className={`relative w-full p-2.5 rounded-xl border transition-all duration-300 flex items-center cursor-pointer ${
                  isDockExpanded ? "justify-start" : "justify-center"
                } ${
                  isActive 
                    ? "bg-cyan-500/10 border-cyan-500/35 text-cyan-450 shadow-[0_0_12px_rgba(6,182,212,0.18)]" 
                    : "bg-transparent border-transparent text-muted hover:text-cyan-450 hover:bg-white/5"
                }`}
                title={item.label}
              >
                <Icon size={14} className={isActive ? "text-cyan-400" : ""} />
                
                {isDockExpanded && (
                  <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ml-3 whitespace-nowrap transition-all duration-300 ${
                    isActive ? "text-cyan-400" : "text-muted"
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          <div className="h-[1px] w-full bg-cyan-500/15 my-1" />

          {/* AI Tools Link */}
          <Link
            href="/ai"
            onMouseEnter={() => playBeep("hover")}
            className={`w-full p-2.5 rounded-xl border bg-transparent border-transparent text-muted hover:text-cyan-450 hover:bg-white/5 flex items-center transition-all duration-300 ${
              isDockExpanded ? "justify-start" : "justify-center"
            }`}
            title="AI Tools"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            {isDockExpanded && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest ml-3 text-cyan-400">
                AI Tools
              </span>
            )}
          </Link>

          {/* Blog Link */}
          <Link
            href="/blog"
            onMouseEnter={() => playBeep("hover")}
            className={`w-full p-2.5 rounded-xl border bg-transparent border-transparent text-muted hover:text-purple-450 hover:bg-white/5 flex items-center transition-all duration-300 ${
              isDockExpanded ? "justify-start" : "justify-center"
            }`}
            title="Blog"
          >
            <BookOpen size={14} className="text-purple-400" />
            {isDockExpanded && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest ml-3 text-purple-400">
                Blog
              </span>
            )}
          </Link>
        </nav>

        {/* Bottom Social Icons */}
        <div className="flex flex-col items-center gap-3.5 w-full">
          <div className="h-[1px] w-full bg-cyan-500/15" />
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-purple-400 transition-colors"
            title="GitHub Profile"
          >
            <Github size={13} />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-cyan-400 transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin size={13} />
          </a>
        </div>
      </aside>

      {/* Main Container Layout */}
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:pl-24 relative z-10">
        
        {/* -----------------------------------------------------------
            UNIFIED DUBBED CYBERPUNK HUD INTERFACE PANEL
            ----------------------------------------------------------- */}
        <div className="relative rounded-3xl border border-cyan-500/15 bg-slate-950/20 shadow-[0_0_60px_rgba(6,182,212,0.06)] p-6 backdrop-blur-md overflow-hidden mb-20 group/hud">
          {/* Glowing Corner Accents */}
          <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />

          {/* Sweep scanline overlay animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent h-[400px] w-full -translate-y-full animate-scanline pointer-events-none" />

          {/* Interior 3-Column Dashboard Matrix layout */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-8">
              <Hero />
            </div>
            <div className="lg:col-span-4">
              <JarvisVoiceAssistant avatarSrc="/profile.jpg" name="Harshit Gupta" />
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------
            SCROLLING PORTFOLIO SECTIONS (With smooth reveal animations)
            ----------------------------------------------------------- */}
        <div className="space-y-24">
          
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <FeaturedProjects />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <About />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Skills />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Projects />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Experience />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <AcademicCredentials activeTab={activeCredentialsTab} setActiveTab={setActiveCredentialsTab} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Contact />
          </motion.div>

        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line md:pl-16 px-6 py-8 text-center bg-slate-950/40">
        <p className="font-mono text-[9px] text-muted tracking-wider uppercase">
          built by Harshit Gupta · {new Date().getFullYear()} · powered by next.js & tailwind css
        </p>
      </footer>
    </main>
  );
}
