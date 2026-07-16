"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(isFinePointer && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }
    };

    const render = () => {
      // Lerp logic for smooth ring lag
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      requestAnimationFrame(render);
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener("mousemove", onMouseMove);
    const animId = requestAnimationFrame(render);

    const updateListeners = () => {
      const interactives = document.querySelectorAll("a, button, [role='button']");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };
    
    updateListeners();
    const interval = setInterval(updateListeners, 2000);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Centered Pointer Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] mix-blend-screen"
        style={{ willChange: "transform", transform: "translate3d(-20px, -20px, 0)" }}
      />
      {/* Outer Halo ring tracking with delay */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full border border-cyan-400/40 mix-blend-screen transition-all duration-150 ${
          isHovered ? "scale-150 bg-cyan-500/5 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]" : "scale-100"
        }`}
        style={{ willChange: "transform", transform: "translate3d(-40px, -40px, 0)" }}
      />
    </>
  );
}
