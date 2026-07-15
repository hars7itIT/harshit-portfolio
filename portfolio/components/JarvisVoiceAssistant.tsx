"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface JarvisVoiceAssistantProps {
  avatarSrc: string;
  name: string;
}

export default function JarvisVoiceAssistant({ avatarSrc, name }: JarvisVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US"; // English default, captures Hindi/English commands

        rec.onstart = () => {
          setIsListening(true);
          setFeedbackText("LISTENING...");
          speak("Cognitive systems listening. Speak command.");
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
          setFeedbackText("ERROR IN RECOGNITION");
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setSpeechText(transcript);
          handleVoiceCommand(transcript);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Text to Speech
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to select a nice male/deep voice if available (Jarvis-like)
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

  // Scroll logic
  const scrollToSection = (id: string, response: string) => {
    const el = document.getElementById(id);
    if (el) {
      setFeedbackText(`NAVIGATING TO: ${id.toUpperCase()}`);
      speak(response);
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      setFeedbackText(`SECTION ${id.toUpperCase()} NOT FOUND`);
      speak(`Section ${id} cannot be initialized. Map offline.`);
    }
  };

  // Command Router
  const handleVoiceCommand = (command: string) => {
    console.log("Captured Voice Command:", command);

    if (command.includes("project") || command.includes("projects") || command.includes("work")) {
      scrollToSection("projects", "Affirmative. Routing to project registry explorer.");
      return;
    }

    if (command.includes("about") || command.includes("intro") || command.includes("who are you")) {
      scrollToSection("about", "Affirmative. Loading bio profile records.");
      return;
    }

    if (command.includes("skill") || command.includes("skills") || command.includes("special")) {
      scrollToSection("skills", "Synchronizing technical skill grids.");
      return;
    }

    if (command.includes("contact") || command.includes("email") || command.includes("message")) {
      scrollToSection("contact", "Opening secure messaging interface.");
      return;
    }

    if (command.includes("education") || command.includes("college") || command.includes("study")) {
      scrollToSection("education", "Accessing academic history database.");
      return;
    }

    if (command.includes("experience") || command.includes("timeline") || command.includes("history")) {
      scrollToSection("experience", "Loading timeline parameters.");
      return;
    }

    if (command.includes("achievement") || command.includes("achievements") || command.includes("certificate")) {
      scrollToSection("achievements", "Opening achievements data nodes.");
      return;
    }

    if (command.includes("ai tool") || command.includes("ai tools") || command.includes("tools")) {
      setFeedbackText("LAUNCHING AI PLAYGROUND");
      speak("Initializing AI Playground tools.");
      window.location.href = "/ai";
      return;
    }

    // Default Jarvis Fallback
    setFeedbackText("COMMAND NOT RECOGNIZED");
    speak("Command unrecognized. Please restate query.");
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Listening Status Bar */}
      {feedbackText && (
        <div className="font-mono text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
          {feedbackText}
        </div>
      )}

      {/* Main Avatar Interactive Container */}
      <button
        onClick={toggleListening}
        className="relative group focus:outline-none cursor-pointer"
        aria-label="Activate JARVIS speech control"
      >
        {/* Glowing aura rings depending on active listening state */}
        <div
          className={`absolute -inset-1 rounded-full blur transition-all duration-500 ${
            isListening
              ? "bg-cyan-500 opacity-75 animate-ping"
              : "bg-cyan-500/20 opacity-40 group-hover:opacity-75"
          }`}
        />

        {/* Concentric spinning rings */}
        <div
          className={`absolute -inset-2 rounded-full border border-dashed animate-spin ${
            isListening ? "border-cyan-400" : "border-cyan-500/20 group-hover:border-cyan-500/50"
          }`}
          style={{ animationDuration: "16s" }}
        />
        <div
          className={`absolute -inset-3 rounded-full border border-dashed animate-spin ${
            isListening ? "border-purple-400" : "border-purple-500/10 group-hover:border-purple-500/40"
          }`}
          style={{ animationDuration: "8s", animationDirection: "reverse" }}
        />

        {/* Avatar Image Frame */}
        <div
          className={`relative h-20 w-20 rounded-full border-2 overflow-hidden flex items-center justify-center bg-slate-950/80 transition-colors ${
            isListening ? "border-cyan-400" : "border-cyan-500/30 group-hover:border-cyan-400/80"
          }`}
        >
          <img
            src={avatarSrc}
            alt={name}
            className={`h-full w-full object-cover transition-all ${
              isListening ? "grayscale-0 scale-105" : "grayscale brightness-90 contrast-125 hover:grayscale-0 hover:scale-105"
            }`}
          />
          
          {/* Micro overlay icons */}
          {isListening ? (
            <div className="absolute inset-0 bg-cyan-950/20 flex items-center justify-center">
              <Mic size={20} className="text-cyan-400 animate-pulse" />
            </div>
          ) : (
            <div className="absolute bottom-1 right-1 bg-slate-950 border border-white/10 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Volume2 size={10} className="text-cyan-400" />
            </div>
          )}
        </div>
      </button>

      {/* Captured Speech Text Overlay */}
      {speechText && (
        <span className="font-mono text-[9px] text-slate-500 italic max-w-[200px] text-center truncate">
          &quot;{speechText}&quot;
        </span>
      )}
    </div>
  );
}
