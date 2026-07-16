"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, RefreshCw, Play, Pause, Square, Activity, Send, ArrowUpRight, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { toggleTheme } from "@/components/ThemeInit";

interface JarvisVoiceAssistantProps {
  avatarSrc: string;
  name: string;
}

type Message = { role: "user" | "assistant"; content: string };
type ActionLog = { time: string; action: string };
type PlanItem = { label: string; status: "pending" | "current" | "done" };

// Sound synthesizer using Web Audio API
const playBeep = (type: "click" | "hover" | "boot" | "alert") => {
  if (typeof window === "undefined" || !window.AudioContext) return;
  const savedMute = sessionStorage.getItem("jarvis_muted");
  if (savedMute === "true") return;

  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "boot") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.16);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "alert") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    // Ignore block audio errors
  }
};

export default function JarvisVoiceAssistant({ avatarSrc, name }: JarvisVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Standby Mode.\n\nClick the JARVIS Avatar on the home page to initialize the voice receptionist tour, or type your question below." }
  ]);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [statusText, setStatusText] = useState("Online");

  // Playback Control States
  const [speechState, setSpeechState] = useState<"idle" | "speaking" | "paused">("idle");
  const [jarvisState, setJarvisState] = useState<"idle" | "listening" | "thinking" | "speaking" | "offline">("offline");
  const [inputValue, setInputValue] = useState("");
  const [lastSpokenText, setLastSpokenText] = useState("");

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
  const [hiringStep, setHiringStep] = useState(0); 
  const [hiringData, setHiringData] = useState({ name: "", company: "", email: "", details: "" });

  // Tour States
  const [tourStep, setTourStep] = useState(-1);
  const tourTimeoutRef = useRef<any>(null);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync state reference to avoid closures in callbacks
  const speechStateRef = useRef(speechState);
  useEffect(() => {
    speechStateRef.current = speechState;
  }, [speechState]);

  // Log action helper
  const logAction = (actionStr: string) => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    setActionLogs((prev) => [{ time: `${mm}:${ss}`, action: actionStr }, ...prev.slice(0, 7)]);
  };

  // Sync global states & emit events to centerpiece avatar
  useEffect(() => {
    const currentState = isMuted 
      ? "offline" 
      : isListening 
        ? "listening" 
        : loading 
          ? "thinking" 
          : speechState === "speaking" 
            ? "speaking" 
            : "idle";
    
    setJarvisState(currentState);
    window.dispatchEvent(new CustomEvent("jarvis-state-changed", { detail: currentState }));
  }, [isMuted, isListening, loading, speechState]);

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 240;
      canvas.height = 36;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += 0.15;

      const bars = 22;
      const spacing = 4;
      const width = (canvas.width - (bars - 1) * spacing) / bars;

      for (let i = 0; i < bars; i++) {
        // Amplitude based on state
        let amp = 2;
        if (jarvisState === "speaking") {
          amp = 14 * Math.abs(Math.sin(phase + i * 0.3)) * (Math.sin(phase * 0.4) > 0 ? 1.2 : 0.6);
        } else if (jarvisState === "listening") {
          amp = 18 * Math.abs(Math.cos(phase * 1.5 + i * 0.25)) + Math.random() * 4;
        } else if (jarvisState === "thinking") {
          amp = 5 * Math.abs(Math.sin(phase * 0.5 + i * 0.1)) + Math.random() * 2;
        } else if (jarvisState === "idle") {
          amp = 2 + Math.sin(phase * 0.2 + i * 0.5) * 1.5;
        } else {
          amp = 0.5; // offline / flat
        }

        const h = Math.max(1, amp);
        const y = (canvas.height - h) / 2;
        const x = i * (width + spacing);

        // Color styling
        let color = "rgba(148, 163, 184, 0.2)";
        if (jarvisState === "speaking") {
          color = `rgba(6, 182, 212, ${0.4 + (h / 20)})`;
        } else if (jarvisState === "listening") {
          color = `rgba(168, 85, 247, ${0.4 + (h / 24)})`;
        } else if (jarvisState === "thinking") {
          color = `rgba(236, 72, 153, ${0.3 + (h / 8)})`;
        } else if (jarvisState === "idle") {
          color = "rgba(6, 182, 212, 0.25)";
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [jarvisState]);

  // Load chat history & referral detection & check session-once intro
  useEffect(() => {
    const history = sessionStorage.getItem("jarvis_chat_history");
    if (history) {
      setMessages(JSON.parse(history));
    }

    const savedMute = sessionStorage.getItem("jarvis_muted");
    if (savedMute !== null) {
      setIsMuted(savedMute === "true");
    }

    const handleMuteToggle = (e: Event) => {
      setIsMuted((e as CustomEvent).detail);
    };
    window.addEventListener("jarvis-mute-toggle", handleMuteToggle);

    // Global Speech Controls Triggered Externally
    const handleGlobalToggle = () => handlePlayPause();
    const handleGlobalStop = () => handleStop();

    window.addEventListener("jarvis-speech-toggle", handleGlobalToggle);
    window.addEventListener("jarvis-speech-stop", handleGlobalStop);

    let referralText = "direct link";
    if (typeof document !== "undefined") {
      const ref = document.referrer.toLowerCase();
      if (ref.includes("linkedin")) referralText = "LinkedIn";
      else if (ref.includes("github")) referralText = "GitHub";
    }
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      referralText = `${referralText} (Mobile)`;
    }

    setAgentThought(`Systems standby. Click the robot avatar to boot receptionist tour, or click the Mic button to talk.`);
    logAction(`Standby referral detected: ${referralText}`);

    // Auto-Greeting setup on click gesture to respect browser autoplays
    const firstGesture = () => {
      const hasIntroduced = sessionStorage.getItem("jarvis_introduced_once");
      if (!hasIntroduced) {
        sessionStorage.setItem("jarvis_introduced_once", "true");
        setIsMuted(false);
        playBeep("boot");
        
        // Start tour boot sequencing
        handleAvatarClickRef.current?.();
      }
      document.removeEventListener("click", firstGesture);
    };
    document.addEventListener("click", firstGesture);

    return () => {
      window.removeEventListener("jarvis-mute-toggle", handleMuteToggle);
      window.removeEventListener("jarvis-speech-toggle", handleGlobalToggle);
      window.removeEventListener("jarvis-speech-stop", handleGlobalStop);
    };
  }, []);

  // Sync state back to other listeners whenever isMuted transitions
  useEffect(() => {
    sessionStorage.setItem("jarvis_muted", String(isMuted));
    window.dispatchEvent(new CustomEvent("jarvis-mute-updated", { detail: isMuted }));
  }, [isMuted]);

  // Scroll chat messages to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listeners refs to avoid stale closures in event handlers
  const handleAvatarClickRef = useRef<() => void>();
  const handleProjectExplainRef = useRef<(e: Event) => void>();
  const handleBehaviorRef = useRef<(e: Event) => void>();

  // Assign latest state/methods to refs on every render
  handleAvatarClickRef.current = () => {
    if (speechState === "speaking") {
      handlePlayPause();
      return;
    }
    if (speechState === "paused") {
      handlePlayPause();
      return;
    }

    setIsMuted(false);
    setTourStep(0);
    setAgentStatus("PLANNING");
    setAgentThought("Initializing system boot protocols. Loading core metrics.");
    logAction("System Boot initiated");
    playBeep("boot");

    const bootLogs = [
      "Initializing JARVIS v2.1 Core Interface...",
      "⚡ Voice Engine: ONLINE",
      "🧠 Dialogue Memory Registers: LOADED",
      "📂 Portfolio Knowledge Indexes: LOADED",
      "🚀 Navigation Systems: STANDBY",
      "🤖 AI Receptionist Co-pilot: ACTIVE"
    ];

    let logIndex = 0;
    const printLog = () => {
      if (logIndex < bootLogs.length) {
        logAction(bootLogs[logIndex]);
        setAgentThought(`Booting: ${bootLogs[logIndex]}`);
        logIndex++;
        setTimeout(printLog, 220);
      } else {
        startSpokenIntro();
      }
    };

    printLog();
  };

  const startSpokenIntro = () => {
    setAgentStatus("GUIDING TOUR");
    setAgentThought("Guiding visitor. Playing introduction speech sequence.");
    
    const phrases = [
      "Hello.",
      "Welcome to Harshit Gupta's portfolio.",
      "I am JARVIS.",
      "Harshit's autonomous AI assistant.",
      "I can explain his projects.",
      "Show his skills.",
      "Open his resume.",
      "And answer any questions you have.",
      "Let me take you on a quick tour of his work."
    ];

    speakSequential(phrases, () => {
      runTourStep1();
    });
  };

  handleProjectExplainRef.current = (e: Event) => {
    const project = (e as CustomEvent).detail;
    setAgentStatus("EXECUTING");
    setAgentThought(`Explaining project node: ${project.name}. Reading stack metrics.`);
    logAction(`Opened file ${project.name}`);

    const explanationText = `Loaded details for project ${project.name}. It is built with ${project.stack[0]}. Let me explain. ${project.tagline}`;
    speak(explanationText);
  };

  handleBehaviorRef.current = (e: Event) => {
    const sectionId = (e as CustomEvent).detail;
    setAgentThought(`Visitor scrolled to [${sectionId}]. Auditing recruiter interest...`);
    logAction(`Viewed section: ${sectionId}`);

    let proactiveText = "";
    if (sectionId === "skills") {
      proactiveText = "I see you are inspecting Harshit's skills database. He has stable proficiency in TypeScript, C++, React, and AI-agent integrations.";
    } else if (sectionId === "education") {
      proactiveText = "Harshit is currently studying Computer Science & Engineering at UIET Chandigarh.";
    } else if (sectionId === "experience") {
      proactiveText = "Exploring experience timeline. Harshit has shipped projects like WomenHealthCare and WanderLust.";
    }

    if (proactiveText && tourStep === -1 && speechState === "idle") { 
      speak(proactiveText);
    }
  };

  // Mount stable event listeners delegating to refs
  useEffect(() => {
    const avatarListener = () => handleAvatarClickRef.current?.();
    const projectListener = (e: Event) => handleProjectExplainRef.current?.(e);
    const behaviorListener = (e: Event) => handleBehaviorRef.current?.(e);

    window.addEventListener("jarvis-avatar-click", avatarListener);
    window.addEventListener("jarvis-explain-project", projectListener);
    window.addEventListener("jarvis-behavior-tracked", behaviorListener);

    return () => {
      window.removeEventListener("jarvis-avatar-click", avatarListener);
      window.removeEventListener("jarvis-explain-project", projectListener);
      window.removeEventListener("jarvis-behavior-tracked", behaviorListener);
    };
  }, [speechState]);

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
          playBeep("click");
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
          logAction(`Voice query: ${transcript}`);
          handleSendMessage(transcript);
        };

        recognitionRef.current = rec;
      }
    }
  }, [messages, hiringStep, hiringData, tourStep]);

  const speakSequential = (phrases: string[], onDone: () => void) => {
    let idx = 0;
    const speakNext = () => {
      if (tourStep === -1 && speechStateRef.current === "idle") return;

      if (idx >= phrases.length) {
        setSpeechState("idle");
        setAgentThought("Systems online. Standing by.");
        onDone();
        return;
      }
      setAgentThought(`🎙️ "${phrases[idx]}"`);
      setLastSpokenText(phrases[idx]);
      
      if (!isMuted && typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrases[idx]);
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) =>
            v.name.includes("Male") ||
            v.name.includes("Google UK English Male") ||
            v.name.includes("David")
        );
        if (preferred) utterance.voice = preferred;
        utterance.rate = 1.02;
        utterance.pitch = 0.95;
        
        utterance.onstart = () => {
          setSpeechState("speaking");
        };

        utterance.onend = () => {
          if (speechStateRef.current === "paused") return; 
          idx++;
          setTimeout(speakNext, 300);
        };
        utterance.onerror = () => {
          idx++;
          setTimeout(speakNext, 300);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => {
          idx++;
          speakNext();
        }, 2200);
      }
    };
    speakNext();
  };

  // Text-To-Speech (TTS)
  const speak = (text: string, onEndCallback?: () => void) => {
    setLastSpokenText(text);
    setAgentThought(`🎙️ "${text}"`);
    
    if (isMuted) {
      setSpeechState("idle");
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

      utterance.onstart = () => {
        setSpeechState("speaking");
      };

      utterance.onend = () => {
        setSpeechState("idle");
        setAgentThought("Systems online. Standing by.");
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        setSpeechState("idle");
        setAgentThought("Systems online. Standing by.");
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setSpeechState("idle");
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
      document.getElementById("academic-credentials")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_EXPERIENCE")) {
      document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("SCROLL_TO_CONTACT")) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else if (actionStr.includes("TOGGLE_THEME")) {
      toggleTheme();
    } else if (actionStr.includes("VIEW_RESUME")) {
      window.open("/resume.pdf", "_blank");
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

  const startPortfolioTour = (welcomeOverride = "") => {
    setTourStep(0);
    setAgentStatus("GUIDING TOUR");
    setAgentThought("Guiding recruiter through portfolio. Executing Intro script.");
    logAction("Auto-Tour started");
    playBeep("boot");
    
    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "current" },
      { label: "Audit Recruiter Interest", status: "pending" },
      { label: "Deliver System Credentials", status: "pending" },
    ]);

    const introSpeech = welcomeOverride || `Hello, and welcome to Harshit Gupta's portfolio. I'm JARVIS, Harshit's autonomous AI assistant. I'm here to guide you through his work and answer any questions you may have. Harshit is a second-year Computer Science Engineering student at UIET Chandigarh with a strong passion for Full Stack Development, Artificial Intelligence, and solving real-world problems. Let's begin the tour.`;

    speak(introSpeech, () => {
      tourTimeoutRef.current = setTimeout(() => runTourStep1(), 1200);
    });
  };

  const runTourStep1 = () => {
    setTourStep(1);
    setAgentThought("Tour Step 1: Navigating to About section. Presenting philosophy.");
    executeClientAction("SCROLL_TO_ABOUT");

    const text = "First, let's explore Harshit's engineering philosophy. He believes in a builder mindset, learning concepts by shipping real code. He is a full-stack native, handling database modeling, server middleware, and responsive client layouts.";

    speak(text, () => {
      tourTimeoutRef.current = setTimeout(() => runTourStep2(), 1200);
    });
  };

  const runTourStep2 = () => {
    setTourStep(2);
    setAgentThought("Tour Step 2: Navigating to Skills matrix. Presenting capabilities.");
    executeClientAction("SCROLL_TO_SKILLS");

    const text = "Here is Harshit's technical toolkit. It is structured by domain and system layer, spanning languages like C++ and TypeScript, frontend tools like Next.js and Tailwind, backend framework Node, databases PostgreSQL and MongoDB, and AI prompt engineering.";

    speak(text, () => {
      tourTimeoutRef.current = setTimeout(() => runTourStep3(), 1200);
    });
  };

  const runTourStep3 = () => {
    setTourStep(3);
    setAgentThought("Tour Step 3: Navigating to Projects catalog. Auto-selecting WomenHealthCare.");
    executeClientAction("SCROLL_TO_PROJECTS");
    window.dispatchEvent(new CustomEvent("jarvis-filter", { detail: "All" }));

    const text = "Next, let's look at his projects. He has shipped platforms like WomenHealthCare, a full-stack digital wellness hub with ovulation forecasts and Gemini AI consultations, and FixIQ, a browser-only AI diagnostic tool.";

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

    const text = "That concludes the autonomous overview. I have unlocked the quick commands panel below. You can ask me questions about his projects, view his resume directly, or click Contact Harshit to schedule an interview.";

    speak(text, () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech recognition already running", e);
        }
      }
    });
    
    setTourStep(-1);
    setAgentStatus("READY");
  };

  const skipTour = () => {
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setTourStep(-1);
    setSpeechState("idle");
    setAgentStatus("READY");
    setAgentThought("Autonomic tour skipped by visitor. standing by.");
    logAction("Auto-Tour skipped");
    playBeep("alert");
    
    setPlanChecklist([
      { label: "Initialize Interface Logs", status: "done" },
      { label: "Detect Referral Source", status: "done" },
      { label: "Conduct Autonomic Tour", status: "done" },
      { label: "Audit Recruiter Interest", status: "current" },
      { label: "Deliver System Credentials", status: "pending" },
    ]);

    const msg = "Tour skipped. System ready. Ask me any question or click the mic to speak.";
    speak(msg);
  };

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
    speak(text);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    playBeep("click");

    const updatedMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(updatedMessages);
    sessionStorage.setItem("jarvis_chat_history", JSON.stringify(updatedMessages));
    setInputValue("");

    if (trimmed.toLowerCase().includes("start tour") || trimmed.toLowerCase().includes("play tour")) {
      startPortfolioTour();
      return;
    }

    const lowerText = trimmed.toLowerCase();

    if (lowerText.includes("hire") || lowerText.includes("contact har")) {
      if (hiringStep === 0) {
        startHiringWizard();
        return;
      }
    }

    if (hiringStep > 0) {
      setAgentStatus("PLANNING");
      if (hiringStep === 1) {
        setHiringData((d) => ({ ...d, name: trimmed }));
        setHiringStep(2);
        const reply = `Got it, ${trimmed}. Step 2: What is the name of your organization/company?`;
        speak(reply);
      } else if (hiringStep === 2) {
        setHiringData((d) => ({ ...d, company: trimmed }));
        setHiringStep(3);
        const reply = "Understood. Step 3: What is the best email address to contact you?";
        speak(reply);
      } else if (hiringStep === 3) {
        setHiringData((d) => ({ ...d, email: trimmed }));
        setHiringStep(4);
        const reply = "Perfect. Step 4: Could you write a short description of the project or role requirements?";
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
            const successReply = "Uplink successful! I have stored your enquiry in Harshit's database and opened his resume PDF for your reference. He will get back to you shortly.";
            speak(successReply);
            executeClientAction("VIEW_RESUME");
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
          const fallbackReply = "Database submission currently offline. Opening local mail composer with details, and loading Harshit's resume PDF.";
          speak(fallbackReply);
          executeClientAction("VIEW_RESUME");
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

    setLoading(true);
    setAgentStatus("THINKING");
    setAgentThought(`Reasoning over query: "${trimmed}"...`);
    setStatusText("Thinking...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorReply = data.error ?? "Something went wrong.";
        speak(errorReply);
        setStatusText("Online");
        setAgentStatus("READY");
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
        setAgentStatus("READY");

        if (matches) {
          setAgentStatus("EXECUTING");
          matches.forEach((act: string) => executeClientAction(act));
          setAgentStatus("READY");
        }
      }
    } catch (err) {
      speak("Apologies, I encountered an uplink error. Try again.");
      setStatusText("Online");
      setAgentStatus("READY");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    playBeep("click");

    if (speechState === "speaking") {
      window.speechSynthesis.pause();
      setSpeechState("paused");
      logAction("Speech playback paused");
    } else if (speechState === "paused") {
      window.speechSynthesis.resume();
      setSpeechState("speaking");
      logAction("Speech playback resumed");
    } else {
      if (lastSpokenText) {
        speak(lastSpokenText);
      } else {
        startPortfolioTour();
      }
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    playBeep("alert");
    window.speechSynthesis.cancel();
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    
    setTourStep(-1);
    setSpeechState("idle");
    setAgentStatus("READY");
    setAgentThought("Awaiting visitor activity. Systems fully optimized.");
    logAction("Speech playback stopped");
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice control is not fully supported on this browser. Try Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsMuted(false); 
      recognitionRef.current.start();
    }
  };

  const clearLogs = () => {
    playBeep("click");
    setMessages([{ role: "assistant", content: "👋 Chat registers cleared. Standing by." }]);
    sessionStorage.removeItem("jarvis_chat_history");
    setActionLogs([
      { time: "00:00", action: "Cognitive log registers cleared" }
    ]);
    setAgentThought("Systems optimized. Standby mode.");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. JARVIS CONSOLE BOX */}
      <div className="flex flex-col bg-slate-955 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-lg relative overflow-hidden group hover:border-cyan-500/25 transition-all duration-300">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-400" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none opacity-40" />

        {/* Console Header */}
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4 select-none">
          <div>
            <h3 className="font-orbitron font-bold text-text uppercase tracking-widest text-[11px] glow-cyan">
              JARVIS CONSOLE
            </h3>
            <span className="font-mono text-[8px] text-slate-500 tracking-wider block mt-0.5">
              VOICE & DIALOGUE INTERFACE
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              onMouseEnter={() => playBeep("hover")}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                speechState === "speaking"
                  ? "text-amber-400 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                  : speechState === "paused"
                    ? "text-cyan-400 border-cyan-500/25 bg-cyan-500/10 animate-pulse"
                    : "text-muted border-line hover:text-text hover:bg-white/5"
              }`}
              title={speechState === "speaking" ? "Pause Voice" : "Resume / Play"}
            >
              {speechState === "speaking" ? <Pause size={10} /> : <Play size={10} />}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              onMouseEnter={() => playBeep("hover")}
              className="p-1.5 rounded-lg border border-line text-muted hover:text-rose-400 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all cursor-pointer flex items-center justify-center"
              title="Stop speech & tour"
            >
              <Square size={10} />
            </button>

            <div className="h-4 w-[1px] bg-line mx-0.5" />

            {/* Mute toggle button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              onMouseEnter={() => playBeep("hover")}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                isMuted 
                  ? "text-muted border-line hover:text-text hover:bg-white/5" 
                  : "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:text-cyan-300 hover:bg-cyan-500/10"
              }`}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
            </button>

            {/* Clear history logs */}
            <button
              onClick={clearLogs}
              onMouseEnter={() => playBeep("hover")}
              className="p-1.5 rounded-lg border border-line text-muted hover:text-text hover:bg-white/5 cursor-pointer"
              title="Clear HUD Logs"
            >
              <RefreshCw size={10} />
            </button>
          </div>
        </div>

        {/* Dialogue Scroll Window */}
        <div className="h-44 overflow-y-auto custom-scroll pr-1.5 space-y-3 font-mono text-[10px] mb-4 border border-line/45 rounded-xl p-3 bg-slate-950/65 flex flex-col justify-start">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-[85%] rounded-lg p-2.5 border text-left ${
                msg.role === "user"
                  ? "self-end bg-cyan-500/5 border-cyan-500/10 text-cyan-200"
                  : "self-start bg-purple-500/5 border-purple-500/10 text-purple-200"
              }`}
            >
              <span className={`text-[8px] font-bold uppercase tracking-wider mb-1 block ${msg.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}>
                {msg.role === 'user' ? 'User' : 'Jarvis'}
              </span>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="self-start bg-purple-500/5 border border-purple-500/10 rounded-lg p-2.5 max-w-[85%] text-left">
              <span className="text-[8px] font-bold text-purple-400 uppercase tracking-wider mb-1 block">Jarvis</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-400 animate-pulse">Scanning knowledge registry...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Action Commands Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-4 select-none">
          <button
            onClick={() => startPortfolioTour()}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Start Tour</span>
            <span className="text-[8px] opacity-40">→</span>
          </button>
          
          <button
            onClick={() => executeClientAction("FILTER_AI")}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Filter AI</span>
            <span className="text-[8px] opacity-40">AI</span>
          </button>

          <button
            onClick={() => executeClientAction("FILTER_FULLSTACK")}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Filter Full Stack</span>
            <span className="text-[8px] opacity-40">FS</span>
          </button>

          <button
            onClick={() => executeClientAction("VIEW_RESUME")}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Download Resume</span>
            <span className="text-[8px] opacity-40">PDF</span>
          </button>

          <button
            onClick={() => startHiringWizard()}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Contact Harshit</span>
            <span className="text-[8px] opacity-40">MAIL</span>
          </button>

          <button
            onClick={() => toggleTheme()}
            onMouseEnter={() => playBeep("hover")}
            className="p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>Toggle Theme</span>
            <span className="text-[8px] opacity-40">MODE</span>
          </button>

          <button
            onClick={() => executeClientAction("SCROLL_TO_ABOUT")}
            onMouseEnter={() => playBeep("hover")}
            className="col-span-2 p-2 py-1.5 border border-line bg-surface/20 hover:border-cyan-500/40 rounded-xl font-mono text-[9px] font-bold text-muted hover:text-cyan-400 hover:bg-cyan-500/5 uppercase tracking-wide transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <span>About Me</span>
            <span className="text-[8px] opacity-40">INFO</span>
          </button>
        </div>

        {/* Holographic soundwave canvas and microphone button */}
        <div className="flex items-center justify-between gap-4 border border-line/45 rounded-xl p-3 bg-slate-900/55 select-none relative mb-4">
          <canvas ref={canvasRef} className="flex-1 h-9 opacity-85 pointer-events-none" />

          {/* Micro Button overlay */}
          <button
            onClick={toggleListening}
            onMouseEnter={() => playBeep("hover")}
            className={`h-9 w-9 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer relative z-10 ${
              isListening
                ? "bg-purple-500 border-purple-400 text-white shadow-[0_0_12px_#a855f7]"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
            }`}
            title={isListening ? "Stop Voice Uplink" : "Open Voice Uplink"}
          >
            {isListening ? <Mic size={14} className="animate-pulse" /> : <Mic size={14} />}
          </button>

          {/* Status Tag */}
          <span className="absolute bottom-1 right-2 font-mono text-[7px] text-slate-500 flex items-center gap-1">
            <span className={`h-1 w-1 rounded-full ${isListening ? 'bg-purple-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            {isListening ? 'LISTENING' : 'ONLINE'}
          </span>
        </div>

        {/* Send message text box */}
        <div className="flex items-center border border-line bg-slate-950/70 rounded-xl px-3 py-1 text-slate-300 group-hover:border-cyan-500/15 focus-within:border-cyan-500/35 transition-colors">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none py-2 text-[10px] font-mono text-text outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            onMouseEnter={() => playBeep("hover")}
            className="p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <Send size={12} />
          </button>
        </div>
      </div>

      {/* 2. CURRENT STATUS BOX */}
      <div className="flex items-center justify-between bg-slate-955 border border-line rounded-2xl p-5 shadow-2xl backdrop-blur-lg relative overflow-hidden group hover:border-cyan-500/25 transition-all duration-300">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-cyan-400" />

        <div className="space-y-3 font-mono text-[9px] text-muted">
          <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-line pb-1.5">
            // Current Status
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin size={11} className="text-cyan-400" />
            <div>
              <span className="text-[8px] text-slate-500 block uppercase">Location</span>
              <span className="text-text font-bold uppercase">Chandigarh, India</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={11} className="text-purple-400" />
            <div>
              <span className="text-[8px] text-slate-500 block uppercase">Availability</span>
              <span className="text-emerald-400 font-bold uppercase animate-pulse">Open to Opportunities</span>
            </div>
          </div>
        </div>

        {/* Dedicated percentage radial circle */}
        <div className="flex flex-col items-center justify-center relative select-none">
          <svg className="w-16 h-16 transform -rotate-90">
            {/* Outer track */}
            <circle
              cx="32"
              cy="32"
              r="24"
              className="stroke-slate-800"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Neon purple dynamic track */}
            <circle
              cx="32"
              cy="32"
              r="24"
              className="stroke-cyan-500 shadow-glow-cyan"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* Inner track */}
            <circle
              cx="32"
              cy="32"
              r="18"
              className="stroke-purple-500/20"
              strokeWidth="1.5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="18"
              className="stroke-purple-500"
              strokeWidth="1.5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={2 * Math.PI * 18 * 0.15}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
            <span className="text-[9px] font-black text-text leading-none tracking-tighter">100%</span>
            <span className="text-[5px] text-slate-500 font-semibold tracking-tighter scale-90 uppercase">Dedicated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
