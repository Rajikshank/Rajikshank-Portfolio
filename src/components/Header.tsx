import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Download,
  Mail,
  MapPin,
  Radio,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { codeLines, devSignals, heroStats, profile, stack } from "../data/portfolio";
import { PixelName } from "./PixelName";
import Social from "./Social";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  return (
    <header
      id="home"
      className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8"
    >
      <nav className="gsap-reveal mb-10 flex items-center justify-between gap-4 rounded-full border border-white/10 bg-black/35 px-3 py-2 font-mono text-xs text-stone-300 backdrop-blur-xl md:px-4 lg:mb-12">
        <a
          href="#home"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/50 bg-amber-300 text-sm font-semibold text-black"
          aria-label="Go to top"
        >
          RK
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="interactive-link">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${profile.email}`}
          className="spark-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-stone-100 transition hover:border-orange-300/60 hover:text-orange-100"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Start a build</span>
        </a>
      </nav>

      <div className="grid items-center gap-10 lg:min-h-[760px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="inline-flex max-w-full items-center gap-3 rounded-full border border-orange-300/25 bg-orange-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-orange-100 sm:text-xs sm:tracking-[0.18em]"
          >
            <Radio className="h-4 w-4 text-orange-300" />
            <span className="sm:hidden">AI SaaS + full-stack work</span>
            <span className="hidden sm:inline">{profile.availability}</span>
          </motion.div>

          <div className="space-y-5">
            <motion.p
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.65, ease: "easeOut" }}
              className="font-mono text-sm uppercase tracking-[0.3em] text-amber-300"
            >
              {profile.role}
            </motion.p>
            <PixelName text={profile.name} />
            <motion.p
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.24, duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl text-base leading-8 text-stone-300 md:text-lg"
            >
              {profile.intro}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className="spark-button inline-flex items-center justify-center gap-2 rounded-full bg-orange-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-200"
            >
              View projects
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="spark-button inline-flex items-center justify-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/5 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-300/70 hover:text-orange-100"
            >
              Resume
              <Download className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="micro-card rounded-lg border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-stone-100">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.7, ease: "easeOut" }}
            className="grid gap-2 rounded-lg border border-orange-300/15 bg-black/35 p-3 font-mono text-xs text-stone-300 sm:grid-cols-3"
          >
            {devSignals.map((signal) => (
              <div key={signal.command} className="flex items-center gap-3 rounded-md bg-white/[0.03] px-3 py-2">
                <span className="status-dot" aria-hidden="true" />
                <span className="text-stone-500">$</span>
                <span>{signal.command}</span>
                <span className="ml-auto text-orange-200">{signal.result}</span>
              </div>
            ))}
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" />
              {profile.location}
            </span>
            <a href={`mailto:${profile.email}`} className="interactive-link">
              {profile.email}
            </a>
          </div>
        </div>

        <motion.div
          initial={{ y: 32, opacity: 0, rotate: -1 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.22, duration: 0.8, ease: "easeOut" }}
          className="retro-panel overflow-hidden rounded-lg p-3"
        >
          <div className="relative overflow-hidden rounded-md border border-white/10 bg-stone-950">
            <img
              src="/profile.webp"
              alt="Illustrated portrait of Rajikshan K"
              width="960"
              height="1440"
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-center opacity-90 saturate-[0.9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-stone-300">
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur">
                {profile.handle}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="rounded-md border border-white/10 bg-black/65 p-4 font-mono text-xs text-stone-200 backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between gap-3 text-orange-300">
                  <span className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    portfolio.exe
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="window-dot" />
                    <span className="window-dot delay-1" />
                    <span className="window-dot delay-2" />
                  </span>
                </div>
                <p className="terminal-caret text-stone-100">shipping useful AI products</p>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-md border border-orange-300/15 bg-black/45 p-4 font-mono text-xs text-stone-300">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Braces className="h-4 w-4" />
              <span>focus.config.ts</span>
            </div>
            <div className="space-y-2 break-words">
              {codeLines.map((line) => (
                <p key={line}>
                  <span className="mr-3 text-stone-600">&gt;</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="ticker-mask mt-3 overflow-hidden rounded-md border border-white/10 bg-black/35 py-3">
            <div className="ticker-track flex gap-3 px-3 font-mono text-xs uppercase tracking-[0.16em] text-stone-300">
              {[...stack, ...stack].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
                  <span>{item}</span>
                  <span className="text-orange-300">/</span>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <Social />
            <a
              href="#contact"
              className="spark-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-200 transition hover:border-orange-300/60 hover:text-orange-100"
              aria-label="Jump to contact"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
