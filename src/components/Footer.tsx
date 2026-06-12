import { useState } from "react";
import { profile, socials } from "../data/portfolio";

const year = new Date().getFullYear();
const lastUpdated = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const Footer = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <footer id="contact" className="site-footer reveal-section">
      <div className="footer-contact reveal-item">
        <a href={`mailto:${profile.email}`} className="btn btn-primary">
          {profile.email}
        </a>
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
        >
          GitHub
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
        >
          LinkedIn
        </a>
        <a href={socials.x} target="_blank" rel="noreferrer" className="btn btn-ghost">
          X
        </a>
      </div>

      <p className="footer-credit reveal-item">
        <span>
          built & maintained by{" "}
          <button
            type="button"
            onClick={() => setClicks((value) => value + 1)}
            aria-label="Built by Rajikshan"
          >
            RAJIKSHAN
          </button>{" "}
          · <span className="accent">batticaloa, lk</span> · {year}
        </span>
        <span className="smallprint">
          typed in typescript · shipped on vercel · last updated {lastUpdated}
          {clicks >= 5 ? " · thanks for the clicks." : ""}
        </span>
      </p>
    </footer>
  );
};
