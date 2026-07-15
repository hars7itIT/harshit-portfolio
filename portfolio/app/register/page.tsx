"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, ShieldCheck, Mail, Lock, User, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register new node.");
      }

      // Successful registration
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Cyber HUD Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-10" />

      <div className="w-full max-w-sm z-10 space-y-6">
        {/* Header branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:rotate-12 transition-transform">
            H
          </Link>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white font-mono mt-2">
            Register Node
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            Configure new administrative access parameter
          </p>
        </div>

        {/* Register Form card */}
        <div className="glass-card p-6 relative">
          {/* Tech frame corners */}
          <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan-400" />
          <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan-400" />
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan-400" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400" />

          {/* Success / Error notification */}
          {error && (
            <div className="p-3 mb-4 rounded-lg border border-red-500/20 bg-red-500/5 font-mono text-[10px] text-red-400 text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 font-mono text-[10px] text-emerald-400 text-center">
              ✓ Node registered! Syncing login portal...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
            {/* Name input */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User size={10} className="text-cyan-400" /> Identity Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Harshit Gupta"
                className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-sans text-xs"
              />
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Mail size={10} className="text-cyan-400" /> Email Node *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., administrator@gmail.com"
                className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-sans text-xs"
                required
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Lock size={10} className="text-purple-400" /> Secure Key Code *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Configure key code..."
                className="w-full bg-slate-950/40 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-sans text-xs"
                required
              />
            </div>

            {/* Submit btn */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-2.5 font-bold text-cyan-400 uppercase tracking-wider transition-all hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <UserPlus size={12} className="group-hover:translate-x-0.5 transition-transform" />
                <span>{loading ? "REGISTERING..." : "REGISTER ACCESS NODE"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Back navigation link */}
        <div className="text-center">
          <Link
            href="/login"
            className="font-mono text-[9px] text-slate-500 hover:text-cyan-400 tracking-wider uppercase inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={10} /> Back to secure login
          </Link>
        </div>
      </div>
    </div>
  );
}
