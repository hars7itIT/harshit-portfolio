"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldCheck, Award, Briefcase, FileText, Send, Sparkles } from "lucide-react";

export default function AIPlayground() {
  const [activeTab, setActiveTab] = useState<"resume" | "career" | "interview">("resume");

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-hidden pb-12">
      {/* Background Aurora Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      
      {/* Header bar */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft size={14} /> Back to core
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold">
            <Cpu size={16} className="animate-spin text-cyan-400" style={{ animationDuration: "12s" }} /> 
            AI COGNITIVE HUB
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          AI Playground
        </h1>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Simulate technical interviews, parse your resume against job metrics, or generate customized developer growth plans instantly.
        </p>
      </header>

      {/* Interface tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-white/5 bg-slate-950/40 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs tracking-wider uppercase transition-all ${
              activeTab === "resume" ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText size={14} />
            <span>Resume ATS</span>
          </button>
          
          <button
            onClick={() => setActiveTab("career")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs tracking-wider uppercase transition-all ${
              activeTab === "career" ? "bg-purple-500/10 border border-purple-500/20 text-purple-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase size={14} />
            <span>Career Path</span>
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs tracking-wider uppercase transition-all ${
              activeTab === "interview" ? "bg-pink-500/10 border border-pink-500/20 text-pink-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award size={14} />
            <span>Mock Interview</span>
          </button>
        </div>

        {/* Content sections */}
        <div className="mt-8">
          {activeTab === "resume" && <ResumeAnalyzerView />}
          {activeTab === "career" && <CareerAdvisorView />}
          {activeTab === "interview" && <InterviewSimulatorView />}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   1. RESUME ANALYZER COMPONENT
   ========================================== */
function ResumeAnalyzerView() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/resume-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resume, jobDescription: jd }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="font-mono text-xs uppercase text-slate-400 mb-2 tracking-wider">Paste Resume Contents</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Experience, Skills, Education..."
            className="flex-1 h-64 rounded-xl border border-white/5 bg-slate-950/20 p-4 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500/30 transition-all resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs uppercase text-slate-400 mb-2 tracking-wider">Target Job Description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Requirements, tech stack, job description..."
            className="flex-1 h-64 rounded-xl border border-white/5 bg-slate-950/20 p-4 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500/30 transition-all resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !resume || !jd}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-mono text-xs font-semibold text-white shadow-lg disabled:opacity-40 hover:opacity-95 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles size={14} /> {loading ? "Analyzing Alignment..." : "Run Cognitive Match"}
      </button>

      {result && (
        <div className="glass-card p-6 border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Analysis Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">{result.summary}</p>
            </div>
            <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
              <svg className="absolute w-full h-full transform -rotate-95">
                <circle cx="40" cy="40" r="34" className="stroke-white/5 fill-transparent" strokeWidth="4" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-cyan-400 fill-transparent transition-all duration-1000"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - result.atsScore / 100)}
                />
              </svg>
              <span className="font-mono text-lg font-bold text-white">{result.atsScore}%</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400">Matched Keywords</h4>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.matchedKeywords?.map((k: string) => (
                  <span key={k} className="rounded border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-xs text-cyan-400 font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-pink-400">Missing Keywords</h4>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.missingKeywords?.map((k: string) => (
                  <span key={k} className="rounded border border-pink-500/20 bg-pink-500/5 px-2.5 py-1 text-xs text-pink-400 font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-purple-400">Actionable Suggestions</h4>
            <ul className="mt-3 space-y-2">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-cyan-400 shrink-0">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   2. CAREER ADVISOR COMPONENT
   ========================================== */
function CareerAdvisorView() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAdvise = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role, currentSkills: skills }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="font-mono text-xs uppercase text-slate-400 mb-2 tracking-wider">Target Career Goal / Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Machine Learning Engineer, Security Architect"
            className="w-full rounded-xl border border-white/5 bg-slate-950/20 px-4 py-3 font-mono text-xs text-slate-200 outline-none focus:border-purple-500/30 transition-all"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs uppercase text-slate-400 mb-2 tracking-wider">Your Current Skills</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Java, basic SQL, Next.js, HTML/CSS"
            className="w-full rounded-xl border border-white/5 bg-slate-950/20 px-4 py-3 font-mono text-xs text-slate-200 outline-none focus:border-purple-500/30 transition-all"
          />
        </div>
      </div>

      <button
        onClick={handleAdvise}
        disabled={loading || !role}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-mono text-xs font-semibold text-white shadow-lg disabled:opacity-40 hover:opacity-95 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles size={14} /> {loading ? "Plotting Career Roadmap..." : "Synthesize Growth Roadmap"}
      </button>

      {result && (
        <div className="glass-card p-6 border-white/10 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Roadmap Assessment</h3>
            <p className="text-xs text-slate-400 mt-1">{result.careerOutlook}</p>
          </div>

          <div className="border-t border-white/5 pt-6 space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-purple-400">Learning Milestones</h4>
            <div className="space-y-4">
              {result.roadmap?.map((m: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-slate-950/20">
                  <span className="font-mono text-xs font-bold text-purple-400 shrink-0">Phase {i+1}</span>
                  <div>
                    <h5 className="text-sm font-bold text-white">{m.phase}</h5>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Duration: {m.timeEstimate}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {m.topics?.map((topic: string) => (
                        <span key={topic} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 border border-white/5 font-mono">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400">Core Portfolio Projects to Build</h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {result.recommendedProjects?.map((p: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-white/5 bg-slate-950/30">
                  <h5 className="text-sm font-bold text-white">{p.name}</h5>
                  <p className="text-[10px] font-mono text-cyan-400 mt-1">{p.stack}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   3. MOCK INTERVIEW SIMULATOR
   ========================================== */
function InterviewSimulatorView() {
  const [role, setRole] = useState("");
  const [stage, setStage] = useState<number | "eval">(0);
  const [history, setHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [evalResult, setEvalResult] = useState<any>(null);

  const startInterview = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setHistory([]);
    setEvalResult(null);
    try {
      const res = await fetch("/api/ai/interview-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [], targetRole: role, stage: 1 }),
      });
      const data = await res.json();
      setHistory([{ role: "assistant", content: data.question }]);
      setStage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const nextHistory = [...history, { role: "user" as const, content: input }];
    setHistory(nextHistory);
    setInput("");

    try {
      const nextStage = (stage as number) + 1;
      const response = await fetch("/api/ai/interview-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: nextHistory,
          targetRole: role,
          stage: nextStage > 3 ? "eval" : nextStage,
        }),
      });
      const data = await response.json();

      if (nextStage > 3) {
        setStage("eval");
        setEvalResult(data.evaluation);
      } else {
        setStage(nextStage);
        setHistory((prev) => [...prev, { role: "assistant", content: data.question }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {stage === 0 ? (
        <div className="p-6 border border-white/5 rounded-2xl bg-slate-950/20 text-center space-y-4">
          <label className="block font-mono text-xs uppercase text-slate-400 tracking-wider">Select Mock Interview Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. React Developer, Backend Engineer, System Design"
            className="w-full max-w-md mx-auto rounded-xl border border-white/5 bg-slate-950/20 px-4 py-3 font-mono text-xs text-slate-200 outline-none focus:border-pink-500/30 transition-all text-center"
          />
          <button
            onClick={startInterview}
            disabled={loading || !role}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-mono text-xs font-semibold text-white shadow-lg disabled:opacity-40 hover:opacity-95 transition-all block mx-auto"
          >
            Start Simulator Session
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="font-mono text-xs text-pink-400">STAGE: {stage === "eval" ? "EVALUATION" : `QUESTION ${stage} OF 3`}</span>
            <button onClick={() => setStage(0)} className="font-mono text-[10px] uppercase text-slate-400 hover:text-white">
              Reset Session
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {history.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl p-3.5 text-xs ${
                  m.role === "user"
                    ? "bg-pink-500/10 border border-pink-500/20 text-slate-200"
                    : "bg-slate-900 border border-white/5 text-slate-300"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs font-mono text-slate-400 animate-pulse">interviewer thinking...</div>}
          </div>

          {stage !== "eval" && (
            <div className="flex gap-2 border-t border-white/5 pt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                placeholder="Type your response to the question..."
                className="flex-1 bg-transparent border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-pink-500/30"
              />
              <button
                onClick={handleAnswerSubmit}
                disabled={loading}
                className="rounded-xl border border-pink-500/20 bg-pink-500/5 px-4 text-pink-400 hover:bg-pink-500 hover:text-white transition-all disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>
          )}

          {evalResult && (
            <div className="border-t border-white/5 pt-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h4 className="text-lg font-bold text-white">Interview Assessment Score</h4>
                <span className="font-mono text-2xl font-black text-pink-400">{evalResult.score}%</span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">{evalResult.summary}</p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h5 className="font-mono text-xs uppercase text-cyan-400">Strengths</h5>
                  <ul className="mt-2 space-y-1.5">
                    {evalResult.strengths?.map((s: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                        <span className="text-cyan-400">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-mono text-xs uppercase text-pink-400">Areas for Focus</h5>
                  <ul className="mt-2 space-y-1.5">
                    {evalResult.weaknesses?.map((w: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-1">
                        <span className="text-pink-400">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
