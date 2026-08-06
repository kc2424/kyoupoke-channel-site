"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export function IntroLoader() {
  const [phase, setPhase] = useState<"hold" | "reveal" | "done">("hold");
  const prefersReducedMotion = useReducedMotion();

  // 100個のダイナミック・アイコン大群データを生成（パフォーマンス最適化のためmemo化）
  const iconsStream = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: 32 + (i * 7) % 60, // 32px 〜 92px
      top: `${(i * 1.02) % 98}%`, // 0% 〜 98% の画面全域
      duration: 0.9 + (i % 8) * 0.12, // 0.9s 〜 1.8s
      delay: (i % 12) * 0.05, // 0s 〜 0.6s
      rotate: ((i * 17) % 60) - 30, // -30deg 〜 +30deg
    }));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    const toReveal = setTimeout(() => setPhase("reveal"), 1200);
    const toDone = setTimeout(() => setPhase("done"), 2000);
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-brand text-white"
      initial={{ opacity: 1 }}
      animate={{
        opacity: phase === "reveal" ? 0 : 1,
        scale: phase === "reveal" ? 1.05 : 1,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* 背景パターン・水玉アクセント */}
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px]" />

      {/* 左から100個の今日ポケアイコンの大群が駆け抜ける圧巻のパレード（嵐） */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {iconsStream.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: "-20vw", opacity: 0, scale: 0.6, rotate: item.rotate }}
            animate={{
              x: "125vw",
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1.1, 1, 0.7],
              y: [0, -12, 12, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: "easeInOut",
            }}
            style={{ top: item.top, position: "absolute", willChange: "transform" }}
            className="flex items-center justify-center"
          >
            <span
              style={{ width: item.size, height: item.size }}
              className="relative block overflow-hidden rounded-full border-2 border-white shadow-xl bg-white shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.png"
                alt="今日ポケ"
                className="h-full w-full object-cover"
              />
            </span>
          </motion.div>
        ))}
      </div>

      {/* 中央ポップなブランドタイトル ＆ バウンスアイコン */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative block h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-2xl bg-white sm:h-28 sm:w-28"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="今日ポケ"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-wordmark text-4xl text-white drop-shadow-md sm:text-6xl">
            KYOU POKE
          </span>
          <span className="rounded-full bg-white px-4 py-1 text-xs font-black tracking-widest text-brand-dark uppercase shadow-md sm:text-sm">
            WELCOME !
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
