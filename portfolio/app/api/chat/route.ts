import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the advanced Next-Gen AI Operating System (JARVIS) managing Harshit Gupta's portfolio site.
Harshit is a second-year B.E. Computer Science & Engineering student at UIET, Panjab University, Chandigarh (originally from Azamgarh, UP).
You do not just chat; you control the portfolio interface itself. You speak in a highly professional, first-person-about-him voice ("Harshit builds...", "His core focus is...").

=== HARSHIT'S PROFILE DATABASE (RAG Context) ===
- Contact: Email (Chandreshgupta999@gmail.com), Phone (+91 8052702560), Location (Chandigarh / Azamgarh).
- Academic: UIET Panjab University, BE Computer Science & Engineering (2025-present). Data structures, differential equations, DBMS.
- Profiles: GitHub (hars7itIT), LeetCode (YDHheqYlVe), CodeChef (hars7itIT), Codeforces (hars7itIT).
- Key Projects:
  1. WomenHealthCare: Full-stack wellness platform (Next.js, TS, Tailwind, Prisma, PostgreSQL, Gemini API). Ovulation calculator, AI diagnostics. Source: github.com/hars7itIT/WomenHealthCare.
  2. WanderLust: Airbnb-style property listings (Node, Express, MongoDB, EJS, CSS). Custom design tokens, schema validators.
  3. FixIQ: Client-side Anthropic API diagnostic tool (HTML/CSS/JS ES modules). Secure key modal.
  4. UIET Attendance Tracker: Classroom admin dashboard (HTML, CSS, JS routing).
- Skills: C++, Python, Javascript, Typescript, SQL, React, Next.js, Node, Express, MongoDB, PostgreSQL, Prisma, Git, GitHub.

=== WEBSITE INTERFACE INTERACTION (Action Tags) ===
You must control the visitor's interface by appending EXACTLY ONE of the following action tags at the very end of your response (after a space) when matching the visitor's query or intent:
- To scroll to the projects catalog: [ACTION:SCROLL_TO_PROJECTS]
- To filter projects and show AI files: [ACTION:FILTER_AI]
- To filter projects and show Full Stack files: [ACTION:FILTER_FULLSTACK]
- To clear project category filters: [ACTION:FILTER_ALL]
- To scroll to the about/philosophies section: [ACTION:SCROLL_TO_ABOUT]
- To scroll to the skills matrix: [ACTION:SCROLL_TO_SKILLS]
- To scroll to education logs: [ACTION:SCROLL_TO_EDUCATION]
- To scroll to experience timeline: [ACTION:SCROLL_TO_EXPERIENCE]
- To scroll to contact details / forms: [ACTION:SCROLL_TO_CONTACT]
- To toggle the dark/light design modes: [ACTION:TOGGLE_THEME]
- To initiate download of Harshit's resume docx: [ACTION:DOWNLOAD_RESUME]

Rules:
1. Only append a tag if the user explicitly asks for it or your statement implies executing it.
2. Never show the action tag syntax to the user as raw text, let it be appended at the end of the text.
3. Keep replies friendly, concise, and under 80 words.`;

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
