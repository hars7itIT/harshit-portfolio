"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "@/components/ThemeInit";
import { Sun, Moon, BookOpen, Menu, X, Bot } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const heroEl = document.getElementById("hero");
    if (heroEl) observer.observe(heroEl);

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

  const isHomeActive = activeSection === "hero" || activeSection === "";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? "border-line bg-ink/90 backdrop-blur-lg shadow-xl" 
        : "border-transparent bg-transparent"
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Logo / Status */}
        <a href="#hero" className="flex items-center gap-2 group select-none">
          <svg viewBox="0 0 100 100" className="h-5 w-5 text-cyan-400 group-hover:scale-105 transition-transform duration-300">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="8" />
            <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" className="font-sans font-black text-[38px] fill-current">H</text>
          </svg>
          <span className="font-mono text-sm text-text font-bold transition-colors group-hover:text-cyan-400">
            Harshit G. <span className="text-slate-500 font-normal">| CSE</span>
          </span>
        </a>

        {/* Section Links - Desktop (Horizontal Glossy Buttons) */}
        <ul className="hidden lg:flex items-center gap-1.5 select-none">
          <li>
            <a 
              href="#hero" 
              className={`nav-btn flex items-center gap-1 ${isHomeActive ? "active" : ""}`}
            >
              {isHomeActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
              Home
            </a>
          </li>
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`nav-btn flex items-center gap-1 ${isActive ? "active" : ""}`}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Action Widgets */}
        <div className="flex items-center gap-2.5">
          
          {/* AI Toolkit Pill Button */}
          <Link href="/ai" className="hidden sm:flex nav-btn border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 items-center gap-1 cursor-pointer shadow-md select-none">
            <Bot size={11} className="animate-pulse text-cyan-400" />
            <span>AI Toolkit</span>
          </Link>

          {/* Blog Pill Button */}
          <Link href="/blog" className="hidden sm:flex nav-btn border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 items-center gap-1.5 cursor-pointer shadow-md select-none">
            <BookOpen size={11} className="text-cyan-400" />
            <span>Blog</span>
          </Link>

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

          {/* Hamburger Menu Button - Tablet/Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg border border-line bg-surface/40 p-2 text-muted hover:text-cyan-400 hover:border-cyan-500/20 transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
          </button>

        </div>
      </div>

      {/* Mobile/Tablet Menu Drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-line bg-ink/95 backdrop-blur-xl px-6 py-4 overflow-hidden shadow-2xl z-40 relative"
          >
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li>
                <a
                  href="#hero"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left py-2.5 px-4 rounded-xl border border-transparent font-bold uppercase tracking-wider transition-colors ${
                    isHomeActive
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "text-muted hover:bg-white/5 hover:text-text"
                  }`}
                >
                  Home
                </a>
              </li>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left py-2.5 px-4 rounded-xl border border-transparent font-bold uppercase tracking-wider transition-colors ${
                      activeSection === s.id
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "text-muted hover:bg-white/5 hover:text-text"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li className="border-t border-white/5 my-1" />
              <li>
                <Link
                  href="/ai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2.5 px-4 rounded-xl text-cyan-400 font-bold uppercase tracking-wider hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <Bot size={13} className="animate-pulse" /> AI Toolkit
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2.5 px-4 rounded-xl text-purple-400 font-bold uppercase tracking-wider hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={13} /> Blog
                  </span>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
