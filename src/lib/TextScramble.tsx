import { useEffect, useRef, useState } from "react";

type TextScrambleProps = {
  text: string;
  className?: string;
  speed?: number;
  scrambleOnHover?: boolean;
};

const GLYPHS = "!<>-_\\/[]{}—=+*^?#|01";

export const TextScramble = ({
  text,
  className,
  speed = 36,
  scrambleOnHover = true,
}: TextScrambleProps) => {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number }>>([]);
  const rafRef = useRef(0);
  const hoverRef = useRef(false);

  const runScramble = (from: string, to: string) => {
    const length = Math.max(from.length, to.length);
    const queue: Array<{ from: string; to: string; start: number; end: number }> = [];
    for (let i = 0; i < length; i++) {
      const start = Math.floor(Math.random() * 8);
      const end = start + Math.floor(Math.random() * 6) + 4;
      queue.push({ from, to, start, end });
    }
    queueRef.current = queue;
    frameRef.current = 0;

    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start, end } = queueRef.current[i]!;
        if (frameRef.current >= end) {
          complete++;
          output += to[i] ?? "";
        } else if (frameRef.current >= start) {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          output += from[i] ?? "";
        }
      }
      setDisplay(output);
      if (complete < queueRef.current.length) {
        frameRef.current++;
        rafRef.current = window.setTimeout(update, speed) as unknown as number;
      } else {
        setDisplay(to);
      }
    };
    window.clearTimeout(rafRef.current);
    update();
  };

  useEffect(() => {
    runScramble(text === display ? text : "", text);
    return () => window.clearTimeout(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleEnter = () => {
    if (!scrambleOnHover) {
      return;
    }
    hoverRef.current = true;
    runScramble(display, text);
  };

  return (
    <span
      className={className}
      data-text={text}
      onMouseEnter={handleEnter}
    >
      {display}
    </span>
  );
};
