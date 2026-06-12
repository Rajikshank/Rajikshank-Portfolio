import { useEffect, useMemo, useRef, useState } from "react";

const IDLE_MS = 700;
const SPRING = 0.05;
const DAMPING = 0.78;
const RUN_THRESHOLD = 0.7;
const REST_RADIUS = 26;

type BubbleMessage = { text: string };

const messages: BubbleMessage[] = [
  { text: "Welcome. Scroll to explore." },
  { text: "I'll follow along." },
  { text: "Open to junior roles." },
  { text: "Click me. Different line." },
  { text: "Coffee. TypeScript. Repeat." },
];

const restMessages: BubbleMessage[] = [
  { text: "Made it. What's up?" },
  { text: "You can scroll now." },
  { text: "Need a hand?" },
  { text: "Here." },
];

const runMessages: BubbleMessage[] = [
  { text: "On my way." },
  { text: "Catch you there." },
  { text: "Almost." },
  { text: "Coming." },
];

type Mood = "calm" | "alert" | "happy" | "zoom";

export const SquirrelMascot = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lookRef = useRef<SVGGElement>(null);
  const blinkRef = useRef<SVGGElement>(null);
  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    pointerX: 0,
    pointerY: 0,
    pointerMovedAt: 0,
    facingLeft: false,
    mode: "hero" as "hero" | "run" | "rest",
    mood: "calm" as Mood,
  });
  const [bubbleKey, setBubbleKey] = useState(0);
  const [bubble, setBubble] = useState(messages[0]!.text);

  const computeBubble = useMemo(() => {
    return (key: number, mode: "hero" | "run" | "rest") => {
      if (key === 0) {
        return mode === "rest" ? restMessages[0]!.text : messages[0]!.text;
      }
      if (mode === "rest") {
        return restMessages[key % restMessages.length]!.text;
      }
      if (mode === "run") {
        return runMessages[key % runMessages.length]!.text;
      }
      return messages[key % messages.length]!.text;
    };
  }, []);

  useEffect(() => {
    setBubble(computeBubble(bubbleKey, state.current.mode));
  }, [bubbleKey, computeBubble]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarse) {
      root.style.display = "none";
      return;
    }

    const getHeroTarget = () => {
      const anchor = document.getElementById("panda-home");
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const w = root.offsetWidth || 88;
        const h = root.offsetHeight || 88;
        return {
          x: rect.left + rect.width * 0.5 - w / 2,
          y: rect.top + rect.height * 0.55 - h / 2,
        };
      }
      return { x: window.innerWidth - 140, y: 280 };
    };

    const setHomeTarget = () => {
      const target = getHeroTarget();
      state.current.targetX = target.x;
      state.current.targetY = target.y;
    };

    const initial = getHeroTarget();
    state.current.x = initial.x;
    state.current.y = initial.y;
    state.current.targetX = initial.x;
    state.current.targetY = initial.y;
    state.current.pointerX = initial.x + 60;
    state.current.pointerY = initial.y - 30;
    state.current.pointerMovedAt = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      const w = root.offsetWidth || 88;
      const h = root.offsetHeight || 88;
      state.current.pointerX = event.clientX - w / 2;
      state.current.pointerY = event.clientY - h / 2;
      state.current.pointerMovedAt = performance.now();
    };

    const onScroll = () => {
      if (window.scrollY < 80) {
        setHomeTarget();
      }
    };

    const onResize = () => {
      if (window.scrollY < 80) {
        const target = getHeroTarget();
        state.current.x = target.x;
        state.current.y = target.y;
        state.current.targetX = target.x;
        state.current.targetY = target.y;
      }
    };

    let frame = 0;
    const tick = () => {
      const s = state.current;
      const scrolled = window.scrollY > 120;
      const pointerIdle = performance.now() - s.pointerMovedAt > IDLE_MS;

      let nextMode: "hero" | "run" | "rest" = "hero";
      let targetX: number;
      let targetY: number;

      if (scrolled && pointerIdle) {
        targetX = s.pointerX;
        targetY = s.pointerY;
        const dist = Math.hypot(targetX - s.x, targetY - s.y);
        nextMode = dist < REST_RADIUS ? "rest" : "run";
      } else if (scrolled) {
        targetX = s.targetX;
        targetY = s.targetY;
      } else {
        setHomeTarget();
        targetX = s.targetX;
        targetY = s.targetY;
      }

      s.mode = nextMode;
      s.mood = nextMode === "run" ? "zoom" : nextMode === "rest" ? "happy" : "calm";

      const spring = nextMode === "run" ? SPRING * 1.5 : SPRING;
      const ax = (targetX - s.x) * spring;
      const ay = (targetY - s.y) * spring;
      s.vx = (s.vx + ax) * DAMPING;
      s.vy = (s.vy + ay) * DAMPING;

      if (nextMode === "rest") {
        s.vx *= 0.78;
        s.vy *= 0.78;
      }

      s.x += s.vx;
      s.y += s.vy;

      const speed = Math.hypot(s.vx, s.vy);
      root.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

      const facingLeft = s.vx < -0.05;
      if (facingLeft !== s.facingLeft) {
        s.facingLeft = facingLeft;
        root.classList.toggle("panda-facing-left", facingLeft);
      }

      const nextAnim =
        nextMode === "run" && speed > RUN_THRESHOLD
          ? "panda-run"
          : nextMode === "rest"
            ? "panda-rest"
            : "panda-idle";

      root.classList.toggle("panda-run", nextAnim === "panda-run");
      root.classList.toggle("panda-rest", nextAnim === "panda-rest");
      root.classList.toggle("panda-idle", nextAnim === "panda-idle");
      root.classList.toggle("panda-zoom", nextMode === "run" && speed > RUN_THRESHOLD * 1.5);
      root.classList.toggle("panda-happy", nextMode === "rest");
      root.classList.toggle(
        "panda-show-bubble",
        nextMode === "hero" || nextMode === "rest"
      );

      if (lookRef.current) {
        const dx = s.pointerX - s.x;
        const dy = s.pointerY - s.y;
        const len = Math.hypot(dx, dy) || 1;
        const maxShift = nextMode === "hero" ? 0.6 : 1.6;
        const lookFactor = Math.min(len / 200, 1);
        const cx = (dx / len) * lookFactor * maxShift;
        const cy = (dy / len) * lookFactor * maxShift * 0.6;
        lookRef.current.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      }

      // Periodic blink
      if (blinkRef.current) {
        const t = performance.now() * 0.001;
        const blinkPhase = (t % 4.2) / 4.2;
        let scaleY = 1;
        if (blinkPhase > 0.94 && blinkPhase < 0.98) {
          scaleY = 0.1;
        }
        blinkRef.current.style.transform = `scaleY(${scaleY})`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBubbleKey((k) => k + 1);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setBubble(computeBubble(bubbleKey, state.current.mode));
  }, [bubbleKey, computeBubble]);

  const handleClick = () => {
    const mode = state.current.mode;
    const pool =
      mode === "rest" ? restMessages : mode === "run" ? runMessages : messages;
    const m = pool[Math.floor(Math.random() * pool.length)]!;
    setBubble(m.text);
  };

  return (
    <div
      ref={rootRef}
      className="panda panda-idle panda-show-bubble"
      role="img"
      aria-label="A friendly squirrel mascot named Chip"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="panda-inner">
        <div className="panda-bubble">{bubble}</div>
        <svg viewBox="0 0 140 140" className="panda-svg" aria-hidden="true">
          <ellipse className="panda-shadow" cx="70" cy="130" rx="34" ry="4" />

          {/* Big bushy tail - drawn first so it's behind body */}
          <g className="panda-tail-group">
            <path
              className="panda-tail"
              d="M85 80
                 C 105 70, 122 60, 120 38
                 C 118 22, 105 16, 96 22
                 C 102 28, 104 38, 98 48
                 C 92 58, 80 64, 78 78 Z"
            />
            <path
              className="panda-tail-stripe"
              d="M88 76
                 C 102 70, 114 60, 114 42
                 C 114 32, 108 26, 102 28
                 C 106 34, 106 42, 100 50
                 C 94 58, 86 64, 84 76 Z"
            />
            <path
              className="panda-tail-tuft"
              d="M118 38 q4 -6 10 -4 q-2 6 -10 4 z"
            />
          </g>

          {/* Back legs */}
          <g className="panda-leg panda-leg-l">
            <path d="M52 102 q-4 12 0 18 q5 2 8 -1 q1 -8 3 -16 z" />
            <ellipse className="panda-foot" cx="55" cy="122" rx="6" ry="2.5" />
          </g>
          <g className="panda-leg panda-leg-r">
            <path d="M76 102 q4 12 0 18 q-5 2 -8 -1 q-1 -8 -3 -16 z" />
            <ellipse className="panda-foot" cx="73" cy="122" rx="6" ry="2.5" />
          </g>

          {/* Body */}
          <g className="panda-body">
            <ellipse cx="65" cy="86" rx="26" ry="24" />
            <ellipse className="panda-belly" cx="65" cy="92" rx="16" ry="14" />
          </g>

          {/* Front paws (on body) */}
          <g className="panda-arm panda-arm-l">
            <ellipse cx="44" cy="92" rx="6" ry="8" />
            <ellipse cx="42" cy="99" rx="4" ry="2.5" className="panda-foot" />
          </g>
          <g className="panda-arm panda-arm-r">
            <ellipse cx="86" cy="92" rx="6" ry="8" />
            <ellipse cx="88" cy="99" rx="4" ry="2.5" className="panda-foot" />
          </g>

          {/* Scarf around neck */}
          <g className="panda-scarf">
            <path d="M40 62 q25 -6 50 0 q-2 8 -8 10 q-18 4 -34 0 q-6 -2 -8 -10 z" />
          </g>
          <g className="panda-scarf-tail">
            <path d="M82 68 l5 22 l-7 1 l-3 -22 z" />
            <path d="M86 92 l3 6 l-3 1 l-2 -6 z" />
          </g>

          {/* Ears (behind head) */}
          <g className="panda-ear panda-ear-l">
            <ellipse cx="38" cy="30" rx="9" ry="11" />
            <ellipse className="panda-ear-inner" cx="38" cy="32" rx="4.5" ry="5.5" />
          </g>
          <g className="panda-ear panda-ear-r">
            <ellipse cx="92" cy="30" rx="9" ry="11" />
            <ellipse className="panda-ear-inner" cx="92" cy="32" rx="4.5" ry="5.5" />
          </g>

          {/* Head with snout */}
          <g className="panda-head">
            <ellipse cx="65" cy="46" rx="24" ry="22" />
            <ellipse className="panda-snout" cx="65" cy="55" rx="11" ry="8" />

            {/* Cheek pouches (orange) */}
            <ellipse className="panda-blush" cx="46" cy="55" rx="5" ry="3" />
            <ellipse className="panda-blush" cx="84" cy="55" rx="5" ry="3" />

            {/* Eyes (blinkable) */}
            <g className="panda-blink" ref={blinkRef}>
              <g className="panda-look" ref={lookRef}>
                <circle className="panda-eye" cx="54" cy="44" r="3.2" />
                <circle className="panda-eye-shine" cx="55" cy="43" r="0.9" />
                <circle className="panda-eye" cx="76" cy="44" r="3.2" />
                <circle className="panda-eye-shine" cx="77" cy="43" r="0.9" />
              </g>
            </g>

            {/* Nose */}
            <ellipse className="panda-nose" cx="65" cy="53" rx="2.4" ry="1.8" />
            {/* Mouth */}
            <path className="panda-mouth" d="M65 55 v2.5" />
            <path className="panda-mouth" d="M60 60 q5 4 10 0" />

            {/* Tiny teeth for cute factor */}
            <rect className="panda-tooth" x="63" y="60.5" width="2" height="2" rx="0.5" />
            <rect className="panda-tooth" x="65" y="60.5" width="2" height="2" rx="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
};
