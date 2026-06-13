import { useEffect, useMemo, useRef, useState } from "react";

const IDLE_MS = 700;
const SPRING = 0.05;
const DAMPING = 0.78;
const REST_RADIUS = 26;
const SLEEP_AFTER_MS = 18000; // 18s of true idle -> sleep
const WAKE_DISTANCE = 80;

type Mood = "calm" | "alert" | "run" | "sit" | "sleep" | "play";
type BubbleMessage = { text: string };

const messages: BubbleMessage[] = [
  { text: "Welcome. Stay a while." },
  { text: "I'll follow along." },
  { text: "Open to junior roles." },
  { text: "Click me. Different line." },
  { text: "Coffee. TypeScript. Repeat." },
];

const sitMessages: BubbleMessage[] = [
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

const sleepMessages: BubbleMessage[] = [
  { text: "zzz…" },
  { text: "shhh. sleeping." },
  { text: "*yawn*" },
];

export const SquirrelMascot = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lookRef = useRef<SVGGElement>(null);
  const blinkRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const tailGroupRef = useRef<SVGGElement>(null);
  const tailStripeRef = useRef<SVGGElement>(null);
  const tailTuftRef = useRef<SVGGElement>(null);
  const bodyGroupRef = useRef<SVGGElement>(null);
  const legLRef = useRef<SVGGElement>(null);
  const legRRef = useRef<SVGGElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const earLRef = useRef<SVGGElement>(null);
  const earRRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const scarfRef = useRef<SVGGElement>(null);
  const scarfTailRef = useRef<SVGGElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dustLayerRef = useRef<HTMLDivElement>(null);
  const zLayerRef = useRef<HTMLDivElement>(null);

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
    lastMoveAt: 0,
    yawningUntil: 0,
    nextYawnAt: 0,
    nextLookAt: 0,
    lookTarget: { x: 0, y: 0 },
  });

  const [bubbleKey, setBubbleKey] = useState(0);
  const [bubble, setBubble] = useState(messages[0]!.text);

  const computeBubble = useMemo(() => {
    return (key: number, mood: Mood) => {
      const pool =
        mood === "sleep"
          ? sleepMessages
          : mood === "sit"
            ? sitMessages
            : mood === "run"
              ? runMessages
              : messages;
      if (key === 0) {
        return pool[0]!.text;
      }
      return pool[key % pool.length]!.text;
    };
  }, []);

  useEffect(() => {
    setBubble(computeBubble(bubbleKey, state.current.mood));
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
        const w = root.offsetWidth || 96;
        const h = root.offsetHeight || 96;
        return {
          x: rect.left + rect.width * 0.5 - w / 2,
          y: rect.top + rect.height * 0.55 - h / 2,
        };
      }
      return { x: window.innerWidth - 160, y: 260 };
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
    state.current.pointerX = initial.x + 80;
    state.current.pointerY = initial.y - 40;
    state.current.pointerMovedAt = performance.now();
    state.current.lastMoveAt = performance.now();
    state.current.nextYawnAt = performance.now() + 7000;
    state.current.nextLookAt = performance.now() + 3000;

    const onPointerMove = (event: PointerEvent) => {
      const w = root.offsetWidth || 96;
      const h = root.offsetHeight || 96;
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

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let lastDust = 0;
    let lastFrameTime = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - lastFrameTime) / 16.67, 2);
      lastFrameTime = now;
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
      const speed = Math.hypot(s.vx, s.vy);

      // Mood logic
      const timeSinceMove = performance.now() - s.lastMoveAt;
      const timeSincePointerMove = performance.now() - s.pointerMovedAt;

      if (s.mode === "hero") {
        if (timeSinceMove > SLEEP_AFTER_MS) {
          s.mood = "sleep";
        } else {
          s.mood = s.mode === "hero" ? "calm" : s.mood;
        }
      } else if (s.mode === "run") {
        s.mood = "run";
        s.lastMoveAt = performance.now();
      } else {
        // rest
        if (timeSinceMove > SLEEP_AFTER_MS && timeSincePointerMove > IDLE_MS) {
          s.mood = "sleep";
        } else if (timeSincePointerMove > 3500) {
          s.mood = "sleep";
        } else {
          s.mood = "sit";
        }
        s.lastMoveAt = performance.now();
      }

      // Apply class
      const prevMood = root.dataset.mood;
      root.dataset.mood = s.mood;
      if (prevMood !== s.mood) {
        setBubbleKey((k) => k + 1);
      }

      // Physics
      const spring = s.mood === "run" ? SPRING * 1.6 : SPRING;
      const ax = (targetX - s.x) * spring;
      const ay = (targetY - s.y) * spring;
      s.vx = (s.vx + ax) * DAMPING;
      s.vy = (s.vy + ay) * DAMPING;

      if (s.mood === "sit" || s.mood === "sleep") {
        s.vx *= 0.78;
        s.vy *= 0.78;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // Wake from sleep if pointer is far
      if (s.mood === "sleep" && s.mode === "rest" && timeSincePointerMove < IDLE_MS) {
        const dist = Math.hypot(targetX - s.x, targetY - s.y);
        if (dist > WAKE_DISTANCE) {
          s.mood = "alert";
        }
      }

      root.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;

      const facingLeft = s.vx < -0.05;
      if (facingLeft !== s.facingLeft) {
        s.facingLeft = facingLeft;
        root.classList.toggle("panda-facing-left", facingLeft);
      }

      // ----- Procedural animations -----
      const t = now * 0.001;

      // Body bob
      if (innerRef.current) {
        let bob = 0;
        if (s.mood === "calm") {
          bob = Math.sin(t * 2.2) * 2.2;
        } else if (s.mood === "run") {
          bob = Math.abs(Math.sin(t * 12)) * 5;
        } else if (s.mood === "sit") {
          bob = Math.sin(t * 1.4) * 0.8;
        } else if (s.mood === "sleep") {
          bob = Math.sin(t * 0.9) * 0.6;
        } else if (s.mood === "alert") {
          bob = Math.sin(t * 3) * 1.5;
        }
        innerRef.current.style.setProperty("--bob", `${bob.toFixed(2)}px`);
      }

      // Body squash/stretch
      let scaleX = 1, scaleY = 1;
      if (s.mood === "run") {
        const gallop = t * 12;
        const sq = Math.sin(gallop);
        scaleX = 1 + sq * 0.06;
        scaleY = 1 - sq * 0.05;
      } else if (s.mood === "calm") {
        scaleX = 1 + Math.sin(t * 2.2) * 0.012;
        scaleY = 1 + Math.sin(t * 2.2 + 1) * 0.018;
      } else if (s.mood === "sleep") {
        scaleY = 1 + Math.sin(t * 0.9) * 0.025;
        scaleX = 1 - Math.sin(t * 0.9) * 0.015;
      } else if (s.mood === "alert") {
        scaleY = 1.02;
      }

      // Body lean based on velocity
      const lean = Math.max(-14, Math.min(14, s.vx * 2));
      if (bodyGroupRef.current) {
        const rx = (lean * 0.5).toFixed(2);
        const sx = scaleX.toFixed(3);
        const sy = scaleY.toFixed(3);
        bodyGroupRef.current.style.transform = `rotate(${rx}deg) scale(${sx}, ${sy})`;
      }

      // Head
      if (headRef.current) {
        let headTilt = 0;
        if (s.mood === "calm") {
          headTilt = Math.sin(t * 0.9) * 3 + (s.mood === "calm" ? Math.sin(t * 0.27) * 4 : 0);
        } else if (s.mood === "run") {
          headTilt = Math.sin(t * 12) * 4 - lean * 0.3;
        } else if (s.mood === "sit") {
          headTilt = Math.sin(t * 1.1) * 2;
        } else if (s.mood === "sleep") {
          headTilt = 0;
        } else if (s.mood === "alert") {
          headTilt = -4;
        }
        // Add a "look at cursor" small offset
        const dx = s.pointerX - s.x;
        const dy = s.pointerY - s.y;
        const len = Math.hypot(dx, dy) || 1;
        const lookN = Math.min(len / 200, 1);
        const headLookX = (dx / len) * lookN * 4;
        const headLookY = (dy / len) * lookN * 2;
        headRef.current.style.transform = `translate(${headLookX.toFixed(2)}px, ${headLookY.toFixed(2)}px) rotate(${headTilt.toFixed(2)}deg)`;
      }

      // Tail
      if (tailGroupRef.current) {
        let baseRot = 0;
        if (s.mood === "calm") baseRot = Math.sin(t * 1.4) * 12;
        else if (s.mood === "run") baseRot = -10 + Math.sin(t * 9) * 20;
        else if (s.mood === "sit") baseRot = Math.sin(t * 2.4) * 20;
        else if (s.mood === "sleep") baseRot = -30 + Math.sin(t * 0.7) * 3;
        else if (s.mood === "alert") baseRot = -20;
        tailGroupRef.current.style.transform = `rotate(${baseRot.toFixed(2)}deg)`;
      }
      if (tailTuftRef.current) {
        let rot = 0;
        if (s.mood === "calm") rot = Math.sin(t * 1.4 + 0.3) * 16;
        else if (s.mood === "run") rot = Math.sin(t * 9 + 0.3) * 24;
        else if (s.mood === "sit") rot = Math.sin(t * 2.4 + 0.3) * 22;
        else if (s.mood === "sleep") rot = Math.sin(t * 0.7 + 0.3) * 2;
        else if (s.mood === "alert") rot = -8;
        tailTuftRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (tailStripeRef.current) {
        let rot = 0;
        if (s.mood === "calm") rot = Math.sin(t * 1.4 + 0.15) * 10;
        else if (s.mood === "run") rot = Math.sin(t * 9 + 0.15) * 18;
        else if (s.mood === "sit") rot = Math.sin(t * 2.4 + 0.15) * 16;
        else if (s.mood === "sleep") rot = Math.sin(t * 0.7 + 0.15) * 2;
        else if (s.mood === "alert") rot = -6;
        tailStripeRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }

      // Legs - gallop in pairs (front-left + back-left, then front-right + back-right)
      const gallopT = t * 11;
      if (legLRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(gallopT) * 28
            : s.mood === "sleep"
              ? -25
              : 0;
        legLRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (legRRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(gallopT + Math.PI) * 28
            : s.mood === "sleep"
              ? 10
              : 0;
        legRRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Arms
      if (armLRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(gallopT + Math.PI) * 26
            : s.mood === "calm"
              ? Math.sin(t * 2.4) * 12
              : s.mood === "sit"
                ? Math.sin(t * 1.8) * 8
                : 0;
        armLRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (armRRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(gallopT) * 26
            : s.mood === "calm"
              ? Math.sin(t * 2.4 + 0.4) * 10
              : s.mood === "sit"
                ? Math.sin(t * 1.8 + 0.4) * 8
                : 0;
        armRRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Ears
      if (earLRef.current) {
        let rot = 0;
        if (s.mood === "calm") rot = Math.sin(t * 1.8) * 4;
        else if (s.mood === "run") rot = -lean * 0.4 - 8;
        else if (s.mood === "sit") rot = 4;
        else if (s.mood === "sleep") rot = 6;
        else if (s.mood === "alert") rot = -10;
        earLRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (earRRef.current) {
        let rot = 0;
        if (s.mood === "calm") rot = Math.sin(t * 1.8 + 0.3) * -4;
        else if (s.mood === "run") rot = -lean * 0.4 - 6;
        else if (s.mood === "sit") rot = 4;
        else if (s.mood === "sleep") rot = 8;
        else if (s.mood === "alert") rot = -12;
        earRRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }

      // Scarf
      if (scarfRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(t * 7) * 8
            : s.mood === "calm"
              ? Math.sin(t * 2) * 1.5
              : 0;
        scarfRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (scarfTailRef.current) {
        const a =
          s.mood === "run"
            ? Math.sin(t * 7 + 0.5) * 16
            : s.mood === "calm"
              ? Math.sin(t * 2 + 0.5) * 4
              : s.mood === "sleep"
                ? -10
                : 0;
        scarfTailRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Eyes look
      if (lookRef.current) {
        const dx = s.pointerX - s.x;
        const dy = s.pointerY - s.y;
        const len = Math.hypot(dx, dy) || 1;
        const maxShift = s.mood === "sleep" ? 0 : s.mood === "calm" ? 0.6 : 1.8;
        const lookFactor = Math.min(len / 200, 1);
        const cx = (dx / len) * lookFactor * maxShift;
        const cy = (dy / len) * lookFactor * maxShift * 0.6;
        lookRef.current.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      }

      // Blink
      if (blinkRef.current) {
        const phase = (t * 0.22) % 1;
        let scaleY = 1;
        if (s.mood === "sleep") {
          scaleY = 0.05;
        } else if (phase > 0.93 && phase < 0.985) {
          const e = (phase - 0.93) / 0.055;
          scaleY = 1 - easeOut(e) * 0.95;
        }
        blinkRef.current.style.transform = `scaleY(${scaleY.toFixed(3)})`;
      }

      // Mouth
      if (mouthRef.current) {
        if (s.mood === "sleep") {
          mouthRef.current.setAttribute("d", "M75 68 q5 1 10 0");
        } else if (s.mood === "run") {
          mouthRef.current.setAttribute("d", "M73 68 q7 6 14 0");
        } else {
          mouthRef.current.setAttribute("d", "M75 68 q5 4 10 0");
        }
      }

      // Dust trail when running
      if (dustLayerRef.current) {
        if (s.mood === "run" && speed > 0.5 && now - lastDust > 90) {
          lastDust = now;
          const dust = document.createElement("span");
          dust.className = "dust";
          dust.style.left = `${10 + Math.random() * 30}px`;
          dust.style.bottom = `${10 + Math.random() * 8}px`;
          dustLayerRef.current.appendChild(dust);
          window.setTimeout(() => dust.remove(), 900);
        }
      }

      // Z's when sleeping
      if (zLayerRef.current) {
        if (s.mood === "sleep" && Math.random() < 0.025) {
          const z = document.createElement("span");
          z.className = "zzz";
          z.textContent = "z";
          z.style.left = `${20 + Math.random() * 30}px`;
          z.style.bottom = "60px";
          z.style.fontSize = `${10 + Math.random() * 6}px`;
          zLayerRef.current.appendChild(z);
          window.setTimeout(() => z.remove(), 2800);
        }
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
      // Only cycle in calm mood
      if (state.current.mood === "calm" || state.current.mood === "sit") {
        setBubbleKey((k) => k + 1);
      }
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setBubble(computeBubble(bubbleKey, state.current.mood));
  }, [bubbleKey, computeBubble]);

  const handleClick = () => {
    const m = state.current;
    m.mood = "play";
    m.lastMoveAt = performance.now();
    if (rootRef.current) {
      rootRef.current.dataset.mood = "play";
    }
    setTimeout(() => {
      if (state.current.mood === "play") {
        state.current.mood = state.current.mode === "hero" ? "calm" : "sit";
        if (rootRef.current) {
          rootRef.current.dataset.mood = state.current.mood;
        }
        setBubbleKey((k) => k + 1);
      }
    }, 1400);
    const pool =
      m.mode === "rest" ? sitMessages : m.mode === "run" ? runMessages : messages;
    const next = pool[Math.floor(Math.random() * pool.length)]!;
    setBubble(next.text);
  };

  return (
    <div
      ref={rootRef}
      className="panda"
      data-mood="calm"
      role="img"
      aria-label="A friendly fox mascot"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div ref={innerRef} className="panda-inner" style={{ transform: "translateY(var(--bob, 0))" }}>
        <div className="panda-bubble">{bubble}</div>
        <div className="panda-dust" ref={dustLayerRef} aria-hidden="true" />
        <div className="panda-zzz" ref={zLayerRef} aria-hidden="true" />
        <svg
          ref={svgRef}
          viewBox="0 0 160 150"
          className="panda-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="fox-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e58f4a" />
              <stop offset="100%" stopColor="#c46426" />
            </linearGradient>
            <linearGradient id="fox-head" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec9b58" />
              <stop offset="100%" stopColor="#cf6c2a" />
            </linearGradient>
            <linearGradient id="fox-tail" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e89248" />
              <stop offset="100%" stopColor="#b85519" />
            </linearGradient>
            <radialGradient id="fox-belly" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#fff3df" />
              <stop offset="100%" stopColor="#f4d8a8" />
            </radialGradient>
          </defs>

          <ellipse className="panda-shadow" cx="80" cy="142" rx="38" ry="4.5" />

          {/* Tail */}
          <g
            ref={tailGroupRef}
            className="panda-tail-wrap"
            style={{ transformOrigin: "110px 105px" }}
          >
            <path
              className="panda-tail"
              d="M108 110
                 C 130 95, 148 75, 144 50
                 C 140 28, 118 22, 110 38
                 C 116 46, 118 58, 110 70
                 C 102 82, 92 92, 96 108 Z"
            />
            <g ref={tailTuftRef} style={{ transformOrigin: "130px 38px" }}>
              <ellipse className="panda-tail-tuft" cx="138" cy="36" rx="11" ry="8" />
            </g>
            <g ref={tailStripeRef} style={{ transformOrigin: "108px 88px" }}>
              <path
                className="panda-tail-stripe"
                d="M108 100
                   C 124 88, 134 76, 132 60
                   C 130 50, 124 46, 120 50
                   C 122 56, 120 64, 112 72
                   C 104 80, 98 88, 102 100 Z"
              />
            </g>
          </g>

          {/* Back legs */}
          <g
            ref={legLRef}
            className="panda-leg panda-leg-l"
            style={{ transformOrigin: "70px 118px" }}
          >
            <ellipse cx="68" cy="124" rx="9" ry="13" className="panda-leg-shape" />
            <ellipse cx="68" cy="136" rx="8" ry="3.2" className="panda-foot" />
          </g>
          <g
            ref={legRRef}
            className="panda-leg panda-leg-r"
            style={{ transformOrigin: "92px 118px" }}
          >
            <ellipse cx="92" cy="124" rx="9" ry="13" className="panda-leg-shape" />
            <ellipse cx="92" cy="136" rx="8" ry="3.2" className="panda-foot" />
          </g>

          {/* Body */}
          <g
            ref={bodyGroupRef}
            className="panda-body-wrap"
            style={{ transformOrigin: "80px 105px" }}
          >
            <ellipse className="panda-body" cx="80" cy="105" rx="30" ry="26" fill="url(#fox-body)" />
            <ellipse className="panda-belly" cx="80" cy="112" rx="18" ry="14" fill="url(#fox-belly)" />
          </g>

          {/* Front paws */}
          <g
            ref={armLRef}
            className="panda-arm panda-arm-l"
            style={{ transformOrigin: "58px 100px" }}
          >
            <ellipse cx="56" cy="108" rx="7" ry="10" className="panda-arm-shape" />
            <ellipse cx="55" cy="117" rx="5.5" ry="2.5" className="panda-foot" />
          </g>
          <g
            ref={armRRef}
            className="panda-arm panda-arm-r"
            style={{ transformOrigin: "104px 100px" }}
          >
            <ellipse cx="104" cy="108" rx="7" ry="10" className="panda-arm-shape" />
            <ellipse cx="105" cy="117" rx="5.5" ry="2.5" className="panda-foot" />
          </g>

          {/* Scarf */}
          <g ref={scarfRef} style={{ transformOrigin: "80px 76px" }}>
            <path
              className="panda-scarf"
              d="M52 76
                 C 60 70, 100 70, 108 76
                 C 108 84, 102 88, 80 88
                 C 58 88, 52 84, 52 76 Z"
            />
            <path
              className="panda-scarf-shadow"
              d="M52 76
                 C 60 70, 100 70, 108 76
                 C 108 78, 106 80, 100 80
                 C 60 80, 54 78, 52 76 Z"
            />
          </g>
          <g ref={scarfTailRef} style={{ transformOrigin: "100px 84px" }}>
            <path
              className="panda-scarf-tail"
              d="M100 84
                 L 106 110
                 L 102 122
                 L 98 110
                 L 96 86 Z"
            />
          </g>

          {/* Ears */}
          <g
            ref={earLRef}
            className="panda-ear panda-ear-l"
            style={{ transformOrigin: "50px 38px" }}
          >
            <path
              d="M48 50
                 C 42 38, 42 22, 50 18
                 C 58 22, 60 36, 56 50 Z"
              className="panda-ear-shape"
            />
            <path
              d="M50 46
                 C 47 38, 48 26, 53 24
                 C 57 28, 57 38, 54 46 Z"
              className="panda-ear-inner"
            />
          </g>
          <g
            ref={earRRef}
            className="panda-ear panda-ear-r"
            style={{ transformOrigin: "112px 38px" }}
          >
            <path
              d="M112 50
                 C 118 38, 118 22, 110 18
                 C 102 22, 100 36, 104 50 Z"
              className="panda-ear-shape"
            />
            <path
              d="M110 46
                 C 113 38, 112 26, 107 24
                 C 103 28, 103 38, 106 46 Z"
              className="panda-ear-inner"
            />
          </g>

          {/* Head */}
          <g
            ref={headRef}
            className="panda-head-wrap"
            style={{ transformOrigin: "80px 50px" }}
          >
            <ellipse
              className="panda-head"
              cx="80"
              cy="50"
              rx="34"
              ry="30"
              fill="url(#fox-head)"
            />
            <path
              d="M58 56
                 C 60 70, 70 80, 80 80
                 C 90 80, 100 70, 102 56
                 C 98 50, 62 50, 58 56 Z"
              className="panda-face"
            />
            <ellipse className="panda-blush" cx="62" cy="64" rx="6" ry="3.5" />
            <ellipse className="panda-blush" cx="98" cy="64" rx="6" ry="3.5" />

            <g
              ref={blinkRef}
              className="panda-blink"
              style={{ transformOrigin: "80px 50px" }}
            >
              <g ref={lookRef} className="panda-look">
                <ellipse className="panda-eye" cx="68" cy="50" rx="3.2" ry="4" />
                <circle className="panda-eye-shine" cx="69.2" cy="48.5" r="0.9" />
                <circle className="panda-eye-shine-sm" cx="66.6" cy="51" r="0.5" />
                <ellipse className="panda-eye" cx="92" cy="50" rx="3.2" ry="4" />
                <circle className="panda-eye-shine" cx="93.2" cy="48.5" r="0.9" />
                <circle className="panda-eye-shine-sm" cx="90.6" cy="51" r="0.5" />
              </g>
            </g>

            <path className="panda-nose" d="M76 60 Q 80 64 84 60 Q 80 66 76 60 Z" />
            <path className="panda-mouth" d="M80 64 v3" />
            <path ref={mouthRef} className="panda-mouth-mouth" d="M75 68 q5 4 10 0" />
          </g>
        </svg>
      </div>
    </div>
  );
};
