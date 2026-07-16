"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, Sparkles, HelpCircle, Phone, Mail, MapPin, MessageSquare, Terminal } from "lucide-react";
import { toggleTheme } from "@/components/ThemeInit";

interface JarvisVoiceAssistantProps {
  avatarSrc: string;
  name: string;
}

type Message = { role: "user" | "assistant"; content: string };

const QUICK_COMMANDS = [
  { label: "Show Projects", action: "Show Projects" },
  { label: "Filter AI", action: "Filter AI projects" },
  { label: "Filter Full Stack", action: "Filter Full Stack projects" },
  { label: "Download Resume", action: "Download Resume" },
  { label: "Contact Harshit", action: "Contact Harshit" },
  { label: "Toggle Theme", action: "Toggle Theme" },
  { label: "About Me", action: "About Me" },
];

export default function JarvisVoiceAssistant({ avatarSrc, name }: JarvisVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted to comply with browser audio rules
  const [statusText, setStatusText] = useState("Online");

  // Hiring Wizard States
  const [hiringStep, setHiringStep] = useState(0); // 0 = idle, 1 = name, 2 = company, 3 = email, 4 = requirements
  const [hiringData, setHiringData] = useState({ name: "", company: "", email: "", details: "" });

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Load chat history & proactive greeting
  useEffect(() => {
    const history = sessionStorage.getItem("jarvis_chat_history");
    if (history) {
      setMessages(JSON.parse(history));
    } else {
      // Proactive greeting on first visit
      const timer = setTimeout(() => {
        const welcomeMsg = "Systems online. Welcome to Harshit's portfolio. I am JARVIS, his autonomous assistant. Would you like a 60-second summary, to view projects, or to download his resume?";
        const initMsgs = [{ role: "assistant" as const, content: welcomeMsg }];
        setMessages(initMsgs);
        sessionStorage.setItem("jarvis_chat_history", JSON.stringify(initMsgs));
        speak(welcomeMsg);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for auto-explaining project events
  useEffect(() => {
    const handleProjectExplain = (e: Event) => {
      const project = (e as CustomEvent).detail;
      
      const explanationText = `📁 Loading database entry for ${project.name}:
      
• Category: ${project.category}
• Tech Stack: ${project.stack.join(", ")}
• Key Features: ${project.features.join(", ")}
• Architecture: ${project.architecture}
• Challenge: ${project.challenges[0]}
• Solution: ${project.solutions[0]}`;

      setMessages((m) => {
        const next = [...m, { role: "assistant" as const, content: explanationText }];
        sessionStorage.setItem("jarvis_chat_history", JSON.stringify(next));
        return next;
      });
      speak(`Loaded details for project ${project.name}. It is built with ${project.stack[0]} and ${project.stack[1]}.`);
    };

    window.addEventListener("jarvis-explain-project", handleProjectExplain);
    return () => window.removeEventListener("jarvis-explain-project", handleProjectExplain);
  }, [isMuted]);

  // Listen for behavioral tracking events (proactive alerts based on scroll)
  useEffect(() => {
    const handleBehavior = (e: Event) => {
      const sectionId = (e as CustomEvent).detail;
      let proactiveText = "";

      if (sectionId === "skills") {
        proactiveText = "I see you are inspecting Harshit's skills database. He has stable proficiency in TypeScript, C++, React, and AI-agent integrations.";
      } else if (sectionId === "education") {
        proactiveText = "Harshit is currently in his second year studying Computer Science at Panjab University, Chandigarh.";
      } else if (sectionId === "experience") {
        proactiveText = "Exploring experience timeline. Harshit has shipped dynamic projects like WomenHealthCare and diagnostic engines like FixIQ.";
      }

      if (proactiveText) {
        setMessages((m) => {
          // Prevent spamming the same consecutive proactive message
          if (m[m.length - 1]?.content === proactiveText) return m;
          const next = [...m, { role: "assistant" as const, content: `[Proactive Agent] ${proactiveText}` }];
          sessionStorage.setItem("jarvis_chat_history", JSON.stringify(next));
          return next;
        });
        speak(proactiveText);
      }
    };

    window.addEventListener("jarvis-behavior-tracked", handleBehavior);
    return () => window.removeEventListener("jarvis-behavior-tracked", handleBehavior);
  }, [isMuted]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
          setStatusText("Listening...");
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
          setStatusText("Online");
        };

        rec.onend = () => {
          setIsListening(false);
          setStatusText("Online");
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSendMessage(transcript);
        };

        recognitionRef.current = rec;
      }
    }
  }, [messages, hiringStep, hiringData]);

  // Text-To-Speech (TTS)
  const speak = (text: string) => {
    if (isMuted) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\[ACTION:[A-Z_]+\]/g, "").replace(/[•📁]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Male") ||
          v.name.includes("Google UK English Male") ||
          v.name.includes("David")
      );
      if (preferred) utterance.voice = preferred;
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Triggers action tags based on AI instructions
  const executeClientAction = (actionStr: string) => {
    console.log("JARVIS OS executing interface action:", actionStr);
    
    if (actionStr.includes("SCROLL_TO_ABOUT")) {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_PROJECTS")) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_SKILLS")) {
      document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_EDUCATION")) {
      document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_EXPERIENCE")) {
      document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_CONTACT")) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("TOGGLE_THEME")) {
      toggleTheme();
    } else if (actionStr.includes("DOWNLOAD_RESUME")) {
      const link = document.createElement("a");
      link.href = "/Harshit_Gupta_Resume.docx";
      link.download = "Harshit_Gupta_Resume.docx";
      link.click();
    } else if (actionStr.includes("FILTER_AI")) {
      window.dispatchEvent(new CustomEvent("jarvis-filter", { detail: "AI" }));
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("FILTER_FULLSTACK")) {
      window.dispatchEvent(new CustomEvent("jarvis-filter", { detail: "Full Stack" }));
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("FILTER_ALL")) {
      window.dispatchEvent(new CustomEvent("jarvis-filter", { detail: "All" }));
    }
  };

  const startHiringWizard = () => {
    setHiringStep(1);
    const text = "Initializing hiring protocol wizard. Step 1: May I know your name?";
    setMessages((m) => {
      const next = [...m, { role: "assistant" as const, content: text }];
      sessionStorage.setItem("jarvis_chat_history", JSON.stringify(next));
      return next;
    });
    speak(text);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    // Save user message
    const updatedMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(updatedMessages);
    sessionStorage.setItem("jarvis_chat_history", JSON.stringify(updatedMessages));
    setInput("");

    const lowerText = trimmed.toLowerCase();

    // 1. Intercept hiring triggers or scroll controls
    if (lowerText.includes("hire") || lowerText.includes("contact har")) {
      if (hiringStep === 0) {
        startHiringWizard();
        return;
      }
    }

    // 2. Wizard Dialogue State Machine
    if (hiringStep > 0) {
      if (hiringStep === 1) {
        setHiringData((d) => ({ ...d, name: trimmed }));
        setHiringStep(2);
        const reply = `Got it, ${trimmed}. Step 2: What is the name of your organization/company?`;
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } else if (hiringStep === 2) {
        setHiringData((d) => ({ ...d, company: trimmed }));
        setHiringStep(3);
        const reply = "Understood. Step 3: What is the best email address to contact you?";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } else if (hiringStep === 3) {
        setHiringData((d) => ({ ...d, email: trimmed }));
        setHiringStep(4);
        const reply = "Perfect. Step 4: Could you write a short description of the project or role requirements?";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } else if (hiringStep === 4) {
        setLoading(true);
        setStatusText("Saving...");
        try {
          const payload = {
            name: hiringData.name,
            email: hiringData.email,
            message: `Hiring Request from ${hiringData.company}:\n${trimmed}`,
          };

          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const successReply = "Uplink successful! I have stored your enquiry in Harshit's database and triggered the resume download module for your reference. He will get back to you shortly.";
            setMessages((m) => [...m, { role: "assistant", content: successReply }]);
            speak(successReply);
            executeClientAction("DOWNLOAD_RESUME");
            executeClientAction("SCROLL_TO_CONTACT");
          } else {
            throw new Error();
          }
        } catch {
          const fallbackReply = "Database submission currently offline. Opening local mail composer with details, and downloading Harshit's resume.";
          setMessages((m) => [...m, { role: "assistant", content: fallbackReply }]);
          speak(fallbackReply);
          executeClientAction("DOWNLOAD_RESUME");
          window.location.href = `mailto:Chandreshgupta999@gmail.com?subject=Hiring interest from ${hiringData.name}&body=Company: ${hiringData.company}\nDetails: ${trimmed}`;
        } finally {
          setHiringStep(0);
          setLoading(false);
          setStatusText("Online");
        }
      }
      return;
    }

    // 3. Regular LLM chat flow
    setLoading(true);
    setStatusText("Thinking...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error ?? "Something went wrong." }]);
        setStatusText("Online");
      } else {
        const rawReply = data.reply;
        const actionRegex = /\[ACTION:[A-Z_]+\]/g;
        const matches = rawReply.match(actionRegex);
        const cleanReply = rawReply.replace(actionRegex, "").trim();
        
        const finalMessages = [...updatedMessages, { role: "assistant" as const, content: cleanReply }];
        setMessages(finalMessages);
        sessionStorage.setItem("jarvis_chat_history", JSON.stringify(finalMessages));
        
        speak(cleanReply);
        setStatusText("Online");

        if (matches) {
          matches.forEach((act: string) => executeClientAction(act));
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Apologies, I encountered an uplink error. Try again." }]);
      setStatusText("Online");
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice control is not fully supported on this browser. Try Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsMuted(false); // Unmute so user hears spoken answers
      recognitionRef.current.start();
    }
  };

  const clearConversation = () => {
    const freshMessages = [
      {
        role: "assistant" as const,
        content: "Dialogue logs refreshed. Ask me anything or trigger an action.",
      },
    ];
    setMessages(freshMessages);
    sessionStorage.setItem("jarvis_chat_history", JSON.stringify(freshMessages));
    setHiringStep(0);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-md justify-between min-h-[570px] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
      
      {/* Inner Header */}
      <div>
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="font-mono text-sm font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <span>JARVIS</span>
              <span className="text-[10px] text-cyan-400 font-semibold lowercase opacity-75">v2.0</span>
            </h3>
            <p className="font-mono text-[9px] text-muted uppercase mt-0.5">Autonomous Agent OS</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg border border-line transition-colors cursor-pointer ${
                isMuted ? "text-muted hover:text-text" : "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:text-cyan-300"
              }`}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            {/* Clear logs */}
            <button
              onClick={clearConversation}
              className="p-1.5 rounded-lg border border-line text-muted hover:text-text cursor-pointer"
              title="Clear Chat Logs"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Tagline Instruction */}
        <div className="mt-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 flex items-start gap-2.5">
          <Sparkles size={14} className="text-cyan-400 mt-0.5 shrink-0 animate-pulse" />
          <p className="font-mono text-[10px] text-cyan-300 leading-normal">
            ✨ Ask anything. Jarvis will automatically detect your request and assist you.
          </p>
        </div>

        {/* Conversation Logs window */}
        <div
          ref={chatScrollRef}
          className="mt-4 space-y-3 h-[250px] overflow-y-auto pr-1.5 custom-scroll font-mono text-[11px] leading-relaxed"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[90%] rounded-xl p-3 border whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                    : m.content.startsWith("[Auto-Explain]")
                    ? "bg-slate-900/60 border-cyan-500/10 text-text"
                    : m.content.startsWith("[Proactive Agent]")
                    ? "bg-purple-950/15 border-purple-500/10 text-purple-300"
                    : "bg-surface/30 border-line text-muted"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1.5 text-muted tracking-widest pl-1 uppercase font-bold text-[9px] animate-pulse">
              <span className="h-1 w-1 bg-muted rounded-full animate-bounce" />
              <span className="h-1 w-1 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="h-1 w-1 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              thinking
            </div>
          )}
        </div>
      </div>

      {/* Input controls */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
        {/* Quick Commands Chips */}
        <div>
          <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Try these commands</span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_COMMANDS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(chip.action)}
                className="font-mono text-[9px] font-semibold text-muted bg-white/5 border border-line hover:border-cyan-500/30 hover:text-cyan-400 p-1.5 px-2.5 rounded-lg transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Soundwaves visualizer & mic controls */}
        <div className="flex items-center justify-between bg-surface/20 border border-line rounded-xl p-2.5 px-4">
          <div className={`voice-wave ${isListening ? "active" : ""}`}>
            <span className="voice-bar" />
            <span className="voice-bar" />
            <span className="voice-bar" />
            <span className="voice-bar" />
            <span className="voice-bar" />
          </div>

          <button
            onClick={toggleListening}
            className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all cursor-pointer relative ${
              isListening
                ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-ink border-line text-cyan-400 hover:border-cyan-500/30"
            }`}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? <Mic size={16} className="animate-pulse" /> : <Mic size={16} />}
          </button>

          <span className="font-mono text-[9px] text-muted tracking-wide uppercase select-none">
            {statusText}
          </span>
        </div>

        {/* Text chat input form */}
        <div className="flex items-center gap-2 border border-line bg-surface/10 rounded-xl p-1.5 px-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder={hiringStep > 0 ? "Enter details..." : "Type your message..."}
            className="flex-1 bg-transparent border-none text-[11px] font-mono text-text outline-none placeholder:text-muted py-1"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="h-7 w-7 rounded-lg border border-line flex items-center justify-center text-cyan-400 hover:text-cyan-300 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <Send size={11} />
          </button>
        </div>

        {/* Contact info widget */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-muted text-[10px] font-mono select-none">
          <div className="flex items-center gap-1.5">
            <Phone size={10} className="text-cyan-400" />
            <span>+91 8052702560</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={10} className="text-purple-400" />
            <span>Chandreshgupta999@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
