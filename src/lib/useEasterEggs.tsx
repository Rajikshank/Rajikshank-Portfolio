import { useEffect } from "react";
import confetti from "canvas-confetti";

const SECRET = "rajikshan";

const messages = [
  "you found me. say hi on linkedin.",
  "the seal — wait, the squirrel approves.",
  "↑↑↓↓←→←→BA — just kidding. or am i?",
  "congrats. you unlocked a tiny moment.",
];

export const useEasterEggs = () => {
  useEffect(() => {
    let buffer = "";
    let toastEl: HTMLDivElement | null = null;
    let timer = 0;
    let messageIndex = 0;

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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      buffer = `${buffer}${event.key.toLowerCase()}`.slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = "";
        const msg = messages[messageIndex % messages.length] ?? messages[0]!;
        messageIndex++;
        showToast(msg);
        fire();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      hideToast();
    };
  }, []);
};
