import { useEffect, useRef } from "react";
import AboutMe from "./components/AboutMe";
import { BootIntro } from "./components/BootIntro";
import Header from "./components/Header";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import { Footer } from "./components/Footer";

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) {
      return;
    }

    let teardown = () => {};
    let isDisposed = false;

    const setupMotion = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (isDisposed) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".gsap-reveal",
          { y: 36, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".motion-section").forEach((section) => {
          const items = section.querySelectorAll(".motion-item");

          gsap.fromTo(
            items,
            { y: 42, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
              },
            },
          );
        });
      }, root);

      const onPointerMove = (event: PointerEvent) => {
        gsap.to(root, {
          "--cursor-x": `${event.clientX}px`,
          "--cursor-y": `${event.clientY}px`,
          duration: 0.45,
          ease: "power2.out",
        });
      };

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      if (!prefersReducedMotion && hasFinePointer) {
        window.addEventListener("pointermove", onPointerMove);
      }

      teardown = () => {
        window.removeEventListener("pointermove", onPointerMove);
        ctx.revert();
      };
    };

    void setupMotion();

    return () => {
      isDisposed = true;
      teardown();
    };
  }, []);

  return (
    <div ref={pageRef} className="site-shell min-h-screen overflow-hidden">
      <BootIntro />
      <div className="noise-layer" aria-hidden="true" />
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-12 sm:px-6 lg:px-8">
        <AboutMe />
        <Experience />
        <Education />
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
