"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toggleTheme } from "@/components/ThemeInit";
import { Sun, Moon, Cpu, Sparkles, BookOpen } from "lucide-react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "profiles", label: "Profiles" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [isLight, setIsLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light-mode"));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Setup active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-25% 0px -55% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsLight(document.documentElement.classList.contains("light-mode"));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? "border-line bg-ink/80 backdrop-blur-lg shadow-xl" 
        : "border-transparent bg-transparent"
    }`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        
        {/* Logo / Status */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="h-6 w-6 rounded bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:rotate-12">
            H
          </div>
          <span className="font-mono text-sm text-white font-semibold transition-colors group-hover:text-cyan-400">
            harshit<span className="text-slate-500">.sys</span>
          </span>
        </a>

        {/* Section Links (Styled as glossy buttons, hiding on medium screens to prevent overflow) */}
        <ul className="hidden lg:flex items-center gap-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`nav-btn ${activeSection === s.id ? "active" : ""}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* AI Playground Quick Link */}
          <Link
            href="/ai"
            onClick={() => console.log("AI Tools link clicked!")}
            className="nav-btn border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0"
          >
            <Sparkles size={10} className="animate-pulse" />
            <span>AI Tools</span>
          </Link>

          {/* Blog Logs Link */}
          <Link
            href="/blog"
            className="nav-btn border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500 hover:text-slate-950 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] shrink-0"
          >
            <BookOpen size={10} />
            <span>Logs</span>
          </Link>

          {/* Theme Toggle */}
          <button
            aria-label="Toggle dark and light mode"
            onClick={handleToggle}
            className="rounded-lg border border-line bg-surface/40 p-2 text-muted hover:text-cyan-400 hover:border-cyan-500/20 transition-colors cursor-pointer"
          >
            {isLight ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
