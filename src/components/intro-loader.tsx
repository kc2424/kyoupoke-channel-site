"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function IntroLoader() {
  const [phase, setPhase] = useState<"hold" | "reveal" | "done">("done");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // セッション中に1回だけ表示し、2回目以降はスムーズにスキップ
    const hasSeenIntro = sessionStorage.getItem("kyoupoke_intro_seen");
    if (hasSeenIntro) {
      setPhase("done");
      return;
    }

    setPhase("hold");
    sessionStorage.setItem("kyoupoke_intro_seen", "true");

    const toReveal = setTimeout(() => setPhase("reveal"), 450);
    const toDone = setTimeout(() => setPhase("done"), 1100);
    const failsafe = setTimeout(() => setPhase("done"), 2000);

    return () => {
      clearTimeout(toReveal);
      clearTimeout(toDone);
      clearTimeout(failsafe);
    };
  }, [prefersReducedMotion]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="bg-brand-dark pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center overflow-hidden pb-[14vh]"
      initial={{ clipPath: "circle(150% at 50% 100%)" }}
      animate={{
        clipPath:
          phase === "reveal"
            ? "circle(0% at 50% 100%)"
            : "circle(150% at 50% 100%)",
      }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        animate={{ opacity: phase === "reveal" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="relative block h-16 w-16 overflow-hidden rounded-full sm:h-20 sm:w-20 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="今日ポケ"
            className="h-full w-full object-cover"
          />
        </span>
        <span className="animate-pulse text-xs font-bold tracking-[0.3em] text-[#f4ede4] uppercase">
          KYOU POKE
        </span>
      </motion.div>
    </motion.div>
  );
}
