import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <button
      className="icon-btn"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
};
