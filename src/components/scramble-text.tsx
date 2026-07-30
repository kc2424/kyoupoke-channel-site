"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "アイウエオカキクケコサシスセソタチツテト0123456789#%&*";
const STEPS = 10;
const STEP_MS = 35;

type ScrambleTextProps = {
  text: string;
  active: boolean;
  className?: string;
};

export function ScrambleText({ text, active, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const chars = Array.from(text);
    let progress = 0;

    const step = () => {
      progress += 1;
      const revealed = Math.floor((progress / STEPS) * chars.length);
      setDisplay(
        chars
          .map((c, i) => {
            if (c === " " || i < revealed) return c;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      if (progress < STEPS) {
        timeoutRef.current = window.setTimeout(step, STEP_MS);
      }
    };

    step();

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, text]);

  return <span className={className}>{display}</span>;
}
