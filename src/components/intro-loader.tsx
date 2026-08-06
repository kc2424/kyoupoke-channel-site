"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroLoader() {
  const [phase, setPhase] = useState<"hold" | "reveal" | "done">("hold");
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    // 0% から 100% への滑らかなカウントアップ
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 20);

    const toReveal = setTimeout(() => setPhase("reveal"), 950);
    const toDone = setTimeout(() => setPhase("done"), 1850);
    const failsafe = setTimeout(() => setPhase("done"), 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(toReveal);
      clearTimeout(toDone);
      clearTimeout(failsafe);
    };
  }, [prefersReducedMotion]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2e1008] via-[#1a0804] to-[#0d0301] text-white"
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      animate={{
        clipPath:
          phase === "reveal"
            ? "circle(0% at 50% 50%)"
            : "circle(150% at 50% 50%)",
      }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* 華やかな回転グラデーション背景リング */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-gradient-to-r from-[#d9552e]/30 via-[#ffd7a6]/20 to-[#d9552e]/30 blur-3xl sm:h-[600px] sm:w-[600px]"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        animate={{ opacity: phase === "reveal" ? 0 : 1, scale: phase === "reveal" ? 0.9 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* アイコン＋二重回転オーラ */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border-2 border-dashed border-[#d9552e]/70"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-brand/40"
          />

          <span className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-white/90 shadow-2xl sm:h-24 sm:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="今日ポケ"
              className="h-full w-full object-cover"
            />
          </span>
        </div>

        {/* ブランドロゴ ＆ プログレス表示 */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-wordmark text-brand text-2xl tracking-wider drop-shadow-md sm:text-4xl">
            KYOU POKE
          </span>
          <span className="text-xs font-black tracking-[0.3em] text-white/80 uppercase">
            FAN SITE READY...
          </span>
        </div>

        {/* プログレスバー ＆ カウント数値 */}
        <div className="mt-2 flex flex-col items-center gap-2">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10 p-0.5 sm:w-64">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand via-[#ffd7a6] to-brand"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-brand">{progress}%</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
