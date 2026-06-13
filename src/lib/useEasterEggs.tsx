import { useEffect } from "react";
import confetti from "canvas-confetti";

const SECRET = "rajikshan";

const messages = [
  "you found me. say hi on linkedin.",
  "the fox approves.",
  "congrats. you unlocked a tiny moment.",
  "↑↑↓↓←→←→BA — that one's a different egg.",
];

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const KONAMI_MESSAGES = [
  "↑↑↓↓←→←→BA — old school.",
  "you remember the cheat code. i like you.",
  "30 lives, was it?",
];

const CLICK_TARGETS = 5;
const CLICK_WINDOW_MS = 1500;
const CLICK_MESSAGE = "stop. poking. me.";

export const useEasterEggs = () => {
  useEffect(() => {
    let buffer = "";
    let toastEl: HTMLDivElement | null = null;
    let konamiEl: HTMLDivElement | null = null;
    let timer = 0;
    let messageIndex = 0;
    let konamiIndex = 0;
    let clickTimer = 0;
    let clickCount = 0;
    let matrixOn = false;
    let matrixCleanup: (() => void) | null = null;

    const fire = () => {
      const end = Date.now() + 600;
      const colors = ["#e25822", "#fbfbf7", "#1a1a16"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
          ticks: 200,
          gravity: 0.9,
          scalar: 0.8,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
          ticks: 200,
          gravity: 0.9,
          scalar: 0.8,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 35,
        origin: { y: 0.65 },
        colors,
        ticks: 220,
        gravity: 0.85,
        scalar: 0.9,
      });
    };

    const hideToast = () => {
      if (toastEl) {
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateY(8px)";
        window.setTimeout(() => {
          toastEl?.remove();
          toastEl = null;
        }, 220);
      }
    };

    const showToast = (message: string) => {
      hideToast();
      const el = document.createElement("div");
      el.className = "easter-toast";
      el.setAttribute("role", "status");
      el.innerHTML = `<span class="kbd">rajikshan</span>${message}`;
      document.body.appendChild(el);
      toastEl = el;
      window.clearTimeout(timer);
      timer = window.setTimeout(hideToast, 3600);
    };

    const hideKonami = () => {
      if (konamiEl) {
        konamiEl.style.opacity = "0";
        konamiEl.style.transform = "translateY(-8px)";
        window.setTimeout(() => {
          konamiEl?.remove();
          konamiEl = null;
        }, 280);
      }
    };

    const showKonami = (msg: string) => {
      hideKonami();
      const el = document.createElement("div");
      el.className = "konami-toast";
      el.setAttribute("role", "status");
      el.textContent = msg;
      document.body.appendChild(el);
      konamiEl = el;
      window.setTimeout(hideKonami, 2800);
    };

    const startMatrix = () => {
      if (matrixOn) {
        return;
      }
      matrixOn = true;
      const wrap = document.createElement("div");
      wrap.className = "matrix-rain is-on";
      const canvas = document.createElement("canvas");
      wrap.appendChild(canvas);
      document.body.appendChild(wrap);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        wrap.remove();
        matrixOn = false;
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const resize = () => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      };
      resize();

      const fontSize = 16;
      let columns = Math.floor(window.innerWidth / fontSize);
      const drops: number[] = new Array(columns).fill(1);
      const chars = "RAJIKSHAN01<>/[]{}=+*#アイウエオカキクケコ";

      let raf = 0;
      const draw = () => {
        ctx.fillStyle = "rgba(14, 14, 12, 0.06)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#e25822";
        ctx.font = `${fontSize}px IBM Plex Mono, monospace`;
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]!;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);

      const onResize = () => {
        resize();
        columns = Math.floor(window.innerWidth / fontSize);
        drops.length = columns;
        for (let i = 0; i < columns; i++) {
          if (drops[i] === undefined) drops[i] = 1;
        }
      };
      window.addEventListener("resize", onResize);

      const stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        wrap.style.opacity = "0";
        window.setTimeout(() => {
          wrap.remove();
        }, 400);
        matrixOn = false;
      };
      matrixCleanup = stop;

      window.setTimeout(stop, 4500);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      // Konami
      const expected = KONAMI[konamiIndex];
      if (event.key === expected) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0;
          const msg = KONAMI_MESSAGES[Math.floor(Math.random() * KONAMI_MESSAGES.length)]!;
          showKonami(msg);
          startMatrix();
        }
      } else if (event.key.length === 1) {
        konamiIndex = 0;
        buffer = `${buffer}${event.key.toLowerCase()}`.slice(-SECRET.length);
        if (buffer === SECRET) {
          buffer = "";
          const msg = messages[messageIndex % messages.length] ?? messages[0]!;
          messageIndex++;
          showToast(msg);
          fire();
        }
      } else {
        konamiIndex = 0;
      }
    };

    const onClick = (event: MouseEvent) => {
      // Ignore clicks on links/buttons to avoid being annoying
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, [role='button']")) {
        return;
      }
      clickCount++;
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => {
        clickCount = 0;
      }, CLICK_WINDOW_MS);
      if (clickCount >= CLICK_TARGETS) {
        clickCount = 0;
        showToast(CLICK_MESSAGE);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      window.clearTimeout(timer);
      window.clearTimeout(clickTimer);
      hideToast();
      hideKonami();
      matrixCleanup?.();
    };
  }, []);
};
