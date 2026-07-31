"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function IntroLoader() {
  const [phase, setPhase] = useState<"hold" | "reveal" | "done">("hold");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }
    const toReveal = setTimeout(() => setPhase("reveal"), 850);
    const toDone = setTimeout(() => setPhase("done"), 1750);
    // 万一アニメーションが詰まっても確実に消えるようにする保険
    const failsafe = setTimeout(() => setPhase("done"), 3500);
    return () => {
      clearTimeout(toReveal);
      clearTimeout(toDone);
      clearTimeout(failsafe);
    };
  }, [prefersReducedMotion]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="bg-brand pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center overflow-hidden pb-[14vh]"
      initial={{ clipPath: "circle(150% at 50% 100%)" }}
      animate={{
        clipPath:
          phase === "reveal"
            ? "circle(0% at 50% 100%)"
            : "circle(150% at 50% 100%)",
      }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="flex flex-col items-center gap-5"
        animate={{ opacity: phase === "reveal" ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <span className="relative block h-16 w-16 animate-pulse overflow-hidden rounded-full sm:h-20 sm:w-20">
          <Image src="/icon.png" alt="今日ポケ" fill priority sizes="80px" className="object-cover" />
        </span>
        <span className="animate-pulse text-xs font-bold tracking-[0.3em] text-[#f4ede4] uppercase">
          KYOU POKE
        </span>
      </motion.div>
    </motion.div>
  );
}
