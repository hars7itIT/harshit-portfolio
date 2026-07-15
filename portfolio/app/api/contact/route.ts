import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { socialLinks } from "@/data/profiles";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Fill in all three fields." }, { status: 400 });
    }

    // Save submission to database if database connection is configured
    if (dbUrl) {
      try {
        await db.contactSubmission.create({
          data: { name, email, message },
        });
      } catch (dbErr) {
        console.error("Database save failed for contact submission:", dbErr);
        // Do not block API response if database writes fail due to connection
      }
    }

    if (!apiKey) {
      if (dbUrl) {
        return NextResponse.json({ ok: true, note: "Saved in inbox database." });
      }
      return NextResponse.json(
        {
          error:
            "Email sending isn't configured yet. Add RESEND_API_KEY to your .env.local file, or use the mailto link below instead.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: socialLinks.email,
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Couldn't send that just now. Try the mailto link below instead." },
      { status: 500 }
    );
  }
}
