"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// アイコンの大群用データ（様々なサイズ、Y軸の位置、スピード、回転角）
const iconsStream = [
  { id: 1, size: 56, top: "8%", duration: 1.3, delay: 0, rotate: 12 },
  { id: 2, size: 72, top: "18%", duration: 1.1, delay: 0.08, rotate: -15 },
  { id: 3, size: 48, top: "28%", duration: 1.4, delay: 0.04, rotate: 20 },
  { id: 4, size: 80, top: "38%", duration: 1.0, delay: 0.16, rotate: -8 },
  { id: 5, size: 64, top: "48%", duration: 1.25, delay: 0.12, rotate: 15 },
  { id: 6, size: 52, top: "58%", duration: 1.35, delay: 0.22, rotate: -25 },
  { id: 7, size: 88, top: "68%", duration: 1.1, delay: 0.06, rotate: 10 },
  { id: 8, size: 60, top: "78%", duration: 1.3, delay: 0.14, rotate: -12 },
  { id: 9, size: 76, top: "88%", duration: 1.2, delay: 0.18, rotate: 18 },
  { id: 10, size: 50, top: "12%", duration: 1.38, delay: 0.1, rotate: -10 },
  { id: 11, size: 68, top: "22%", duration: 1.15, delay: 0.24, rotate: 22 },
  { id: 12, size: 54, top: "32%", duration: 1.42, delay: 0.02, rotate: -18 },
  { id: 13, size: 84, top: "42%", duration: 1.05, delay: 0.28, rotate: 14 },
  { id: 14, size: 62, top: "52%", duration: 1.22, delay: 0.07, rotate: -6 },
  { id: 15, size: 74, top: "62%", duration: 1.18, delay: 0.19, rotate: 16 },
  { id: 16, size: 46, top: "72%", duration: 1.48, delay: 0.11, rotate: -20 },
  { id: 17, size: 90, top: "82%", duration: 0.98, delay: 0.25, rotate: 8 },
  { id: 18, size: 58, top: "5%", duration: 1.32, delay: 0.17, rotate: -14 },
  { id: 19, size: 70, top: "15%", duration: 1.12, delay: 0.3, rotate: 19 },
  { id: 20, size: 52, top: "25%", duration: 1.4, delay: 0.05, rotate: -11 },
  { id: 21, size: 82, top: "35%", duration: 1.08, delay: 0.21, rotate: 13 },
  { id: 22, size: 66, top: "45%", duration: 1.28, delay: 0.09, rotate: -16 },
  { id: 23, size: 44, top: "55%", duration: 1.5, delay: 0.27, rotate: 21 },
  { id: 24, size: 78, top: "65%", duration: 1.14, delay: 0.03, rotate: -7 },
  { id: 25, size: 60, top: "75%", duration: 1.34, delay: 0.23, rotate: 17 },
  { id: 26, size: 86, top: "85%", duration: 1.02, delay: 0.13, rotate: -13 },
  { id: 27, size: 50, top: "92%", duration: 1.44, delay: 0.29, rotate: 11 },
  { id: 28, size: 72, top: "96%", duration: 1.16, delay: 0.15, rotate: -9 },
];

export function IntroLoader() {
  const [phase, setPhase] = useState<"hold" | "reveal" | "done">("hold");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    const toReveal = setTimeout(() => setPhase("reveal"), 1100);
    const toDone = setTimeout(() => setPhase("done"), 1900);
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

      {/* 左からアイコンの大群が横断して流れていくパレードアニメーション */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {iconsStream.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: "-20vw", opacity: 0, scale: 0.6, rotate: item.rotate }}
            animate={{
              x: "120vw",
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1.1, 1, 0.7],
              y: [0, -15, 15, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: "easeInOut",
            }}
            style={{ top: item.top, position: "absolute" }}
            className="flex items-center justify-center"
          >
            <span
              style={{ width: item.size, height: item.size }}
              className="relative block overflow-hidden rounded-full border-4 border-white shadow-2xl bg-white"
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
