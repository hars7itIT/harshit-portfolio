"use client";

import { useEffect, useState } from "react";
import { codingProfiles } from "@/data/profiles";
import { GitCommit, Users, Star, Radio } from "lucide-react";

type Stats = {
  publicRepos: number;
  followers: number;
  stars: number;
};

const githubUsername = codingProfiles.find((p) => p.name === "GitHub")?.username ?? "";
const isPlaceholder = githubUsername === "yourhandle" || !githubUsername;

export default function GithubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPlaceholder) return;

    let cancelled = false;

    async function load() {
      try {
        const userRes = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!userRes.ok) throw new Error("user fetch failed");
        const user = await userRes.json();

        let stars = 0;
        let page = 1;
        while (page <= 3) {
          const reposRes = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?per_page=100&page=${page}`
          );
          if (!reposRes.ok) break;
          const repos = await reposRes.json();
          if (!Array.isArray(repos) || repos.length === 0) break;
          stars += repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0);
          if (repos.length < 100) break;
          page += 1;
        }

        if (!cancelled) {
          setStats({
            publicRepos: user.public_repos ?? 0,
            followers: user.followers ?? 0,
            stars,
          });
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isPlaceholder) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-5 font-mono text-xs text-slate-500 text-center">
        Configure a real GitHub handle in <span className="text-cyan-400">data/profiles.ts</span> to sync live metrics.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-white/5 bg-slate-950/20 p-5 font-mono text-xs text-slate-500 text-center">
        GitHub integration currently offline. Refresh to try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live sync signal */}
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-cyan-400 animate-pulse" />
        <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest">LIVE DATA NODE ACTIVE</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Repositories", value: stats?.publicRepos, icon: GitCommit, color: "text-cyan-400" },
          { label: "Followers", value: stats?.followers, icon: Users, color: "text-purple-400" },
          { label: "Total Stars", value: stats?.stars, icon: Star, color: "text-amber-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5 text-center flex flex-col items-center justify-center relative overflow-hidden group">
              <Icon size={16} className={`${s.color} mb-3 group-hover:scale-110 transition-transform`} />
              <p className="font-mono text-2xl font-black text-white">
                {s.value !== undefined ? s.value : "···"}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
