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
      {stats.map((s) => (
        <div key={s.label} className="group relative rounded-2xl border border-brand/15 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand/40">
          <p className="font-display text-4xl font-extrabold tabular-nums sm:text-5xl lg:text-7xl bg-gradient-to-r from-[#d9552e] via-[#c44722] to-[#a83617] bg-clip-text text-transparent drop-shadow-sm">
            <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
          </p>
          <p className="mt-2 text-xs font-extrabold tracking-widest text-neutral-800 uppercase sm:text-sm lg:text-base">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
