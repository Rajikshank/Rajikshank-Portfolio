import { useEffect, useMemo, useRef, useState } from "react";

const IDLE_MS = 700;
const REST_RADIUS = 30;
const MAX_SPEED = 5.5;
const MAX_FORCE = 0.18;
const ARRIVE_RADIUS = 80;
const SLEEP_AFTER_MS = 18000;
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

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const SquirrelMascot = () => {
  const rootRef = useRef<HTMLDivElement>(null);
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
    runPhase: 0,
    runRate: 0,
    nextYawnAt: 0,
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
      let goalX: number;
      let goalY: number;

      if (scrolled && pointerIdle) {
        goalX = s.pointerX;
        goalY = s.pointerY;
        const dist = Math.hypot(goalX - s.x, goalY - s.y);
        nextMode = dist < REST_RADIUS ? "rest" : "run";
      } else if (scrolled) {
        goalX = s.targetX;
        goalY = s.targetY;
      } else {
        setHomeTarget();
        goalX = s.targetX;
        goalY = s.targetY;
      }

      s.mode = nextMode;

      // ---- Reynolds steering: seek / arrive ----
      const dx = goalX - s.x;
      const dy = goalY - s.y;
      const dist = Math.hypot(dx, dy);

      let targetSpeed = MAX_SPEED;
      if (s.mode === "rest" || s.mode === "hero") {
        targetSpeed = 0;
      } else if (dist < ARRIVE_RADIUS) {
        // Arrive behavior: slow down as we approach
        targetSpeed = MAX_SPEED * (dist / ARRIVE_RADIUS);
      }
      targetSpeed = Math.max(targetSpeed, 0);

      const desiredVx = dist > 0.5 ? (dx / dist) * targetSpeed : 0;
      const desiredVy = dist > 0.5 ? (dy / dist) * targetSpeed : 0;

      // Steer = desired - current, capped
      const steerVx = clamp(desiredVx - s.vx, -MAX_FORCE, MAX_FORCE);
      const steerVy = clamp(desiredVy - s.vy, -MAX_FORCE, MAX_FORCE);

      s.vx += steerVx;
      s.vy += steerVy;

      // Clamp to max speed
      const currentSpeed = Math.hypot(s.vx, s.vy);
      if (currentSpeed > MAX_SPEED) {
        s.vx = (s.vx / currentSpeed) * MAX_SPEED;
        s.vy = (s.vy / currentSpeed) * MAX_SPEED;
      }

      // If we're very close and slow, snap to rest
      if (s.mode === "rest" && currentSpeed < 0.05) {
        s.vx = 0;
        s.vy = 0;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // ---- Mood ----
      const timeSincePointer = performance.now() - s.pointerMovedAt;
      const speed = Math.hypot(s.vx, s.vy);
      const isMoving = speed > 0.4;

      let nextMood: Mood;
      if (isMoving) {
        nextMood = "run";
        s.lastMoveAt = performance.now();
      } else if (s.mode === "rest") {
        if (timeSincePointer > 3500) {
          nextMood = "sleep";
        } else {
          nextMood = "sit";
        }
      } else {
        // hero / idle
        if (performance.now() - s.lastMoveAt > SLEEP_AFTER_MS) {
          nextMood = "sleep";
        } else {
          nextMood = "calm";
        }
      }

      // Wake from sleep if user moves
      if (
        nextMood === "sleep" &&
        timeSincePointer < IDLE_MS &&
        Math.hypot(goalX - s.x, goalY - s.y) > WAKE_DISTANCE
      ) {
        nextMood = "alert";
      }

      s.mood = nextMood;

      const prevMood = root.dataset.mood;
      root.dataset.mood = s.mood;
      if (prevMood !== s.mood) {
        setBubbleKey((k) => k + 1);
      }

      const mood = s.mood as Mood;

      root.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;

      const facingLeft = s.vx < -0.1;
      if (facingLeft !== s.facingLeft) {
        s.facingLeft = facingLeft;
        root.classList.toggle("panda-facing-left", facingLeft);
      }

      // ---- Run cycle phase ----
      // Run rate smoothly tracks speed
      const speedNorm = clamp(speed / MAX_SPEED, 0, 1);
      s.runRate = lerp(s.runRate, mood === "run" ? speedNorm : speedNorm * 0.3, 0.12);

      const phaseRate = 3 + s.runRate * 12; // rad/s
      s.runPhase += phaseRate * 0.01667 * dt; // 60fps baseline

      const phase = s.runPhase;
      const amp = 4 + s.runRate * 26; // leg swing amplitude

      // ---- Procedural animations ----
      const t = now * 0.001;

      // Body bob (synced with legs)
      if (innerRef.current) {
        let bob = 0;
        if (mood === "run") {
          // 2 bobs per leg cycle (1 per leg pair)
          bob = Math.abs(Math.sin(phase)) * 4 * s.runRate;
        } else if (mood === "calm") {
          bob = Math.sin(t * 2.2) * 1.8;
        } else if (mood === "sit") {
          bob = Math.sin(t * 1.4) * 0.6;
        } else if (mood === "sleep") {
          bob = Math.sin(t * 0.9) * 0.4;
        } else if (mood === "alert") {
          bob = Math.sin(t * 3) * 1.2;
        } else if (mood === "play") {
          bob = Math.abs(Math.sin(t * 5)) * 6;
        }
        innerRef.current.style.setProperty("--bob", `${bob.toFixed(2)}px`);
      }

      // Body squash/stretch
      let scaleX = 1;
      let scaleY = 1;
      if (mood === "run") {
        const sq = Math.sin(phase);
        scaleX = 1 + sq * 0.04 * s.runRate;
        scaleY = 1 - sq * 0.03 * s.runRate;
      } else if (mood === "calm") {
        scaleX = 1 + Math.sin(t * 2.2) * 0.012;
        scaleY = 1 + Math.sin(t * 2.2 + 1) * 0.015;
      } else if (mood === "sleep") {
        scaleY = 1 + Math.sin(t * 0.9) * 0.02;
      }
      // Apply forward lean proportional to horizontal velocity
      const lean = clamp(s.vx * 1.4, -14, 14);
      if (bodyGroupRef.current) {
        const rx = (lean * 0.6).toFixed(2);
        const sx = scaleX.toFixed(3);
        const sy = scaleY.toFixed(3);
        bodyGroupRef.current.style.transform = `rotate(${rx}deg) scale(${sx}, ${sy})`;
      }

      // Head bob + look
      if (headRef.current) {
        let headTilt = 0;
        let headBobY = 0;
        if (mood === "run") {
          headBobY = Math.sin(phase) * 1.5 * s.runRate;
          headTilt = -lean * 0.3 + Math.sin(t * 4) * 1.5;
        } else if (mood === "calm") {
          headTilt = Math.sin(t * 0.7) * 3 + Math.sin(t * 0.27) * 3;
        } else if (mood === "sit") {
          headTilt = Math.sin(t * 1.1) * 2;
        } else if (mood === "sleep") {
          headTilt = -3;
        } else if (mood === "alert") {
          headTilt = -5;
        } else if (mood === "play") {
          headTilt = Math.sin(t * 7) * 4;
        }
        // Look at cursor (smoothed)
        const lookDx = s.pointerX - s.x;
        const lookDy = s.pointerY - s.y;
        const lookLen = Math.hypot(lookDx, lookDy) || 1;
        const lookN = Math.min(lookLen / 200, 1);
        const headLookX = (lookDx / lookLen) * lookN * 3;
        const headLookY = (lookDy / lookLen) * lookN * 1.5;
        headRef.current.style.transform = `translate(${(headLookX + 0).toFixed(2)}px, ${(
          headLookY + headBobY
        ).toFixed(2)}px) rotate(${headTilt.toFixed(2)}deg)`;
      }

      // Tail
      if (tailGroupRef.current) {
        let rot = 0;
        if (mood === "calm") rot = Math.sin(t * 1.4) * 10;
        else if (mood === "run") rot = -8 + Math.sin(t * 9) * 18 * s.runRate;
        else if (mood === "sit") rot = Math.sin(t * 2.4) * 18;
        else if (mood === "sleep") rot = -25 + Math.sin(t * 0.7) * 2;
        else if (mood === "alert") rot = -18;
        else if (mood === "play") rot = Math.sin(t * 12) * 30;
        tailGroupRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (tailTuftRef.current) {
        let rot = 0;
        if (mood === "calm") rot = Math.sin(t * 1.4 + 0.3) * 14;
        else if (mood === "run") rot = Math.sin(t * 9 + 0.3) * 22 * s.runRate;
        else if (mood === "sit") rot = Math.sin(t * 2.4 + 0.3) * 20;
        else if (mood === "sleep") rot = Math.sin(t * 0.7 + 0.3) * 1.5;
        else if (mood === "play") rot = Math.sin(t * 12 + 0.3) * 32;
        tailTuftRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (tailStripeRef.current) {
        let rot = 0;
        if (mood === "calm") rot = Math.sin(t * 1.4 + 0.15) * 8;
        else if (mood === "run") rot = Math.sin(t * 9 + 0.15) * 16 * s.runRate;
        else if (mood === "sit") rot = Math.sin(t * 2.4 + 0.15) * 14;
        else if (mood === "sleep") rot = Math.sin(t * 0.7 + 0.15) * 1.5;
        tailStripeRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }

      // Legs (gallop in pairs)
      if (legLRef.current) {
        const a = mood === "run" ? Math.sin(phase) * amp : mood === "sleep" ? -22 : 0;
        legLRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (legRRef.current) {
        const a = mood === "run" ? Math.sin(phase + Math.PI) * amp : mood === "sleep" ? 8 : 0;
        legRRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Arms
      if (armLRef.current) {
        let a = 0;
        if (mood === "run") a = Math.sin(phase + Math.PI) * (amp * 0.9);
        else if (mood === "calm") a = Math.sin(t * 2.4) * 10;
        else if (mood === "sit") a = Math.sin(t * 1.8) * 6;
        else if (mood === "play") a = Math.sin(t * 8) * 18;
        armLRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (armRRef.current) {
        let a = 0;
        if (mood === "run") a = Math.sin(phase) * (amp * 0.9);
        else if (mood === "calm") a = Math.sin(t * 2.4 + 0.4) * 8;
        else if (mood === "sit") a = Math.sin(t * 1.8 + 0.4) * 6;
        else if (mood === "play") a = Math.sin(t * 8 + 0.4) * 18;
        armRRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Ears
      if (earLRef.current) {
        let rot = 0;
        if (mood === "calm") rot = Math.sin(t * 1.8) * 4;
        else if (mood === "run") rot = -lean * 0.4 - 6 - s.runRate * 6;
        else if (mood === "sit") rot = 3;
        else if (mood === "sleep") rot = 5;
        else if (mood === "alert") rot = -10;
        else if (mood === "play") rot = Math.sin(t * 9) * 8;
        earLRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (earRRef.current) {
        let rot = 0;
        if (mood === "calm") rot = Math.sin(t * 1.8 + 0.3) * -4;
        else if (mood === "run") rot = -lean * 0.4 - 4 - s.runRate * 6;
        else if (mood === "sit") rot = 3;
        else if (mood === "sleep") rot = 7;
        else if (mood === "alert") rot = -12;
        else if (mood === "play") rot = Math.sin(t * 9 + 0.3) * 8;
        earRRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }

      // Scarf
      if (scarfRef.current) {
        const a = mood === "run" ? Math.sin(t * 7) * 6 * s.runRate : mood === "calm" ? Math.sin(t * 2) * 1.2 : 0;
        scarfRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }
      if (scarfTailRef.current) {
        const a = mood === "run" ? Math.sin(t * 7 + 0.5) * 14 * s.runRate : mood === "calm" ? Math.sin(t * 2 + 0.5) * 3 : mood === "sleep" ? -8 : 0;
        scarfTailRef.current.style.transform = `rotate(${a.toFixed(2)}deg)`;
      }

      // Eyes look
      if (lookRef.current) {
        const lookDx = s.pointerX - s.x;
        const lookDy = s.pointerY - s.y;
        const lookLen = Math.hypot(lookDx, lookDy) || 1;
        const maxShift = mood === "sleep" ? 0 : mood === "calm" ? 0.6 : 1.8;
        const lookFactor = Math.min(lookLen / 200, 1);
        const cx = (lookDx / lookLen) * lookFactor * maxShift;
        const cy = (lookDy / lookLen) * lookFactor * maxShift * 0.6;
        lookRef.current.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      }

      // Blink
      if (blinkRef.current) {
        const phase = (t * 0.22) % 1;
        let scaleY = 1;
        if (mood === "sleep") {
          scaleY = 0.05;
        } else if (phase > 0.93 && phase < 0.985) {
          const e = (phase - 0.93) / 0.055;
          scaleY = 1 - easeOut(e) * 0.95;
        }
        blinkRef.current.style.transform = `scaleY(${scaleY.toFixed(3)})`;
      }

      // Mouth
      if (mouthRef.current) {
        if (mood === "sleep") {
          mouthRef.current.setAttribute("d", "M75 68 q5 1 10 0");
        } else if (mood === "run") {
          mouthRef.current.setAttribute("d", "M73 68 q7 6 14 0");
        } else if (mood === "play") {
          mouthRef.current.setAttribute("d", "M72 67 q8 7 16 0");
        } else {
          mouthRef.current.setAttribute("d", "M75 68 q5 4 10 0");
        }
      }

      // Dust
      if (dustLayerRef.current && mood === "run" && s.runRate > 0.4 && now - lastDust > 100) {
        lastDust = now;
        const dust = document.createElement("span");
        dust.className = "dust";
        dust.style.left = `${10 + Math.random() * 30}px`;
        dust.style.bottom = `${10 + Math.random() * 8}px`;
        dustLayerRef.current.appendChild(dust);
        window.setTimeout(() => dust.remove(), 900);
      }

      // Z's
      if (zLayerRef.current && mood === "sleep" && Math.random() < 0.03) {
        const z = document.createElement("span");
        z.className = "zzz";
        z.textContent = "z";
        z.style.left = `${20 + Math.random() * 30}px`;
        z.style.bottom = "60px";
        z.style.fontSize = `${10 + Math.random() * 6}px`;
        zLayerRef.current.appendChild(z);
        window.setTimeout(() => z.remove(), 2800);
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
    window.setTimeout(() => {
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

          <g
            ref={bodyGroupRef}
            className="panda-body-wrap"
            style={{ transformOrigin: "80px 105px" }}
          >
            <ellipse className="panda-body" cx="80" cy="105" rx="30" ry="26" fill="url(#fox-body)" />
            <ellipse className="panda-belly" cx="80" cy="112" rx="18" ry="14" fill="url(#fox-belly)" />
          </g>

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
