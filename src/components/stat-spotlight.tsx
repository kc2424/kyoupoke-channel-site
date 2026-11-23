import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

type Stat = { value: number; suffix?: string; decimals?: number; label: string };
export function StatSpotlight({ stats, className }: { stats: Stat[]; className?: string }) {
  return <div className={cn("grid gap-6 sm:grid-cols-3 lg:gap-10", className)}>
    {stats.map((s) => <div key={s.label} className="flex flex-col items-start">
      <p className="font-display text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
        <StatCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
      </p>
      <p className="mt-2 text-sm font-bold text-neutral-800">{s.label}</p>
    </div>)}
  </div>;
}
