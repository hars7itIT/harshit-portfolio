export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["C++", "Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    label: "Frontend",
    items: ["HTML5", "CSS3", "Tailwind CSS", "React", "Next.js", "EJS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js"],
  },
  {
    label: "Database",
    items: ["MongoDB", "MySQL", "PostgreSQL", "Mongoose", "Prisma ORM"],
  },
  {
    label: "AI & ML",
    items: ["Anthropic API", "Prompt Engineering", "LangChain (learning)", "RAG (learning)"],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "VS Code", "Spyder", "Postman"],
  },
  {
    label: "Other",
    items: ["REST APIs", "Responsive Design", "UI/UX Basics", "SEO Basics"],
  },
];
