export const profile = {
  name: "rajikshan",
  fullName: "Krishnakumar Rajikshan",
  handle: "@Rajikshank",
  role: "Junior full-stack developer",
  location: "Batticaloa, Sri Lanka",
  email: "krajikshan637@gmail.com",
  phone: "+94 77 882 8292",
  resume:
    "https://drive.google.com/file/d/1zp91nbp8eCVzUQIpayRl1ModXrVnNlYl/view?usp=drive_link",
  status: "Open to junior roles · remote or hybrid",
  headline: "I build web apps end-to-end and I'm looking for my first full-time role.",
  intro:
    "I graduated with a BSc (Hons) in Software Engineering in 2025 and spent the last year and a half training as a full-stack engineer — shipping React and Next.js apps, LLM APIs, and the CI/CD that keeps them running.",
  detail:
    "Comfortable across frontend UI, backend services, and LLM integrations. I care about clear interfaces, reliable APIs, and the small details that make software feel right.",
};

export const socials = {
  github: "https://github.com/Rajikshank",
  linkedin: "https://www.linkedin.com/in/krishnakumar-rajikshan-4853861a5/",
  x: "https://x.com/x399Shan",
};

export const highlights = [
  { label: "Apps shipped", value: "4" },
  { label: "LLM APIs", value: "3" },
  { label: "Daily requests", value: "1.2k" },
  { label: "GPA", value: "3.60" },
];

export type TechLogoSlug =
  | "javascript"
  | "typescript"
  | "react"
  | "nextdotjs"
  | "tailwindcss"
  | "nodedotjs"
  | "express"
  | "postgresql"
  | "prisma"
  | "drizzle"
  | "langchain"
  | "pinecone"
  | "googlegemini"
  | "github"
  | "githubactions"
  | "docker"
  | "python"
  | "java"
  | "c"
  | "springboot"
  | "fastapi"
  | "postman"
  | "vercel"
  | "crewai"
  | "vite"
  | "html5"
  | "css3"
  | "openjdk";

export type SkillItem = {
  name: string;
  logo: TechLogoSlug;
};

export const skillGroups: Array<{ title: string; items: SkillItem[] }> = [
  {
    title: "Languages",
    items: [
      { name: "JavaScript", logo: "typescript" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Python", logo: "python" },
      { name: "Java", logo: "openjdk" },
      { name: "C", logo: "c" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextdotjs" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "HTML", logo: "html5" },
      { name: "CSS", logo: "css3" },
    ],
  },
  {
    title: "Backend & data",
    items: [
      { name: "Node.js", logo: "nodedotjs" },
      { name: "Express", logo: "express" },
      { name: "FastAPI", logo: "fastapi" },
      { name: "Spring Boot", logo: "springboot" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Prisma", logo: "prisma" },
      { name: "Drizzle", logo: "drizzle" },
    ],
  },
  {
    title: "AI & tooling",
    items: [
      { name: "LangChain", logo: "langchain" },
      { name: "Pinecone", logo: "pinecone" },
      { name: "Gemini", logo: "googlegemini" },
      { name: "CrewAI", logo: "crewai" },
      { name: "Docker", logo: "docker" },
      { name: "GitHub Actions", logo: "githubactions" },
      { name: "Postman", logo: "postman" },
      { name: "Vercel", logo: "vercel" },
    ],
  },
];

export const experiences = [
  {
    position: "Trainee full-stack AI engineer",
    organization: "SPM Batticaloa",
    period: "May 2023 — Present",
    location: "Batticaloa, LK",
    points: [
      "Contributed to four production web apps across the MERN and Next.js stacks.",
      "Built three LangChain LLM services with Pinecone and PGVector search — ~1,200 daily requests at 99.9% uptime.",
      "Shipped UI redesign work that improved engagement and dropped the bounce rate on the public site.",
      "Set up CI/CD with GitHub Actions and Docker, and trimmed backend latency and cloud cost along the way.",
    ],
  },
];

export const education = [
  {
    title: "BSc (Hons) Software Engineering",
    institute: "Sri Lanka Technological Campus",
    period: "2021 — 2025",
    detail: "GPA 3.60 / 4.00 — second-class upper.",
  },
];

export const projects = [
  {
    title: "Gizume",
    subtitle: "GitHub resume automation",
    description:
      "A pipeline that turns a GitHub profile into a clean resume. Next.js and Node.js on the front, GitHub GraphQL and webhooks in the middle, Gemini for the summary, Docker for the runtime — deployed and continuously available.",
    technology: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Gemini", "Docker"],
    logos: ["nextdotjs", "nodedotjs", "postgresql", "prisma", "googlegemini", "docker"] as TechLogoSlug[],
    github: "",
    live: "https://www.gizume.online/",
  },
  {
    title: "Hive Hub",
    subtitle: "AI job portal",
    description:
      "A job recommendation engine built on LangChain, Prisma, Pinecone, and Gemini embeddings. Vector search makes the matching faster and more relevant than keyword filters.",
    technology: ["Next.js", "PostgreSQL", "Drizzle", "LangChain", "Pinecone", "Gemini"],
    logos: ["nextdotjs", "postgresql", "drizzle", "langchain", "pinecone", "googlegemini"] as TechLogoSlug[],
    github: "https://github.com/Rajikshank/Hive-Hub",
    live: "https://hive-hub-zeta.vercel.app/",
  },
  {
    title: "Zaylo",
    subtitle: "E-commerce storefront",
    description:
      "A small but complete storefront — Next.js, Drizzle, PostgreSQL, UploadThing for product media. Focused on a clean catalog flow and reliable checkout.",
    technology: ["Next.js", "PostgreSQL", "Drizzle", "TypeScript"],
    logos: ["nextdotjs", "postgresql", "drizzle", "typescript"] as TechLogoSlug[],
    github: "https://github.com/Rajikshank/Zaylo-Store",
    live: "https://zaylo-uxl3.vercel.app/",
  },
];

export type ActivityCell = {
  level: 0 | 1 | 2 | 3;
  tip?: string;
};

export type ActivityCluster = {
  label: string;
  title: string;
  description: string;
  cells: ActivityCell[];
};

const buildCells = (pattern: Array<0 | 1 | 2 | 3>, prefix: string): ActivityCell[] =>
  pattern.map((level, i) => ({
    level,
    tip: level > 0 ? `${prefix} · ${level * 4 + i % 5} commits` : `${prefix} · quiet`,
  }));

export const activityClusters: ActivityCluster[] = [
  {
    label: "Core",
    title: "Production web apps",
    description: "MERN and Next.js delivery at SPM — UI work, backend services, and the bits in between.",
    cells: buildCells([0, 1, 1, 2, 2, 3, 2, 1, 1, 2, 3, 2, 1, 0, 1, 2], "core"),
  },
  {
    label: "AI",
    title: "LLM API pipelines",
    description: "LangChain services with vector search — ~1,200 daily requests at 99.9% uptime.",
    cells: buildCells([1, 2, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 0, 1, 2, 3], "ai"),
  },
  {
    label: "Ship",
    title: "Side projects",
    description: "Gizume, Hive Hub, and Zaylo — small full-stack apps, from idea to deploy.",
    cells: buildCells([0, 0, 1, 2, 2, 3, 2, 2, 1, 3, 2, 1, 0, 1, 2, 2], "ship"),
  },
];
