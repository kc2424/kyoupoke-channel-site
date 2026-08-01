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
        <div key={s.label}>
          <p className="font-display text-4xl text-brand tabular-nums sm:text-5xl lg:text-7xl">
            <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
          </p>
          <p className="mt-2 text-xs font-bold tracking-widest text-white/50 uppercase lg:text-sm">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
