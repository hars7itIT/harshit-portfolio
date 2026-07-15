"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey — ask me anything about Harshit's projects, skills, or background." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error ?? "Something went wrong." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error — try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-md border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="font-mono text-xs text-signal">ai-assistant.chat</span>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-muted hover:text-signal">
              <X size={16} />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block max-w-[85%] rounded px-3 py-2 text-xs ${
                    m.role === "user"
                      ? "bg-signal/15 text-text"
                      : "bg-surface2 text-muted"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <p className="font-mono text-xs text-muted">thinking…</p>}
          </div>
          <div className="flex items-center gap-2 border-t border-line p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about a project…"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-text outline-none placeholder:text-muted"
            />
            <button
              aria-label="Send"
              onClick={send}
              disabled={loading}
              className="rounded border border-line p-1.5 text-signal hover:border-signal disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        aria-label="Open AI assistant"
        onClick={() => {
          console.log("Chat button clicked! Current state:", open);
          setOpen((v) => !v);
        }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-signal bg-ink text-signal shadow-lg hover:bg-signal hover:text-ink transition-colors cursor-pointer"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
      </button>
    </div>
  );
}
