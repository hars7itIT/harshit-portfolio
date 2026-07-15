export type TimelineEntry = {
  year: string;
  title: string;
  place: string;
  detail: string;
};

export const educationTimeline: TimelineEntry[] = [
  {
    year: "2025 — Present",
    title: "B.E. Computer Science & Engineering, Second Year",
    place: "UIET, Panjab University, Chandigarh",
    detail:
      "Coursework spanning data structures, differential equations, and core CS foundations, alongside independent full-stack and AI projects.",
  },
  {
    year: "2025",
    title: "Started B.E. CSE",
    place: "UIET, Panjab University, Chandigarh",
    detail: "Began the CSE program, moving from Azamgarh, Uttar Pradesh to Chandigarh.",
  },
];

export const experienceTimeline: TimelineEntry[] = [
  {
    year: "2026 — Present",
    title: "Shipped WomenHealthCare",
    place: "Personal Project",
    detail:
      "Designed and developed a comprehensive digital wellness platform for women, featuring cycle forecasts, clinic booking, and Gemini AI health consultations.",
  },
  {
    year: "2026 — Present",
    title: "Building WanderLust",
    place: "Personal Project",
    detail:
      "Designing and building a full-stack property listing platform end to end — schema, routes, and a from-scratch design system.",
  },
  {
    year: "2026",
    title: "Shipped FixIQ",
    place: "Personal Project",
    detail:
      "Built a browser-only AI diagnostic tool that calls the Anthropic API directly from the client, with a secure key-entry flow.",
  },
  {
    year: "2026",
    title: "UIET Attendance Tracker",
    place: "College Project",
    detail: "Built an admin panel wiring subject-wise navigation into the college's attendance system.",
  },
];
