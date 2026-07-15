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
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume text and job description are required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
Analyze the following resume text against the target job description.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Provide an objective feedback payload in JSON format containing:
1. "atsScore": a number from 0 to 100 representing how well the resume matches the job description.
2. "matchedKeywords": an array of matching skills/technologies.
3. "missingKeywords": an array of key skills/technologies found in the job description but missing in the resume.
4. "suggestions": an array of clear, actionable recommendations (e.g. rewrite projects, add specific metrics, highlight tools).
5. "summary": a brief paragraph summarizing the resume's alignment with this job role.

Return ONLY raw JSON, with no markdown code blocks or wrapping. Example:
{
  "atsScore": 75,
  "matchedKeywords": ["React", "TypeScript"],
  "missingKeywords": ["Docker", "PostgreSQL"],
  "suggestions": ["Add metrics showing speedups", "List SQL experience"],
  "summary": "The candidate has strong front-end alignment but lacks backing backend skills."
}`;

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const response = await result.response;
    let text = response.text().trim();

    // Clean up markdown block wraps if they exist
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
    console.error("Resume Analyzer API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze resume. Please verify the input format and try again." },
      { status: 500 }
    );
  }
}
