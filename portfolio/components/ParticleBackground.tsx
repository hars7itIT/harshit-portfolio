"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic particle counts depending on viewport size
    const getParticleCount = () => {
      const area = width * height;
      if (width < 768) return Math.min(40, Math.floor(area / 15000));
      return Math.min(100, Math.floor(area / 12000));
    };

    let particleCount = getParticleCount();
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseR: number;
      glow: number;
      color: string;
    }> = [];

    const colors = {
      dark: ["rgba(6, 182, 212, 0.4)", "rgba(168, 85, 247, 0.4)", "rgba(236, 72, 153, 0.3)"],
      light: ["rgba(8, 145, 178, 0.3)", "rgba(124, 58, 237, 0.3)", "rgba(219, 39, 119, 0.2)"]
    };

    const getThemeColors = () => {
      const isLight = document.documentElement.classList.contains("light-mode");
      return isLight ? colors.light : colors.dark;
    };

    let themeColors = getThemeColors();

    const initParticles = () => {
      particles = Array.from({ length: particleCount }, () => {
        const r = Math.random() * 2 + 0.8;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: r,
          baseR: r,
          glow: Math.random() * 0.5 + 0.2,
          color: themeColors[Math.floor(Math.random() * themeColors.length)],
        };
      });
    };

    initParticles();

    // Mouse interaction parameters
    const mouse = { x: -9999, y: -9999, radius: 180 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    let raf: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.002;

      // Render Aurora gradient background spheres dynamically in Canvas
      const grad1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(time) * 100,
        height * 0.3 + Math.cos(time) * 100,
        0,
        width * 0.2 + Math.sin(time) * 100,
        height * 0.3 + Math.cos(time) * 100,
        Math.min(width, height) * 0.6
      );
      
      const isLight = document.documentElement.classList.contains("light-mode");
      if (isLight) {
        grad1.addColorStop(0, "rgba(236, 72, 153, 0.05)");
        grad1.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        grad1.addColorStop(0, "rgba(168, 85, 247, 0.03)");
        grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.8) * 150,
        height * 0.7 + Math.sin(time * 0.8) * 150,
        0,
        width * 0.8 + Math.cos(time * 0.8) * 150,
        height * 0.7 + Math.sin(time * 0.8) * 150,
        Math.min(width, height) * 0.7
      );
      if (isLight) {
        grad2.addColorStop(0, "rgba(6, 182, 212, 0.05)");
        grad2.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        grad2.addColorStop(0, "rgba(6, 182, 212, 0.03)");
        grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = isLight
              ? `rgba(124, 58, 237, ${alpha})`
              : `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction/magnetism logic
        if (mouse.x !== -9999) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Pull particles slightly towards mouse
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
            // Expand slightly under mouse focus
            p.r = p.baseR + force * 1.5;
          } else {
            p.r = p.r > p.baseR ? p.r - 0.05 : p.baseR;
          }
        } else {
          p.r = p.r > p.baseR ? p.r - 0.05 : p.baseR;
        }

        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.glow * 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0; // Reset shadow for next operations
      raf = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particleCount = getParticleCount();
      initParticles();
    };

    // Re-check theme on mode toggles
    const observer = new MutationObserver(() => {
      themeColors = getThemeColors();
      particles.forEach((p) => {
        p.color = themeColors[Math.floor(Math.random() * themeColors.length)];
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}
