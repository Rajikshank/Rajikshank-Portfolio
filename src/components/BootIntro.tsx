import { useEffect, useState } from "react";
import { Braces, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const bootLines = ["resolve stack", "compile interface", "ship portfolio"];

const shouldShowBoot = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const skipIntro = new URLSearchParams(window.location.search).has("skipIntro");
  return !skipIntro && !prefersReducedMotion && !sessionStorage.getItem("portfolio-booted");
};

export const BootIntro = () => {
  const [isVisible, setIsVisible] = useState(shouldShowBoot);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("portfolio-booted", "true");
      setIsVisible(false);
    }, 1450);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="boot-screen fixed inset-0 z-50 flex items-center justify-center bg-black px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.div
            className="boot-card w-full max-w-lg rounded-lg border border-orange-300/20 bg-[#070503]/90 p-5 font-mono text-xs text-stone-300 shadow-2xl shadow-orange-950/30"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center justify-between text-orange-300">
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                boot.rajikshan
              </span>
              <Braces className="h-4 w-4" />
            </div>

            <div className="space-y-3">
              {bootLines.map((line, index) => (
                <motion.div
                  key={line}
                  className="flex items-center gap-3 rounded-md bg-white/[0.035] px-3 py-2"
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.16 + index * 0.16, duration: 0.32 }}
                >
                  <span className="status-dot" />
                  <span className="text-stone-500">$</span>
                  <span>{line}</span>
                  <span className="ml-auto text-orange-200">ok</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 h-1 overflow-hidden rounded-full bg-orange-300/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.05, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
