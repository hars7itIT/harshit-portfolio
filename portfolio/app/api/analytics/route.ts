import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;

  // Graceful fallback if database is not active
  if (!dbUrl) {
    return NextResponse.json({ success: true, source: "offline-mock" });
  }

  try {
    const { type, path, payload } = await req.json();

    if (!type) {
      return NextResponse.json({ error: "Event type is required." }, { status: 400 });
    }

    // Hash client IP to preserve user privacy while allowing session uniqueness
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const ipHash = createHash("sha256").update(ip).digest("hex");
    const userAgent = req.headers.get("user-agent") || undefined;

    // 1. Find or create a session for the unique IP hash within the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    let session = await db.visitorSession.findFirst({
      where: {
        ipHash,
        createdAt: { gte: thirtyMinutesAgo },
      },
    });

    if (!session) {
      session = await db.visitorSession.create({
        data: {
          ipHash,
          userAgent,
        },
      });
    }

    // 2. Create the associated analytics event
    await db.analyticsEvent.create({
      data: {
        sessionId: session.id,
        type,
        path,
        payload: payload ? JSON.stringify(payload) : undefined,
      },
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (err) {
    console.error("Analytics tracking failure:", err);
    return NextResponse.json({ error: "Failed to record event." }, { status: 500 });
  }
}

// GET endpoint to return aggregate stats for the visitor/admin dashboard
export async function GET(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return NextResponse.json({
      uniqueVisitors: 42,
      totalViews: 310,
      recentEvents: [],
      source: "mock-stats",
    });
  }

  try {
    const uniqueVisitors = await db.visitorSession.count();
    const totalViews = await db.analyticsEvent.count({
      where: { type: "page_view" },
    });

    const recentEvents = await db.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      uniqueVisitors,
      totalViews,
      recentEvents,
      source: "database",
    });
  } catch (err) {
    console.error("Analytics fetch failure:", err);
    return NextResponse.json({
      uniqueVisitors: 12,
      totalViews: 84,
      recentEvents: [],
      source: "error-fallback",
    });
  }
}
