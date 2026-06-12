import { ArrowUpRight, Download, Mail, Sparkles } from "lucide-react";
import { highlights, profile, socials } from "../data/portfolio";
import { TextScramble } from "../lib/TextScramble";

export const Header = () => {
  return (
    <header id="home" className="hero">
      <p className="hero-status reveal-item">
        <Sparkles className="h-2.5 w-2.5" />
        <span>{profile.status}</span>
      </p>

      <h1 className="reveal-item">
        <span className="hero-line">Hi, I'm</span>
        <span className="hero-name">
          <em>
            <TextScramble text="Krishnakumar" />
          </em>
          <span className="hero-name-dot" aria-hidden="true" />
        </span>
        <span className="hero-line">a junior full-stack developer</span>
        <span className="hero-line">looking for the next thing to build.</span>
      </h1>

      <p className="hero-role reveal-item">
        <span>{profile.role}</span>
        <span>{profile.location}</span>
        <span>graduated 2025</span>
      </p>

      <p className="hero-lead reveal-item">{profile.intro}</p>
      <p className="hero-lead reveal-item hero-lead-quiet">
        {profile.detail}
      </p>

      <div className="hero-stats reveal-item">
        {highlights.map((item, i) => (
          <div key={item.label} className="hero-stat" style={{ ["--i" as string]: i }}>
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
