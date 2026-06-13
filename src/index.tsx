import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { Dock } from "./components/Dock";
import { AboutMe } from "./components/AboutMe";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { ActivityGraph } from "./components/ActivityGraph";
import { Footer } from "./components/Footer";
import { SquirrelMascot } from "./components/PandaMascot";
import { useEasterEggs } from "./lib/useEasterEggs";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useEasterEggs();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    if (!reduceMotion && !coarse) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const onAnchorClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const link = target?.closest("a[href^='#']") as HTMLAnchorElement | null;
        if (!link) {
          return;
        }
        const id = link.getAttribute("href")?.slice(1);
        if (!id) {
          return;
        }
        const el = document.getElementById(id);
        if (!el) {
          return;
        }
        event.preventDefault();
        lenis?.scrollTo(el, { offset: -40, duration: 1.2 });
      };
      document.addEventListener("click", onAnchorClick);

      const tickerFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      return () => {
        document.removeEventListener("click", onAnchorClick);
        gsap.ticker.remove(tickerFn);
        lenis?.destroy();
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) {
      return;
    }

    const ctx = gsap.context(() => {
      // Hero intro stagger
      gsap.fromTo(
        ".hero .reveal-item",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.05,
        }
      );

      gsap.fromTo(
        ".hero-time",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.4 }
      );

      gsap.fromTo(
        ".hero-name-line",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.15,
        }
      );

      gsap.fromTo(
        ".hero-name em",
        { backgroundSize: "0% 100%" },
        {
          backgroundSize: "100% 100%",
          duration: 1.2,
          ease: "expo.out",
          delay: 0.6,
        }
      );

      gsap.fromTo(
        ".dock",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)", delay: 0.4 }
      );

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        const items = section.querySelectorAll(".reveal-item");
        gsap.fromTo(
          items,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".activity-chart-line",
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power3.inOut",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".activity-chart-area",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.5,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".activity-chart-dot",
        { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.03,
          delay: 0.7,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".panda",
        { y: 16, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)", delay: 0.5 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="site-shell">
      <div className="grain" aria-hidden="true" />
      <div className="dot-grid" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <SquirrelMascot />
      <div className="page">
        <Header />
        <main>
          <ActivityGraph />
          <AboutMe />
          <Projects />
          <Experience />
          <Education />
        </main>
        <Footer />
      </div>
      <Dock />
    </div>
  );
};

export default Index;
