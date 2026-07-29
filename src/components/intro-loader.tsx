"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const COLS = 8;
const ROWS = 5;
const TILE_COUNT = COLS * ROWS;

function tileContent(i: number) {
  if (i % 7 === 0) return "今";
  if (i % 11 === 0) return "⚡";
  return null;
}

function tileColor(i: number) {
  const palette = ["#d9552e", "#111111", "#f4ede4", "#b8431f"];
  return palette[i % palette.length];
}

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: TILE_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-center font-logo text-2xl text-white"
          style={{ backgroundColor: tileColor(i) }}
          initial={{ scale: 1, rotate: 0, opacity: 1 }}
          animate={{ scale: 0, rotate: (i % 2 === 0 ? 1 : -1) * 35, opacity: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 + (i % COLS) * 0.03 + Math.floor(i / COLS) * 0.05,
            ease: "backIn",
          }}
        >
          {tileContent(i)}
        </motion.div>
      ))}
    </div>
  );
}
