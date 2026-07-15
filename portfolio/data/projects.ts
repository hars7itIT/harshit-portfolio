export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: "Full Stack" | "AI" | "College Project";
  status: "In Progress" | "Shipped" | "Maintained";
  stack: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  architecture: string;
  future: string[];
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "womenhealthcare",
    name: "WomenHealthCare",
    tagline: "A comprehensive digital health and wellness platform designed for women, offering cycles tracking, secure booking, and interactive AI diagnostic assistants.",
    category: "Full Stack",
    status: "Shipped",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Prisma", "Gemini API"],
    features: [
      "Dynamic cycle and ovulation tracking forecasts",
      "Secure patient profiles and appointment schedules",
      "Gemini-backed interactive medical Q&A chatbot widget",
      "Analytical reports and user charts dashboard",
    ],
    challenges: [
      "Preserving strict privacy boundaries on sensitive wellness records",
      "Achieving seamless predictions across irregular calendar milestones",
    ],
    solutions: [
      "Configured database-level column encryptors and tight endpoint middleware scopes",
      "Built a custom mathematical forecasting system with comprehensive unit-test coverage",
    ],
    architecture: "Next.js App Router full-stack setup: dynamic React UI pages backed by server routes fetching safely from a PostgreSQL instance using Prisma Client validation.",
    future: [
      "Telehealth integration with video calls",
      "IoT wearable biometric sync capabilities",
      "WCAG 2.2 accessibility adjustments",
    ],
    github: "https://github.com/hars7it/WomenHealthCare",
  },
  {
    slug: "wanderlust",
    name: "WanderLust",
    tagline: "An Airbnb-style property listing platform, built from the database up.",
    category: "Full Stack",
    status: "In Progress",
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "EJS", "CSS"],
    features: [
      "Property listings with full CRUD",
      "Custom design system built from scratch — visual identity, CSS, and EJS templates",
      "Schema-driven data models for listings",
      "Route architecture separating listing and (upcoming) review resources",
    ],
    challenges: [
      "Database name mismatches between environments causing silent connection issues",
      "Schema validation errors surfacing only at write-time",
      "Designing a coherent visual identity without a design tool, directly in CSS",
    ],
    solutions: [
      "Standardised the Mongoose connection string and DB naming convention across config",
      "Rewrote schema validation to fail fast with clear error messages",
      "Built a small internal design token set (colors, spacing, type) before touching components",
    ],
    architecture:
      "Classic MVC on Express: EJS views render server-side, Mongoose models define the data layer against MongoDB, and routes are being split by resource as the app grows toward auth and reviews.",
    future: [
      "Authentication (signup/login, sessions)",
      "Reviews and ratings on listings",
      "Wishlist / saved listings",
      "Cloudinary for image uploads",
      "Mapbox for location display and search",
    ],
  },
  {
    slug: "fixiq",
    name: "FixIQ",
    tagline: "An AI-powered product diagnostic tool that runs entirely in the browser.",
    category: "AI",
    status: "Shipped",
    stack: ["Vanilla JavaScript", "HTML", "CSS", "Anthropic API"],
    features: [
      "Diagnoses product issues from a plain-language description",
      "Calls the Anthropic API directly from the client — no backend server",
      "Secure API key modal so users bring their own key rather than one being hardcoded",
      "Multi-file vanilla JS architecture with no build tooling",
    ],
    challenges: [
      "Serving native ES modules correctly without a bundler",
      "Handling API authentication headers safely in a client-only app",
      "Preventing a hardcoded key from ever shipping in the source",
    ],
    solutions: [
      "Configured module scripts and MIME types so ES modules load directly in the browser",
      "Built a key-entry modal that stores the key only for the session, never in source",
      "Kept a clean separation between UI logic and the API-calling layer for easier debugging",
    ],
    architecture:
      "A static, no-build front end: plain HTML/CSS/JS files, ES modules for structure, and a thin API layer that talks to Anthropic's completion endpoint directly from the browser.",
    future: [
      "Optional backend proxy so the API key never touches the client",
      "Diagnostic history saved per session",
      "Support for image-based product diagnostics",
    ],
  },
  {
    slug: "uiet-attendance-tracker",
    name: "UIET Attendance Tracker",
    tagline: "An attendance tracking system built for UIET, Panjab University.",
    category: "College Project",
    status: "Maintained",
    stack: ["HTML", "CSS", "JavaScript"],
    features: [
      "Admin page with subject-wise navigation",
      "Buttons routing into existing login and attendance pages",
      "Simple, fast interface built for real classroom use, not a demo",
    ],
    challenges: [
      "Wiring a new admin page into an existing set of login/attendance pages without breaking them",
      "Keeping navigation intuitive for subject-by-subject attendance entry",
    ],
    solutions: [
      "Mapped each subject to a dedicated route/button on the admin page before touching existing code",
      "Kept the admin layer thin so it composes with the existing pages instead of replacing them",
    ],
    architecture:
      "A lightweight front end that acts as a control panel: the admin page links out to the pre-existing login and attendance flows rather than duplicating them.",
    future: [
      "Persist attendance to a real database instead of local state",
      "Per-student attendance percentage view",
      "Export to spreadsheet for faculty",
    ],
  },
];
