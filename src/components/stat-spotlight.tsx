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
    <div className={cn("grid gap-8 sm:grid-cols-3 lg:gap-10", className)}>
      {stats.map((s, index) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          {/* KYOU POKE ヒーローと同じ可愛くポップな font-display フォント */}
          <p className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-brand tracking-tight drop-shadow-sm">
            <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
          </p>

          <p className="mt-2 text-xs font-extrabold tracking-widest text-neutral-800 uppercase sm:text-sm lg:text-base border-t border-neutral-200/80 pt-2.5 w-full">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
