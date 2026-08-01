"use client";

import { motion } from "motion/react";

import { StickerDrag } from "@/components/sticker-drag";

export function HeroStickers() {
  return (
    <div
      data-hero-bounds
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      aria-hidden="true"
    >
      <motion.div
        className="pointer-events-auto absolute top-[16%] left-[6%]"
        initial={{ opacity: 0, scale: 0.7, y: -28, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.25 }}
      >
        <StickerDrag boundsSelector="[data-hero-bounds]" rotate={-8} className="bg-brand text-white">
          登録者67万人+
        </StickerDrag>
      </motion.div>
      <motion.div
        className="pointer-events-auto absolute right-[7%] bottom-[24%]"
        initial={{ opacity: 0, scale: 0.7, y: 28, rotate: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 6 }}
        transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.38 }}
      >
        <StickerDrag boundsSelector="[data-hero-bounds]" rotate={6} className="bg-black text-white">
          総再生12億回+
        </StickerDrag>
      </motion.div>
    </div>
  );
}
