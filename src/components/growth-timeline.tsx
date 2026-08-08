"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import { StatCounter } from "@/components/stat-counter";

gsap.registerPlugin(ScrollTrigger);

type LiveStat = {
  value: number;
  suffix: string;
  caption: string;
};

type Milestone = {
  date: string;
  label: string;
  /** 指定すると、この節目のラベルを静的な文字列の代わりにカウントアップする単一指標として表示する */
  live?: LiveStat[];
};

export function GrowthTimeline({
  milestones,
  className,
}: {
  milestones: Milestone[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      const fill = fillRef.current;
      if (!container || !fill) return;

      const total = milestones.length;

      const setProgress = (progress: number) => {
        fill.style.width = `${progress * 100}%`;
        dotRefs.current.forEach((dot, i) => {
          const threshold = total > 1 ? i / (total - 1) : 0;
          const reached = progress >= threshold - 0.01;
          dot?.classList.toggle("bg-brand", reached);
          dot?.classList.toggle("scale-125", reached);
          dot?.classList.toggle("bg-neutral-300", !reached);
          const label = labelRefs.current[i];
          label?.classList.toggle("text-neutral-900", reached);
          label?.classList.toggle("text-neutral-400", !reached);
        });
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setProgress(1);
        return;
      }

      setProgress(0);

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        end: "bottom 40%",
        scrub: 0.4,
        onUpdate: (self) => setProgress(self.progress),
      });

      return () => trigger.kill();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      <div className="relative h-1 w-full rounded-full bg-neutral-200">
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 w-0 rounded-full bg-brand"
        />
        <div className="absolute inset-0 flex items-center justify-between">
          {milestones.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="h-3 w-3 rounded-full bg-neutral-300 ring-4 ring-white transition-all duration-300 lg:h-4 lg:w-4"
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-2">
        {milestones.map((m, i) => (
          <div
            key={i}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className={cn(
              "flex flex-col text-neutral-400 transition-colors duration-300",
              i === 0 && "items-start text-left",
              i > 0 && i < milestones.length - 1 && "items-center text-center",
              i === milestones.length - 1 && "items-end text-right"
            )}
            style={{ maxWidth: `${100 / milestones.length}%` }}
          >
            <span className="text-xs font-bold tracking-widest uppercase lg:text-sm">
              {m.date}
            </span>
            {m.live ? (
              <span
                className={cn(
                  "mt-1 flex flex-col gap-1",
                  i === 0 && "items-start",
                  i > 0 && i < milestones.length - 1 && "items-center",
                  i === milestones.length - 1 && "items-end"
                )}
              >
                {m.live.map((s) => (
                  <span key={s.caption} className="flex items-baseline gap-1">
                    <StatCounter
                      value={s.value}
                      suffix={s.suffix}
                      className="font-display text-lg leading-none text-neutral-900 lg:text-2xl"
                    />
                    <span className="text-[10px] leading-none font-bold text-neutral-400 lg:text-xs">
                      {s.caption}
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              <span className="mt-1 text-xs leading-snug font-bold lg:text-base">
                {m.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
