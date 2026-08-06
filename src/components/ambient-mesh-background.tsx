"use client";

import { motion } from "framer-motion";

export function AmbientMeshBackground({
  variant = "aurora",
}: {
  variant?: "aurora" | "waves" | "dots" | "stripes" | "cinematic" | "matrix" | "ring";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {variant === "aurora" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#d9552e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#ffe0cb] to-[#ffd0b5] opacity-30 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 30, -20, 0],
              scale: [1, 0.95, 1.05, 1],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-[#ffd4b8] to-[#ffe5d4] opacity-30 blur-3xl"
          />
        </>
      )}

      {variant === "ring" && (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -left-32 top-10 h-[30rem] w-[30rem] rounded-full border-2 border-dashed border-[#d9552e]/15 opacity-50 blur-[1px]"
        />
      )}

      {variant === "waves" && (
        <>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full border border-[#d9552e]/15 bg-gradient-to-br from-[#ffe8d6]/30 via-transparent to-transparent opacity-50 blur-xl"
          />
        </>
      )}

      {variant === "stripes" && (
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(135deg,#d9552e_25%,transparent_25%,transparent_50%,#d9552e_50%,#d9552e_75%,transparent_75%,transparent)] [background-size:28px_28px]" />
      )}

      {variant === "dots" && (
        <div className="absolute inset-0 bg-[radial-gradient(#b8431f_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-[0.04]" />
      )}

      {variant === "cinematic" && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-[#ffd9be] via-[#ffe8d6] to-transparent opacity-35 blur-3xl"
        />
      )}

      {variant === "matrix" && (
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d9552e_1px,transparent_1px)] [background-size:16px_16px]" />
      )}
    </div>
  );
}
