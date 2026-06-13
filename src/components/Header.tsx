import { ArrowUpRight, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { highlights, profile, socials } from "../data/portfolio";
import { TextScramble } from "../lib/TextScramble";

export const Header = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header id="home" className="hero">
      <div className="hero-meta reveal-item">
        <span className="hero-time">
          <span className="hero-time-dot" aria-hidden="true" />
          <span>{dateStr} · {timeStr}</span>
        </span>
        <span className="hero-loc">batticaloa · lk</span>
      </div>

      <h1 className="hero-title">
        <span className="hero-name-line">Hi, I'm</span>
        <span className="hero-name-line">
          <span className="hero-name">
            <em>
              <TextScramble text="Rajikshan" />
            </em>
            <span className="hero-name-dot" aria-hidden="true" />
          </span>
        </span>
        <span className="hero-name-line">a junior full-stack</span>
        <span className="hero-name-line">developer building for the web.</span>
      </h1>

      <p className="hero-role reveal-item">
        <span>{profile.role}</span>
        <span>graduated 2025</span>
        <span>looking for a full-time role</span>
      </p>

      <p className="hero-lead reveal-item">{profile.intro}</p>
      <p className="hero-lead hero-lead-quiet reveal-item">
        {profile.detail}
      </p>

      <div className="hero-stats reveal-item">
        {highlights.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="hero-links reveal-item">
        <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary">
          Resume
          <Download className="h-3 w-3" />
        </a>
        <a href={socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
          GitHub
          <ArrowUpRight className="h-3 w-3" />
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
        >
          LinkedIn
          <ArrowUpRight className="h-3 w-3" />
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn-ghost">
          <Mail className="h-3 w-3" />
          Email
        </a>
      </div>

      <div id="panda-home" className="seal-home" aria-hidden="true" />
    </header>
  );
};
