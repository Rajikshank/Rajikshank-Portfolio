import { profile } from "../data/portfolio";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "activity", href: "#activity" },
  { label: "stack", href: "#stack" },
  { label: "work", href: "#projects" },
  { label: "experience", href: "#experience" },
  { label: "education", href: "#education" },
  { label: "contact", href: "#contact" },
];

export const Nav = () => {
  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <a href="#home" className="top-nav-brand" aria-label="Home">
        <span className="dot" aria-hidden="true" />
        {profile.name}
      </a>
      <div className="top-nav-links">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
      <div className="top-nav-actions">
        <ThemeToggle />
      </div>
    </nav>
  );
};
