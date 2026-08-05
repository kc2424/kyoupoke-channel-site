"use client";

import { motion } from "motion/react";
import Image from "next/image";

// フェードインしてからゆっくり広がるKen Burns風の演出。
export function HeroPhoto({
  src,
  alt,
  objectPosition = "object-top",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0, scale: 1.12 }}
      animate={{ opacity: 0.9, scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className={`object-cover ${objectPosition}`}
          style={{ transform: "translateY(-20px)" }}
        />
      </motion.div>
    </motion.div>
  );
}
