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
    items: ["Machine Learning", "Deep Learning", "NLP Basics", "AI Tools / APIs"],
  },
  {
    label: "Tools",
    items: ["Git & GitHub", "VS Code", "Postman", "Docker (Basics)"],
  },
];
