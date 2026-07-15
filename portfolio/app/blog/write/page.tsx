"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Send, ShieldCheck, Image, Video, FileText } from "lucide-react";

export default function WriteBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("AI & Systems");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and Story Content are required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          category,
          coverImage: coverImage.trim() || null,
          videoUrl: videoUrl.trim() || null,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish blog post.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/blog/${data.post.slug}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans relative overflow-hidden pb-20">
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Header bar */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft size={14} /> Back to journal
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold">
            <Cpu size={14} className="text-cyan-400" />
            <span>NODE_WRITE</span>
          </div>
        </div>
      </nav>

      {/* Write panel content */}
      <main className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            Publish New Log
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
            Register media uploads & stories in the database
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400 animate-pulse">
            ⚠️ ERROR: {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 font-mono text-xs text-emerald-400">
            ✓ Log committed successfully! Initiating routing sync...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Glass Form Panel */}
          <div className="glass-card p-6 space-y-5 relative">
            {/* Tech frame corners */}
            <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan-400/40" />
            <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan-400/40" />
            <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan-400/40" />
            <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400/40" />

            {/* Title input */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Log Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deploying My First Full-Stack Agentic Web App"
                className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-sans"
                required
              />
            </div>

            {/* Category & Summary row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-mono"
                >
                  <option value="AI & Systems">AI & Systems</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="UIET Attendance">UIET Attendance</option>
                  <option value="Personal Journey">Personal Journey</option>
                  <option value="Lifestyle & Meditation">Lifestyle & Meditation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Brief Summary
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g., A quick overview of design milestones..."
                  className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-sans"
                />
              </div>
            </div>

            {/* Media Urls Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Image size={11} className="text-cyan-400" /> Photo URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="e.g., https://images.unsplash.com/... or /profile.jpg"
                  className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Video size={11} className="text-purple-400" /> Video URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g., YouTube link or direct video link"
                  className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-mono text-xs"
                />
              </div>
            </div>

            {/* Story/Content textarea */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText size={11} className="text-cyan-400" /> Story Content (Markdown Supported) *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Introduction&#10;&#10;Write your story here. Use double returns for paragraphs.&#10;&#10;## Subheading&#10;- Bullet point one&#10;- Bullet point two"
                rows={12}
                className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/30 transition-all font-mono leading-relaxed"
                required
              />
            </div>

            {/* Form Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-cyan-500/10 border border-cyan-500/30 py-3.5 font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase transition-all hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>{loading ? "COMMITTING TO DATABASE..." : "PUBLISH LOG ENTRY"}</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
