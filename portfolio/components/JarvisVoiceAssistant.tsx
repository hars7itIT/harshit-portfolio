"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, Sparkles, HelpCircle, Phone, Mail, MapPin, MessageSquare, Terminal, Play, Square, Activity, CheckSquare, Square as UncheckedSquare, ChevronRight } from "lucide-react";
import { toggleTheme } from "@/components/ThemeInit";

interface JarvisVoiceAssistantProps {
  avatarSrc: string;
  name: string;
}

type Message = { role: "user" | "assistant"; content: string };
type ActionLog = { time: string; action: string };
type PlanItem = { label: string; status: "pending" | "current" | "done" };

const QUICK_COMMANDS = [
  { label: "Start Tour", action: "Start Tour" },
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
  const [isMuted, setIsMuted] = useState(true); // Default to muted to comply with browser autoplay rules
  const [statusText, setStatusText] = useState("Online");

  // Cognitive HUD States
  const [agentStatus, setAgentStatus] = useState<"OBSERVING" | "THINKING" | "PLANNING" | "EXECUTING" | "READY" | "GUIDING TOUR">("READY");
  const [agentThought, setAgentThought] = useState("Awaiting visitor activity. Systems fully optimized.");
  const [planChecklist, setPlanChecklist] = useState<PlanItem[]>([
    { label: "Initialize Interface Logs", status: "done" },
    { label: "Detect Referral Source", status: "done" },
    { label: "Conduct Autonomic Tour", status: "pending" },
    { label: "Audit Recruiter Interest", status: "pending" },
    { label: "Deliver System Credentials", status: "pending" },
  ]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    { time: "00:00", action: "JARVIS Core loaded" }
  ]);

  // Hiring Wizard States
  const [hiringStep, setHiringStep] = useState(0); // 0 = idle, 1 = name, 2 = company, 3 = email, 4 = requirements
  const [hiringData, setHiringData] = useState({ name: "", company: "", email: "", details: "" });

  // Tour States
  const [tourStep, setTourStep] = useState(-1); // -1 = not started, 0 = introduction, 1 = about, 2 = skills, 3 = projects, 4 = finished
  const tourTimeoutRef = useRef<any>(null);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Helper to log action in HUD audit trail
  const logAction = (actionStr: string) => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    setActionLogs((prev) => [{ time: `${mm}:${ss}`, action: actionStr }, ...prev.slice(0, 7)]);
  };

  // Auto-scroll chat window
  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Load chat history & referral detection & proactive introduction trigger
  useEffect(() => {
    const history = sessionStorage.getItem("jarvis_chat_history");
    if (history) {
      setMessages(JSON.parse(history));
    }

    // Detect referral source
    let referralText = "direct link";
    let customizedWelcome = "";
    
    if (typeof document !== "undefined") {
      const ref = document.referrer.toLowerCase();
      if (ref.includes("linkedin")) {
        referralText = "LinkedIn";
        customizedWelcome = "Welcome! I noticed you're visiting Harshit's portfolio from LinkedIn. I will give you a quick overview of his professional engineering background.";
      } else if (ref.includes("github")) {
        referralText = "GitHub";
        customizedWelcome = "Welcome! Since you're coming from GitHub, I'll start by focusing on Harshit's best full-stack and agentic development projects.";
      }
    }
    
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      referralText = `${referralText} (Mobile)`;
      customizedWelcome = "Welcome! You're viewing the mobile version of the portfolio. I'll keep the autonomic tour brief and focused.";
    }

    setAgentThought(`Referral detected: ${referralText}. Formulating custom welcoming plan...`);
    logAction(`Referral detected: ${referralText}`);

    const startOrQueueTour = () => {
      setIsMuted(false);
      startPortfolioTour(customizedWelcome);
    };

    // Always start the Auto Portfolio Tour after boot sequence unmounts on reload/visit
    const timer = setTimeout(() => {
      startOrQueueTour();
      
      // Fallback: If browser blocks audio autoplay, capture first click gesture anywhere to resume tour voice
      const handleGesture = () => {
        setIsMuted(false);
        document.removeEventListener("click", handleGesture);
      };
      document.addEventListener("click", handleGesture);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for auto-explaining project events
  useEffect(() => {
    const handleProjectExplain = (e: Event) => {
      const project = (e as CustomEvent).detail;
      setAgentStatus("EXECUTING");
      setAgentThought(`Explaining project node: ${project.name}. Reading stack metrics.`);
      logAction(`Opened file ${project.name}`);

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
      speak(`Loaded details for project ${project.name}. It is built with ${project.stack[0]}.`);
      setAgentStatus("READY");
    };

    window.addEventListener("jarvis-explain-project", handleProjectExplain);
    return () => window.removeEventListener("jarvis-explain-project", handleProjectExplain);
  }, [isMuted]);

  // Listen for behavioral tracking events (proactive HUD updates based on scroll)
  useEffect(() => {
    const handleBehavior = (e: Event) => {
      const sectionId = (e as CustomEvent).detail;
      setAgentThought(`Visitor scrolled to [${sectionId}]. Auditing recruiter interest...`);
      logAction(`Viewed section: ${sectionId}`);

      let proactiveText = "";
      if (sectionId === "skills") {
        proactiveText = "I see you are inspecting Harshit's skills database. He has stable proficiency in TypeScript, C++, React, and AI-agent integrations.";
      } else if (sectionId === "education") {
        proactiveText = "Harshit is currently in his second year studying Computer Science at Panjab University, Chandigarh.";
      } else if (sectionId === "experience") {
        proactiveText = "Exploring experience timeline. Harshit has shipped dynamic projects like WomenHealthCare and diagnostic engines like FixIQ.";
      }

      if (proactiveText && tourStep === -1) { // Only do scroll proactive chat inserts if not currently in tour
        setMessages((m) => {
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
  }, [isMuted, tourStep]);

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
          setAgentStatus("OBSERVING");
          setAgentThought("Monitoring speech input nodes...");
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
          setStatusText("Online");
          setAgentStatus("READY");
        };

        rec.onend = () => {
          setIsListening(false);
          setStatusText("Online");
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          logAction(`Speech input captured`);
          handleSendMessage(transcript);
        };

        recognitionRef.current = rec;
      }
    }
  }, [messages, hiringStep, hiringData, tourStep]);

  // Text-To-Speech (TTS)
  const speak = (text: string, onEndCallback?: () => void) => {
    if (isMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }
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

      if (onEndCallback) {
        utterance.onend = () => {
          onEndCallback();
        };
      }

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEndCallback) onEndCallback();
    }
  };

  // Triggers action tags based on AI instructions
  const executeClientAction = (actionStr: string) => {
    logAction(`Triggered action: ${actionStr}`);
    
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

  // -------------------------------------------------------------
  // AUTONOMOUS PORTFOLIO TOUR STATE MACHINE
  // -------------------------------------------------------------
  const startPortfolioTour = (welcomeOverride = "") => {
    setTourStep(0);
    setAgentStatus("GUIDING TOUR");
    setAgentThought("Guiding recruiter through portfolio. Executing Intro script.");
    logAction("Auto-Tour started");
    
    // Update checklist in HUD
    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "current" },
      { label: "Audit Recruiter Interest", status: "pending" },
      { label: "Deliver System Credentials", status: "pending" },
    ]);

    const introSpeech = welcomeOverride || `Hello, and welcome to Harshit Gupta's portfolio. I'm JARVIS, Harshit's autonomous AI assistant. I'm here to guide you through his work and answer any questions you may have. Harshit is a second-year Computer Science Engineering student at UIET Chandigarh with a strong passion for Full Stack Development, Artificial Intelligence, and solving real-world problems. Let's begin the tour.`;

    setMessages((m) => [
      ...m,
      { role: "assistant", content: `🎙️ **[TOUR STARTED]**\n\n${introSpeech}` }
    ]);
    
    speak(introSpeech, () => {
      // Move to Step 1 (About Section) after 1000ms pause
      tourTimeoutRef.current = setTimeout(() => runTourStep1(), 1200);
    });
  };

  const runTourStep1 = () => {
    setTourStep(1);
    setAgentThought("Tour Step 1: Navigating to About section. Presenting philosophy.");
    executeClientAction("SCROLL_TO_ABOUT");

    const text = "First, let's explore Harshit's engineering philosophy. He believes in a builder mindset, learning concepts by shipping real code. He is a full-stack native, handling database modeling, server middleware, and responsive client layouts.";

    setMessages((m) => [...m, { role: "assistant", content: `🎙️ **[TOUR: ABOUT]**\n\n${text}` }]);
    speak(text, () => {
      tourTimeoutRef.current = setTimeout(() => runTourStep2(), 1200);
    });
  };

  const runTourStep2 = () => {
    setTourStep(2);
    setAgentThought("Tour Step 2: Navigating to Skills matrix. Presenting capabilities.");
    executeClientAction("SCROLL_TO_SKILLS");

    const text = "Here is Harshit's technical toolkit. It is structured by domain and system layer, spanning languages like C++ and TypeScript, frontend tools like Next.js and Tailwind, backend framework Node, databases PostgreSQL and MongoDB, and AI prompt engineering.";

    setMessages((m) => [...m, { role: "assistant", content: `🎙️ **[TOUR: SKILLS]**\n\n${text}` }]);
    speak(text, () => {
      tourTimeoutRef.current = setTimeout(() => runTourStep3(), 1200);
    });
  };

  const runTourStep3 = () => {
    setTourStep(3);
    setAgentThought("Tour Step 3: Navigating to Projects catalog. Auto-selecting WomenHealthCare.");
    executeClientAction("SCROLL_TO_PROJECTS");
    
    // Automatically select the WomenHealthCare project card
    window.dispatchEvent(new CustomEvent("jarvis-filter", { detail: "All" }));

    const text = "Next, let's look at his projects. He has shipped platforms like WomenHealthCare, a full-stack digital wellness hub with ovulation forecasts and Gemini AI consultations, and FixIQ, a browser-only AI diagnostic tool.";

    setMessages((m) => [...m, { role: "assistant", content: `🎙️ **[TOUR: PROJECTS]**\n\n${text}` }]);
    speak(text, () => {
      tourTimeoutRef.current = setTimeout(() => finishTour(), 1200);
    });
  };

  const finishTour = () => {
    setTourStep(4);
    setAgentThought("Tour complete. Restoring agent to standby observing mode.");
    logAction("Auto-Tour completed");

    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "done" },
      { label: "Audit Recruiter Interest", status: "done" },
      { label: "Deliver System Credentials", status: "current" },
    ]);

    const text = "That concludes the autonomous overview. I have unlocked the quick commands panel below. You can ask me questions about his projects, download his resume directly, or say 'Contact Harshit' to schedule an interview. How would you like to proceed?";

    setMessages((m) => [...m, { role: "assistant", content: `🎙️ **[TOUR COMPLETE]**\n\n${text}` }]);
    speak(text);
    
    setTourStep(-1); // Reset back to idle mode
    setAgentStatus("READY");
  };

  const skipTour = () => {
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setTourStep(-1);
    setAgentStatus("READY");
    setAgentThought("Autonomic tour skipped by visitor. standing by.");
    logAction("Auto-Tour skipped");
    
    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "done" },
      { label: "Audit Recruiter Interest", status: "current" },
      { label: "Deliver System Credentials", status: "pending" },
    ]);

    const msg = "Tour skipped. System ready. Ask me any question or click a quick command chip.";
    setMessages((m) => [...m, { role: "assistant", content: msg }]);
  };

  // -------------------------------------------------------------
  // MESSAGE HANDLER & WIZARDS
  // -------------------------------------------------------------
  const startHiringWizard = () => {
    setHiringStep(1);
    setAgentStatus("PLANNING");
    setAgentThought("Recruiter hiring flow detected. Initiating multi-step planner.");
    logAction("Hiring workflow initiated");

    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "done" },
      { label: "Audit Recruiter Interest", status: "current" },
      { label: "Deliver System Credentials", status: "pending" },
    ]);

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

    // Check if user requested starting the tour manually
    if (trimmed.toLowerCase().includes("start tour") || trimmed.toLowerCase().includes("play tour")) {
      startPortfolioTour();
      return;
    }

    // Save user message
    const updatedMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(updatedMessages);
    sessionStorage.setItem("jarvis_chat_history", JSON.stringify(updatedMessages));
    setInput("");

    const lowerText = trimmed.toLowerCase();

    // 1. Intercept hiring triggers
    if (lowerText.includes("hire") || lowerText.includes("contact har")) {
      if (hiringStep === 0) {
        startHiringWizard();
        return;
      }
    }

    // 2. Wizard Dialogue State Machine
    if (hiringStep > 0) {
      setAgentStatus("PLANNING");
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
        setAgentStatus("EXECUTING");
        setAgentThought("Submitting database inquiry node and downloading credentials.");
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
            
            setPlanChecklist([
              { label: "Initialize Interface Logs", status: "done" },
              { label: "Detect Referral Source", status: "done" },
              { label: "Conduct Autonomic Tour", status: "done" },
              { label: "Audit Recruiter Interest", status: "done" },
              { label: "Deliver System Credentials", status: "done" },
            ]);
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
          setAgentStatus("READY");
        }
      }
      return;
    }

    // 3. Regular LLM chat flow
    setLoading(true);
    setAgentStatus("THINKING");
    setAgentThought("Reasoning over local portfolio document indexes...");
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
        setAgentStatus("READY");
      } else {
        const rawReply = data.reply;
        
        // Match Action Tags [ACTION:XXX]
        const actionRegex = /\[ACTION:[A-Z_]+\]/g;
        const matches = rawReply.match(actionRegex);
        const cleanReply = rawReply.replace(actionRegex, "").trim();
        
        const finalMessages = [...updatedMessages, { role: "assistant" as const, content: cleanReply }];
        setMessages(finalMessages);
        sessionStorage.setItem("jarvis_chat_history", JSON.stringify(finalMessages));
        
        speak(cleanReply);
        setStatusText("Online");
        setAgentStatus("READY");

        if (matches) {
          setAgentStatus("EXECUTING");
          matches.forEach((act: string) => executeClientAction(act));
          setAgentStatus("READY");
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Apologies, I encountered an uplink error. Try again." }]);
      setStatusText("Online");
      setAgentStatus("READY");
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
      setIsMuted(false); // Unmute so voice responses can be heard
      recognitionRef.current.start();
    }
  };

  const clearConversation = () => {
    const freshMessages = [
      {
        role: "assistant" as const,
        content: "Dialogue logs refreshed. Ask me anything or trigger a quick command.",
      },
    ];
    setMessages(freshMessages);
    sessionStorage.setItem("jarvis_chat_history", JSON.stringify(freshMessages));
    setHiringStep(0);
    setTourStep(-1);
    setAgentStatus("READY");
    setAgentThought("STANDBY. Awaiting visitor activities.");
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* 1. JARVIS Conversational Console Panel */}
      <div className="flex flex-col bg-slate-950/40 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-md justify-between min-h-[460px] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
        
        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <span>JARVIS CONSOLE</span>
              </h3>
              <p className="font-mono text-[9px] text-muted uppercase mt-0.5">Voice & Dialogue Console</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg border border-line transition-colors cursor-pointer ${
                  isMuted ? "text-muted hover:text-text" : "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:text-cyan-300"
                }`}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>

              <button
                onClick={clearConversation}
                className="p-1.5 rounded-lg border border-line text-muted hover:text-text cursor-pointer"
                title="Clear Chat Logs"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Active Auto-Tour Control Bar */}
          {tourStep > -1 && (
            <div className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play size={12} className="text-purple-400 animate-pulse" />
                <span className="font-mono text-[9px] text-purple-300 font-bold uppercase tracking-wider">GUIDING TOUR...</span>
              </div>
              <button
                onClick={skipTour}
                className="font-mono text-[9px] font-bold text-white bg-purple-500 px-2.5 py-1 rounded hover:bg-purple-600 transition-colors cursor-pointer"
              >
                Skip Introduction
              </button>
            </div>
          )}

          {/* Conversation Logs window */}
          <div
            ref={chatScrollRef}
            className="mt-4 space-y-3 h-[200px] overflow-y-auto pr-1.5 custom-scroll font-mono text-[11px] leading-relaxed"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[90%] rounded-xl p-3 border whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                      : m.content.startsWith("🎙️ **[TOUR")
                      ? "bg-purple-950/20 border-purple-500/20 text-purple-300"
                      : m.content.startsWith("📁 Loading")
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
        </div>
      </div>

      {/* 2. JARVIS Cognitive Core HUD Panel (The Operating System View) */}
      <div className="flex flex-col bg-slate-950/40 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-md font-mono text-[10px]">
        
        {/* HUD header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-cyan-400 animate-pulse" />
            <span className="font-bold text-text uppercase tracking-wider">JARVIS COGNITIVE CORE</span>
          </div>
          <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] text-cyan-400 font-bold uppercase animate-pulse">
            Status: {agentStatus}
          </span>
        </div>

        {/* Thought Logs Stream */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Thought Stream</div>
          <div className="bg-slate-900/60 border border-line p-3 rounded-xl text-cyan-300 leading-normal min-h-[48px] italic">
            &quot;{agentThought}&quot;
          </div>
        </div>

        {/* Plan Checklist */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Plan Checklist</div>
          <div className="space-y-1 bg-surface/5 border border-line p-2.5 rounded-xl">
            {planChecklist.map((item, i) => (
              <div key={i} className={`flex items-center gap-2 ${item.status === 'done' ? 'text-slate-500 line-through' : item.status === 'current' ? 'text-cyan-400 font-bold' : 'text-muted'}`}>
                {item.status === 'done' ? (
                  <span className="text-emerald-400 font-bold">✓</span>
                ) : item.status === 'current' ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <span className="text-slate-700">•</span>
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Trail */}
        <div className="space-y-1.5">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">System Action Audit Trail</div>
          <div className="bg-slate-900/40 rounded-xl p-2.5 space-y-1 max-h-[85px] overflow-y-auto custom-scroll text-[9px] border border-line">
            {actionLogs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-cyan-500/60 font-semibold">[{log.time}]</span>
                <span className="text-muted flex-1 truncate">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
