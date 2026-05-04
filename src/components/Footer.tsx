import { ArrowUpRight, Copyright, Mail } from "lucide-react";
import { profile, socials } from "../data/portfolio";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8"
    >
      <div className="retro-panel rounded-lg p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">
              Contact
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-stone-50 md:text-5xl">
              Have a serious product idea? Send the signal.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <a
              href={`mailto:${profile.email}`}
              className="spark-button inline-flex items-center justify-center gap-2 rounded-full bg-orange-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-200"
            >
              Email me
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="spark-button inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-300/60 hover:text-orange-100"
            >
              GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Copyright className="h-4 w-4" />
            Built by {profile.name}
          </span>
          <a href="#home" className="interactive-link w-fit text-stone-300">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
};
