"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Cpu, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";

export default function BlogPostDetail() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [prevPost, setPrevPost] = useState<any>(null);
  const [nextPost, setNextPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        
        const postsList = data.posts ?? [];
        const index = postsList.findIndex((p: any) => p.slug === params.slug);
        
        if (index !== -1) {
          setPost(postsList[index]);
          // Next is newer (previous index in desc list), Prev is older (next index in desc list)
          setNextPost(postsList[index - 1] || null);
          setPrevPost(postsList[index + 1] || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans flex items-center justify-center">
        <div className="font-mono text-xs text-slate-500 animate-pulse">Syncing nodes...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans flex flex-col items-center justify-center gap-4">
        <div className="font-mono text-xs text-slate-500">Specified log file not found.</div>
        <Link href="/blog" className="font-mono text-xs text-cyan-400 hover:underline uppercase">
          Back to logs
        </Link>
      </div>
    );
  }

  // Find related project if category matches a project name or slug
  const relatedProject = projects.find(
    (proj) =>
      post.category.toLowerCase().includes(proj.name.toLowerCase()) ||
      proj.name.toLowerCase().includes(post.category.toLowerCase()) ||
      post.title.toLowerCase().includes(proj.name.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06060f] text-slate-100 font-sans relative overflow-hidden pb-20">
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Navbar (Same branding as home) */}
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
          <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-xs uppercase tracking-widest">NODE_READ</span>
          </div>
        </div>
      </nav>

      {/* Main Page Layout */}
      <main className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">
          <ArrowLeft size={12} /> Back to logs
        </Link>

        {/* Post Header */}
        <header className="space-y-4 border-b border-white/5 pb-6">
          <span className="font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
            {post.category}
          </span>
          
          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight leading-tight">
            <span className="font-mono text-slate-500 text-2xl select-none mr-2">$</span>
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1 font-bold uppercase">
              <Calendar size={11} /> {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> 3 min read
            </span>
          </div>
        </header>

        {/* Media Embed (Video or Cover Photo) */}
        {(post.videoUrl || post.coverImage) && (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 shadow-2xl">
            {post.videoUrl ? (
              post.videoUrl.includes("youtube.com") || post.videoUrl.includes("youtu.be") ? (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      post.videoUrl.includes("watch?v=")
                        ? post.videoUrl.split("watch?v=")[1]?.split("&")[0]
                        : post.videoUrl.split("/").pop()
                    }`}
                    title="Embedded Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              ) : (
                <video src={post.videoUrl} controls className="w-full aspect-video object-cover" />
              )
            ) : (
              <img src={post.coverImage} alt={post.title} className="w-full max-h-[400px] object-cover" />
            )}
          </div>
        )}

        {/* Content Body (Markdown render) */}
        <article className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.split("\n\n").map((para: string, i: number) => {
            if (para.startsWith("# ")) {
              return <h1 key={i} className="text-2xl sm:text-3xl font-bold text-white pt-4">{para.replace("# ", "")}</h1>;
            }
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl sm:text-2xl font-bold text-white pt-4 border-b border-white/5 pb-2">{para.replace("## ", "")}</h2>;
            }
            if (para.startsWith("### ")) {
              return <h3 key={i} className="text-lg sm:text-xl font-bold text-white pt-2">{para.replace("### ", "")}</h3>;
            }
            if (para.includes("\n- ") || para.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc list-inside space-y-2 pl-4 text-slate-400 text-sm">
                  {para.split("\n").map((li, idx) => (
                    <li key={idx} className="leading-relaxed">{li.replace("- ", "").replace("1. ", "").replace("2. ", "").replace("3. ", "").replace("4. ", "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="whitespace-pre-line text-slate-350">
                {para}
              </p>
            );
          })}
        </article>

        {/* Related Project Card */}
        {relatedProject && (
          <div className="glass-card p-5 mt-10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />
            
            <div>
              <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                Contextual Project Node
              </span>
              <p className="text-xs text-slate-300">
                This post is about <strong className="text-white font-semibold">{relatedProject.name}</strong> — {relatedProject.tagline}
              </p>
            </div>
            
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
            >
              Explore Project <ArrowRight size={10} />
            </Link>
          </div>
        )}

        {/* Next/Prev Post Navigation */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="flex-1 p-4 rounded-xl border border-white/5 hover:border-cyan-500/20 bg-slate-950/20 text-left hover:text-cyan-400 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] text-slate-500 font-bold block mb-1">← PREVIOUS LOG</span>
              <span className="text-white group-hover:text-cyan-400 transition-colors text-xs font-semibold line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 p-4 rounded-xl border border-dashed border-white/5 bg-transparent text-slate-600 text-left select-none text-xs">
              No older logs logged.
            </div>
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex-1 p-4 rounded-xl border border-white/5 hover:border-cyan-500/20 bg-slate-950/20 text-right hover:text-cyan-400 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] text-slate-500 font-bold block mb-1">NEXT LOG →</span>
              <span className="text-white group-hover:text-cyan-400 transition-colors text-xs font-semibold line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 p-4 rounded-xl border border-dashed border-white/5 bg-transparent text-slate-600 text-right select-none text-xs">
              No newer logs logged.
            </div>
          )}
        </div>

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
