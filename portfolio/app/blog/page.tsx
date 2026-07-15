"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, BookOpen, Clock, Calendar, ArrowRight, Plus } from "lucide-react";

export default function BlogIndex() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data.posts ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans relative overflow-hidden pb-20">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Identical Navbar Branding */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:rotate-12">
              H
            </div>
            <span className="font-mono text-sm text-white font-semibold transition-colors group-hover:text-cyan-400">
              harshit<span className="text-slate-500">.sys</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/blog/write"
              className="inline-flex items-center gap-1 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <Plus size={10} /> Create Log
            </Link>
            <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold border-l border-white/10 pl-3">
              <BookOpen size={14} className="text-cyan-400" />
              <span className="text-xs uppercase tracking-widest text-cyan-400">LOGS</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-8">
        
        {/* Hero / Terminal Header */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 relative overflow-hidden text-left font-mono">
          {/* Tech frame corners */}
          <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-cyan-400/40" />
          <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-cyan-400/40" />
          <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-cyan-400/40" />
          <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400/40" />
          
          <div className="flex gap-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500/40" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
            <span className="w-2 h-2 rounded-full bg-green-500/40" />
          </div>
          <div className="text-cyan-400 font-bold text-xs sm:text-sm">$ cat blog_index.log</div>
          <div className="text-slate-350 mt-2 text-xs sm:text-sm">
            &quot;Writeups on what I build &amp; what I learn&quot;
          </div>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Categories Pill Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                [ {cat === "All" ? "all" : cat.toLowerCase().replace(/\s+/g, "-")} ]
              </button>
            ))}
          </div>

          {/* Search bar inside pill */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-white/5 bg-slate-950/40 max-w-xs w-full">
            <Search size={12} className="text-slate-500 ml-1.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search index logs..."
              className="w-full bg-transparent text-[10px] font-mono text-slate-200 outline-none placeholder:text-slate-650"
            />
          </div>
        </div>

        {/* 3-Column Grid Post Cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl border border-white/5 bg-slate-950/20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-white/5 bg-slate-950/10 font-mono text-xs text-slate-500">
            No journal entries matching query.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article
                key={post.slug}
                className="glass-card p-5 flex flex-col justify-between hover:border-cyan-500/20 group relative overflow-hidden"
              >
                {/* Tech brackets for card */}
                <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-white/5 group-hover:border-cyan-400/40" />
                <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-white/5 group-hover:border-cyan-400/40" />
                <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/5 group-hover:border-cyan-400/40" />
                <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/5 group-hover:border-cyan-400/40" />

                <div className="space-y-4">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-4 font-mono text-[9px]">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-bold">
                      <Calendar size={10} /> {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors">
                    <span className="font-mono text-slate-500 text-xs select-none mr-1">$</span>
                    {post.title}
                  </h2>

                  {/* Excerpt clamped to 2 lines */}
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card footer details */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                    <Clock size={10} /> 3 min read
                  </span>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-mono text-[10px] text-cyan-400 group-hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    [READ →]
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 border-t border-white/5 mt-20 px-6 py-8 text-center">
        <p className="font-mono text-[10px] text-slate-500">
          built by Harshit Gupta · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
