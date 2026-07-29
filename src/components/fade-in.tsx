"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
  x = 0,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
