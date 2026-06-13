import { useEffect, useState } from "react";
import {
  Activity,
  Briefcase,
  GraduationCap,
  Layers,
  Mail,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";

const items = [
  { id: "activity", label: "activity", Icon: Activity },
  { id: "stack", label: "stack", Icon: Layers },
  { id: "projects", label: "work", Icon: Briefcase },
  { id: "experience", label: "experience", Icon: Sparkles },
  { id: "education", label: "education", Icon: GraduationCap },
];

type ThemeMode = "dark" | "light";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }
  const saved = window.localStorage.getItem("portfolio-theme");
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export const Dock = () => {
  const [active, setActive] = useState<string>("home");
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const sections = ["home", ...items.map((i) => i.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio - a.intersectionRatio) ||
              a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visible) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <nav className="dock" aria-label="Section navigation">
      {items.map(({ id, label, Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`dock-item ${active === id ? "is-active" : ""}`}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="dock-tooltip">{label}</span>
        </a>
      ))}
      <span className="dock-divider" aria-hidden="true" />
      <a
        href="#contact"
        className={`dock-item ${active === "contact" ? "is-active" : ""}`}
        aria-label="contact"
      >
        <Mail className="h-3.5 w-3.5" />
        <span className="dock-tooltip">contact</span>
      </a>
      <span className="dock-divider" aria-hidden="true" />
      <button
        type="button"
        className="dock-item"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <ThemeIcon className="h-3.5 w-3.5" />
        <span className="dock-tooltip">{theme === "dark" ? "light" : "dark"}</span>
      </button>
    </nav>
  );
};

