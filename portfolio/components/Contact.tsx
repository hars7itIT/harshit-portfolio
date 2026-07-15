"use client";

import { useState } from "react";
import { Mail, Phone, Linkedin, Github, Instagram, Twitter, CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { socialLinks } from "@/data/profiles";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Fill in all three fields before sending.");
      return;
    }
    setError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Email backend not configured (or failed) — fall back to the visitor's own mail client.
        setError(data.error ?? "Couldn't send that. Opening your email client instead.");
        setStatus("idle");
        openMailClient();
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Network error — opening your email client instead.");
      setStatus("idle");
      openMailClient();
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="contact"
        title="Get in touch"
        description="Sends straight to my inbox. If email sending isn't configured yet, it opens your email client instead — either way, the message gets through."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-line bg-surface/60 p-6">
          <div>
            <label className="font-mono text-xs text-muted" htmlFor="name">Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted" htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-transparent px-3 py-2 text-sm text-text outline-none focus:border-signal"
            />
          </div>
          {error && <p className="text-xs text-warn">{error}</p>}
          {status === "sent" && (
            <p className="flex items-center gap-1.5 text-xs text-signal">
              <CheckCircle2 size={14} /> Message sent — thanks, I'll get back to you.
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded border border-signal bg-signal/10 px-4 py-2 font-mono text-sm text-signal transition-colors hover:bg-signal hover:text-ink disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>

        <div className="space-y-3">
          <a href={`mailto:${socialLinks.email}`} className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Mail size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">{socialLinks.email}</span>
          </a>
          <a href={`tel:${socialLinks.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Phone size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">{socialLinks.phone}</span>
          </a>
          <a href={socialLinks.linkedin} target="_blank" className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Linkedin size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">LinkedIn</span>
          </a>
          <a href={socialLinks.github} target="_blank" className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Github size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">GitHub</span>
          </a>
          <a href={socialLinks.instagram} target="_blank" className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Instagram size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">Instagram</span>
          </a>
          <a href={socialLinks.twitter} target="_blank" className="flex items-center gap-3 rounded-md border border-line bg-surface/60 p-4 hover:border-signal">
            <Twitter size={16} className="text-signal" />
            <span className="font-mono text-sm text-text">X (Twitter)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
