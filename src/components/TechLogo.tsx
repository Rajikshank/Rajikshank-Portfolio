import {
  siC,
  siCrewai,
  siCss,
  siDocker,
  siDrizzle,
  siExpress,
  siFastapi,
  siGithub,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siLangchain,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import type { TechLogoSlug } from "../data/portfolio";

const logos: Partial<Record<TechLogoSlug, SimpleIcon>> = {
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  nodedotjs: siNodedotjs,
  express: siExpress,
  postgresql: siPostgresql,
  prisma: siPrisma,
  drizzle: siDrizzle,
  langchain: siLangchain,
  googlegemini: siGooglegemini,
  github: siGithub,
  githubactions: siGithubactions,
  docker: siDocker,
  python: siPython,
  java: siOpenjdk,
  c: siC,
  springboot: siSpringboot,
  fastapi: siFastapi,
  postman: siPostman,
  vercel: siVercel,
  crewai: siCrewai,
  html5: siHtml5,
  css3: siCss,
};

type TechLogoProps = {
  slug: TechLogoSlug;
  label?: string;
  className?: string;
};

export const TechLogo = ({ slug, label, className = "" }: TechLogoProps) => {
  const icon = logos[slug];

  if (!icon) {
    const fallback = (label ?? slug).slice(0, 2).toUpperCase();
    return (
      <span className={`tech-logo-fallback ${className}`} aria-hidden="true">
        {fallback}
      </span>
    );
  }

  return (
    <svg
      className={`tech-logo ${className}`}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}
      <path d={icon.path} />
    </svg>
  );
};
