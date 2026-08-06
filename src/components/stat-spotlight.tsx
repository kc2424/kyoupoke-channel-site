"use client";

import { motion } from "framer-motion";
import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

type Stat = {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
};

export function StatSpotlight({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-3 lg:gap-8", className)}>
      {stats.map((s, index) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-2xl border border-brand/20 bg-white/70 p-6 sm:p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-xl"
        >
          {/* 微細な背景グロー効果 */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#d9552e]/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

          <p className="font-mono font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter bg-gradient-to-br from-[#d9552e] via-[#b8431f] to-[#7f260b] bg-clip-text text-transparent drop-shadow-sm">
            <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
          </p>

          <p className="mt-3 text-xs font-bold tracking-wider text-neutral-800 uppercase sm:text-sm lg:text-base border-t border-brand/10 pt-3">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
