"use client";

import { motion } from "motion/react";

import { StickerDrag } from "@/components/sticker-drag";

// 登場アニメーションが落ち着いたあとも、常時ふわふわ漂わせて画面に動きを出す。
// duration/delayをステッカーごとにずらし、全員が同期して動かないようにしている。
function Float({
  duration,
  delay,
  children,
}: {
  duration: number;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0, 8, 0], rotate: [0, 2.5, 0, -2.5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function HeroStickers() {
  return (
    <div
      data-hero-bounds
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    >
      <motion.div
        className="pointer-events-auto absolute top-[16%] left-[6%]"
        initial={{ opacity: 0, scale: 0.7, y: -28, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.25 }}
      >
        <Float duration={5.5} delay={1}>
          <StickerDrag boundsSelector="[data-hero-bounds]" rotate={-8} className="bg-brand-dark text-white">
            登録者67万人+
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute right-[7%] bottom-[10%]"
        initial={{ opacity: 0, scale: 0.7, y: 28, rotate: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 6 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.38 }}
      >
        <Float duration={6.5} delay={1.2}>
          <StickerDrag boundsSelector="[data-hero-bounds]" rotate={6} className="bg-black text-white">
            総再生12億回+
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute top-[12%] right-[10%]"
        initial={{ opacity: 0, scale: 0.7, y: -24, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.5 }}
      >
        <Float duration={5} delay={1.4}>
          <StickerDrag
            boundsSelector="[data-hero-bounds]"
            rotate={10}
            className="border-brand border-2 bg-white text-brand-dark"
          >
            対戦ガチ勢3人組
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute bottom-[4%] left-[3%]"
        initial={{ opacity: 0, scale: 0.7, y: 24, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.62 }}
      >
        <Float duration={6} delay={1.6}>
          <StickerDrag boundsSelector="[data-hero-bounds]" rotate={-6} className="bg-brand-dark text-white">
            最終1位14回
          </StickerDrag>
        </Float>
      </motion.div>
    </div>
  );
}
