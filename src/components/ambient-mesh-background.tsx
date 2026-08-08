"use client";

import { motion } from "framer-motion";

export function AmbientMeshBackground({
  variant = "aurora",
}: {
  variant?: "aurora" | "waves" | "dots" | "stripes" | "cinematic" | "matrix" | "ring" | "bubbles";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {variant === "aurora" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#d9552e_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-[0.08]" />
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#d9552e]/30 to-[#ffa575]/20 blur-2xl"
          />
          <motion.div
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -30, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-[#ffd4b8]/40 to-[#ffe5d4]/20 blur-2xl"
          />
        </>
      )}

      {variant === "bubbles" && (
        <>
          <motion.div
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-8 h-48 w-48 rounded-full border-2 border-[#d9552e]/25 bg-gradient-to-br from-[#ffd9be]/30 to-transparent blur-md"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              scale: [1, 0.92, 1],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-12 h-64 w-64 rounded-full border-2 border-[#d9552e]/20 bg-gradient-to-tl from-[#ffe8d6]/40 to-transparent blur-md"
          />
        </>
      )}

      {variant === "ring" && (
        <div className="absolute -left-20 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="h-[28rem] w-[28rem] rounded-full border-3 border-dashed border-[#d9552e]/30 p-8"
          >
            <div className="h-full w-full rounded-full border-2 border-dotted border-[#b8431f]/25" />
          </motion.div>
        </div>
      )}

      {variant === "waves" && (
        <div className="absolute -right-24 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="h-[32rem] w-[32rem] rounded-full border-3 border-[#d9552e]/25 bg-gradient-to-br from-[#ffe8d6]/30 via-transparent to-transparent blur-lg"
          />
        </div>
      )}

      {variant === "stripes" && (
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,#d9552e_25%,transparent_25%,transparent_50%,#d9552e_50%,#d9552e_75%,transparent_75%,transparent)] [background-size:24px_24px]" />
      )}

      {variant === "dots" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#b8431f_2px,transparent_2px)] [background-size:22px_22px] opacity-[0.07]" />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute right-10 top-10 h-32 w-32 border-2 border-dashed border-[#d9552e]/30 opacity-60"
          />
        </>
      )}

      {variant === "cinematic" && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full bg-gradient-to-r from-[#ffd9be]/40 via-[#ffe8d6]/30 to-transparent blur-3xl"
        />
      )}

      {variant === "matrix" && (
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#d9552e_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
      )}
    </div>
  );
}
