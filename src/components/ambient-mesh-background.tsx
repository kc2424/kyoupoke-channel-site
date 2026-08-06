"use client";

import { motion } from "framer-motion";

export function AmbientMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* 幾何学ドットグリッドパターン */}
      <div className="absolute inset-0 bg-[radial-gradient(#d9552e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035]" />

      {/* 漂う柔らかいブランドカラーのアンビエント光球 1 */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#ffe0cb] to-[#ffd0b5] opacity-40 blur-3xl"
      />

      {/* 漂う柔らかいアンビエント光球 2 */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-[#ffd4b8] to-[#ffe5d4] opacity-35 blur-3xl"
      />
    </div>
  );
}
