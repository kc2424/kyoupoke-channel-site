"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
  x = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  /** グリッドの子として使うときに col-span 等を渡すため。実際のグリッド項目はこのdiv。 */
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
