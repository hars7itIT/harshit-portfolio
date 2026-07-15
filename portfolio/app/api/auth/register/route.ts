import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json(
      { error: "Database offline. Please configure DATABASE_URL to write users." },
      { status: 503 }
    );
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 400 });
    }

    // Determine role (first user to register becomes admin automatically)
    const userCount = await db.user.count();
    const role = userCount === 0 ? "admin" : "user";

    const hashedPassword = hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        role,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err: any) {
    console.error("Auth Register error:", err);
    return NextResponse.json({ error: err.message || "Failed to register user." }, { status: 500 });
  }
}
