"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { toggleTheme } from "@/components/ThemeInit";
import { Sun, Moon, Sparkles, BookOpen, ChevronDown, Linkedin, Github, FileText, Mail, ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/data/profiles";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [isLight, setIsLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [linksOpen, setLinksOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light-mode"));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLinksOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

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
      document.removeEventListener("mousedown", handleClickOutside);
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
        ? "border-line bg-ink/90 backdrop-blur-lg shadow-xl" 
        : "border-transparent bg-transparent"
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Logo / Status */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="h-6 w-6 rounded bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:rotate-12">
            H
          </div>
          <span className="font-mono text-sm text-text font-semibold transition-colors group-hover:text-cyan-400">
            harshit<span className="text-muted">.sys</span>
          </span>
        </a>

        {/* Section Links */}
        <ul className="hidden md:flex items-center gap-1.5">
          <li>
            <a href="#hero" className={`nav-btn ${activeSection === "hero" || activeSection === "" ? "active" : ""}`}>
              Home
            </a>
          </li>
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
          
          {/* Links Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLinksOpen(!linksOpen)}
              className="nav-btn border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <FileText size={10} />
              <span>Links</span>
              <ChevronDown size={10} className={`transition-transform duration-200 ${linksOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {linksOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-line bg-ink/95 backdrop-blur-xl p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.5)] font-mono text-[11px] space-y-1 z-50">
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all"
                >
                  <span className="flex items-center gap-2"><Linkedin size={12} className="text-cyan-400" /> LinkedIn</span>
                  <ArrowUpRight size={10} />
                </a>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all"
                >
                  <span className="flex items-center gap-2"><Github size={12} className="text-purple-400" /> GitHub</span>
                  <ArrowUpRight size={10} />
                </a>
                <a
                  href="/Harshit_Gupta_Resume.docx"
                  download
                  className="flex items-center justify-between p-2 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all"
                >
                  <span className="flex items-center gap-2"><FileText size={12} className="text-pink-400" /> Resume</span>
                  <ArrowUpRight size={10} />
                </a>
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex items-center justify-between p-2 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all"
                >
                  <span className="flex items-center gap-2"><Mail size={12} className="text-emerald-400" /> Email Me</span>
                  <ArrowUpRight size={10} />
                </a>
              </div>
            )}
          </div>

          {/* Theme Toggle Button Slider */}
          <button
            aria-label="Toggle dark and light mode"
            onClick={handleToggle}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface/40 p-1 px-2.5 text-muted hover:text-cyan-400 hover:border-cyan-500/20 transition-all cursor-pointer select-none"
          >
            {isLight ? <Sun size={12} className="text-amber-500 animate-spin" style={{ animationDuration: "10s" }} /> : <Moon size={12} className="text-cyan-400" />}
            <div className={`w-6 h-3 rounded-full bg-white/15 relative transition-colors ${isLight ? "bg-cyan-500/20" : ""}`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-white absolute top-px transition-all ${isLight ? "left-[12px] bg-cyan-400" : "left-[2px] bg-slate-400"}`} />
            </div>
          </button>

        </div>
      </div>
    </nav>
  );
}
