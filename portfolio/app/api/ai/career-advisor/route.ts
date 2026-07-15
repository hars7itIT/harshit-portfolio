import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const { targetRole, currentSkills } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a world-class technology career coach and engineering lead.
Formulate a personalized learning roadmap for a student targeting the role: "${targetRole}".
Their current skills are: "${currentSkills || "Basic programming concepts"}".

Provide the roadmap in JSON format containing:
1. "careerOutlook": A sentence summarizing current demand and salary trend.
2. "roadmap": An array of milestones. Each milestone must have:
   - "phase": e.g., "Phase 1: Foundations", "Phase 2: Advanced Backend"
   - "topics": Array of key concepts/skills to study
   - "timeEstimate": e.g. "4 weeks", "2 months"
3. "recommendedProjects": An array of project suggestions to build (with stack and description).
4. "learningResources": An array of top-tier learning resources (courses, documentation, books).

Return ONLY raw JSON, with no markdown code blocks or wrapping. Example:
{
  "careerOutlook": "High demand with active hiring across AI tech stacks.",
  "roadmap": [
    {
      "phase": "Phase 1: core concepts",
      "topics": ["React Hooks", "Next.js routing"],
      "timeEstimate": "3 weeks"
    }
  ],
  "recommendedProjects": [
    {
      "name": "Custom Agentic Chatbot",
      "stack": "Next.js, Langchain, pgvector",
      "desc": "Build a chatbot that queries custom docs."
    }
  ],
  "learningResources": [
    "Next.js documentation (nextjs.org/docs)"
  ]
}`;

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith("```json")) {
      text = text.substring(7);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    const analysis = JSON.parse(text);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Career Advisor API error:", err);
    return NextResponse.json(
      { error: "Failed to generate roadmap. Please check parameters and try again." },
      { status: 500 }
    );
  }
}
