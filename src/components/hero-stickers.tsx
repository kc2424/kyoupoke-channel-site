"use client";

import { motion } from "motion/react";
import { StickerDrag } from "@/components/sticker-drag";

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
      animate={{ y: [0, -8, 0, 6, 0], rotate: [0, 2, 0, -2, 0] }}
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
        className="pointer-events-auto absolute top-[13%] left-[4%] sm:top-[16%] sm:left-[6%]"
        initial={{ opacity: 0, scale: 0.7, y: -28, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.25 }}
      >
        <Float duration={5.5} delay={1}>
          <StickerDrag
            boundsSelector="[data-hero-bounds]"
            rotate={-8}
            className="bg-brand-dark px-2.5 py-1 text-xs font-bold text-white shadow-md sm:px-3.5 sm:py-1.5 sm:text-sm"
          >
            登録者67万人+
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute top-[13%] right-[4%] sm:top-auto sm:right-[7%] sm:bottom-[10%]"
        initial={{ opacity: 0, scale: 0.7, y: 28, rotate: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 6 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.38 }}
      >
        <Float duration={6.5} delay={1.2}>
          <StickerDrag
            boundsSelector="[data-hero-bounds]"
            rotate={6}
            className="bg-black px-2.5 py-1 text-xs font-bold text-white shadow-md sm:px-3.5 sm:py-1.5 sm:text-sm"
          >
            総再生12億回+
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute top-[12%] right-[10%] hidden sm:block"
        initial={{ opacity: 0, scale: 0.7, y: -24, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.5 }}
      >
        <Float duration={5} delay={1.4}>
          <StickerDrag
            boundsSelector="[data-hero-bounds]"
            rotate={10}
            className="border-brand border-2 bg-white px-3.5 py-1.5 text-sm font-bold text-brand-dark shadow-md"
          >
            対戦ガチ勢3人組
          </StickerDrag>
        </Float>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute top-[28%] left-[4%] sm:top-auto sm:left-[3%] sm:bottom-[4%]"
        initial={{ opacity: 0, scale: 0.7, y: 24, rotate: -14 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.62 }}
      >
        <Float duration={6} delay={1.6}>
          <StickerDrag
            boundsSelector="[data-hero-bounds]"
            rotate={-6}
            className="bg-brand-dark px-2.5 py-1 text-xs font-bold text-white shadow-md sm:px-3.5 sm:py-1.5 sm:text-sm"
          >
            最終1位14回
          </StickerDrag>
        </Float>
      </motion.div>
    </div>
  );
}
