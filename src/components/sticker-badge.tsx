import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function starPoints(spikes: number, outerR: number, innerR: number) {
  const points: string[] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    points.push(`${x}% ${y}%`);
  }
  return points.join(", ");
}

export function StickerBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-brand flex aspect-square w-40 rotate-[-8deg] flex-col items-center justify-center gap-1 text-center text-white sm:w-52 lg:w-64",
        className
      )}
      style={{ clipPath: `polygon(${starPoints(11, 50, 41)})` }}
    >
      {children}
    </div>
  );
}
