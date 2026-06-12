import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { Nav } from "./components/Nav";
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
    const root = pageRef.current;
    if (!root) {
      return;
    }

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
        lenis?.scrollTo(el, { offset: -56, duration: 1.2 });
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
        ".top-nav",
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
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

      gsap.utils.toArray<HTMLElement>(".activity-cell").forEach((cell, index) => {
        gsap.fromTo(
          cell,
          { scale: 0.3, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.7)",
            delay: (index % 16) * 0.016 + Math.floor(index / 16) * 0.07,
            scrollTrigger: {
              trigger: ".activity-panel",
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".activity-spark-line",
        { strokeDasharray: 240, strokeDashoffset: 240 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".activity-spark-area",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.7,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".activity-spark-dot",
        { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(2)",
          stagger: 0.04,
          delay: 0.6,
          scrollTrigger: {
            trigger: ".activity-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".panda",
        { y: 16, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)", delay: 0.5 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="site-shell">
      <div className="grain" aria-hidden="true" />
      <div className="dot-grid" aria-hidden="true" />
      <SquirrelMascot />
      <div className="page">
        <Nav />
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
    </div>
  );
};

export default Index;
