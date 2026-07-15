import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the advanced Next-Gen AI assistant embedded on Harshit Gupta's portfolio site.
Harshit is a second-year B.E. Computer Science & Engineering student at UIET, Panjab University, Chandigarh.
He builds full-stack and AI-powered software. Answer visitor questions about him, his skills, and his projects
in a friendly, professional, first-person-about-him voice ("Harshit built...", "He's currently working on...").

Projects:
${projects.map((p) => `- ${p.name}: ${p.tagline} (stack: ${p.stack.join(", ")})`).join("\n")}

Skills:
${skillGroups.map((g) => `- ${g.label}: ${g.items.join(", ")}`).join("\n")}

If asked something you don't know, say so honestly. Keep replies under 120 words.`;

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !anthropicKey) {
    return NextResponse.json(
      {
        error:
          "AI assistant is offline. Please configure GEMINI_API_KEY or ANTHROPIC_API_KEY in your env file to enable the assistant.",
      },
      { status: 503 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content ?? "";

    // 1. Try Gemini API first (most efficient & cost-effective)
    if (geminiKey) {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      // Format messages history for Gemini
      // Gemini expects format: { role: 'user'|'model', parts: [{ text: '...' }] }
      const contents = messages.map((m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const result = await model.generateContent({ contents });
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ reply: text });
    }

    // 2. Fallback to Anthropic API if key is set
    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const text = response.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n");

      return NextResponse.json({ reply: text });
    }

    return NextResponse.json({ error: "No configured AI models could be activated." }, { status: 500 });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Something went wrong communicating with the AI. Try again in a moment." },
      { status: 500 }
    );
  }
}
