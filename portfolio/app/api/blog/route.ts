import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const DEFAULT_POSTS = [
  {
    slug: "demystifying-agentic-workflows-gemini",
    title: "Demystifying Agentic Workflows with Gemini API",
    excerpt: "Explore how to construct context-aware, tool-calling agent systems using the latest Gemini models and Next.js route handlers.",
    category: "AI & ML",
    published: true,
    content: `# Demystifying Agentic Workflows with Gemini API

Agentic AI systems represent a significant shift from static prompt-completion models to autonomous, goal-driven loops. By linking models like Gemini with native code APIs (tool-calling), we allow them to reason, plan, and execute operations dynamically.

## The Agent Loop

1. **Reasoning**: The user submits a goal. The model maps out the tasks required.
2. **Action**: The model triggers tool executions (e.g. database query, API check).
3. **Observation**: The system feeds tool outputs back to the model context.
4. **Conclusion**: The loop repeats until the goal is fully achieved.

In this portfolio, our AI Playground mimics this pattern to simulate technical interviews, analyzing resume text against specific ATS metrics.`,
  },
  {
    slug: "high-performance-prisma-nextjs",
    title: "How I Configured a High-Performance Prisma Client in Next.js",
    excerpt: "A deep dive into optimizing Prisma database pooling, global connection caching, and schema indexes to scale serverless database access.",
    category: "Backend",
    published: true,
    content: `# High-Performance Prisma Client in Next.js

In serverless execution environments like Vercel, active backend processes spin up and down dynamically. If a database client is initialized on every route instantiation, the database pool will rapidly exhaust active connections.

## The Global Caching Pattern

To prevent connection leakages, we cache the \`PrismaClient\` instance in Node's \`global\` space during development:

\`\`\`typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
\`\`\`

By persisting the client, hot-reloading actions do not trigger concurrent connection spikes.`,
  },
  {
    slug: "ux-aesthetics-cyberpunk-glassmorphism",
    title: "UX Aesthetics: Cyberpunk Glassmorphism",
    excerpt: "Designing state-of-the-art developer portfolios using HSL tailor grids, aurora background filters, and fluid framer-motion grids.",
    category: "UI/UX",
    published: true,
    content: `# UX Aesthetics: Cyberpunk Glassmorphism

High-tech luxury design requires visual depth. We achieve this by blending layered CSS gradients, semi-transparent panels, and backdrop-filtering.

## The Glassmorphic Formula

1. **Transparency**: Low opacity background fills (e.g., \`rgba(10, 15, 30, 0.7)\`).
2. **Backdrop Blur**: High blur values to isolate elements (\`backdrop-filter: blur(16px)\`).
3. **Contrast Borders**: Thin borders mimicking reflective glass boundaries.
4. **Neon Accent**: Subtle, colored outer glow parameters.`,
  },
];

export async function GET(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;

  // Fallback to static mock if no database is connected yet
  if (!dbUrl) {
    return NextResponse.json({ posts: DEFAULT_POSTS, source: "mock-fallback" });
  }

  try {
    let posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Auto-seed if the database blog post table is completely empty
    if (posts.length === 0) {
      await Promise.all(
        DEFAULT_POSTS.map((p) =>
          db.blogPost.create({
            data: p,
          })
        )
      );
      posts = await db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ posts, source: "database" });
  } catch (err) {
    console.error("Blog API fetch error:", err);
    return NextResponse.json({ posts: DEFAULT_POSTS, source: "error-fallback" });
  }
}

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json(
      { error: "Database offline. Please configure DATABASE_URL in your .env.local file to write posts permanently." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { title, content, summary, category, coverImage, videoUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and Content are required fields." }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    let slug = baseSlug;
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await db.blogPost.create({
      data: {
        slug,
        title,
        content,
        excerpt: summary || (content.length > 150 ? content.substring(0, 147) + "..." : content),
        category: category || "Tech",
        coverImage: coverImage || null,
        videoUrl: videoUrl || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("Blog API publish error:", err);
    return NextResponse.json({ error: err.message || "Failed to create blog post." }, { status: 500 });
  }
}
