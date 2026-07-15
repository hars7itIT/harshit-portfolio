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
    const { history, targetRole, stage } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";

    if (stage === "eval") {
      prompt = `You are a Principal Software Engineer conducting a mock technical interview for a "${targetRole}" candidate.
Review the interview logs below:

${history.map((h: { role: string; content: string }) => `${h.role === "assistant" ? "Interviewer" : "Candidate"}: ${h.content}`).join("\n")}

Provide an evaluation in JSON format containing:
1. "score": A final percentage score (0-100).
2. "strengths": An array of concepts the candidate explained well.
3. "weaknesses": An array of areas where the candidate was weak or incorrect.
4. "modelAnswers": An array of correct/better descriptions for the questions asked.
5. "summary": A concluding performance review.

Return ONLY raw JSON, with no markdown code blocks or wrapping.`;
    } else {
      prompt = `You are a senior engineering manager conducting an interactive technical interview for a "${targetRole}" position.
This is Question ${stage} of the interview. 

Here is the conversation history:
${history.map((h: { role: string; content: string }) => `${h.role === "assistant" ? "Interviewer" : "Candidate"}: ${h.content}`).join("\n")}

Ask a direct, technical, interview question tailored to the role. Keep it challenging. 
Return the response as a single question string, ready to display.`;
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const response = await result.response;
    let text = response.text().trim();

    if (stage === "eval") {
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();
      const evaluation = JSON.parse(text);
      return NextResponse.json({ evaluation });
    } else {
      return NextResponse.json({ question: text });
    }
  } catch (err) {
    console.error("Interview Simulator API error:", err);
    return NextResponse.json(
      { error: "Failed to simulate interview step. Please try again." },
      { status: 500 }
    );
  }
}
