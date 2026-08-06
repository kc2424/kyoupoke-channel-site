"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

const RING_RADIUS = 15;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function StatSpotlight({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const checkRefs = useRef<(SVGPathElement | null)[]>([]);

  const handleProgress = (i: number) => (progress: number) => {
    const clamped = Math.min(1, Math.max(0, progress));
    const ring = ringRefs.current[i];
    const check = checkRefs.current[i];
    if (ring) {
      ring.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - clamped)}`;
    }
    if (check) {
      check.style.opacity = clamped >= 1 ? "1" : "0";
    }
  };

  useGSAP(
    () => {
      const container = containerRef.current;
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!container || items.length < 2) return;

      const mm = gsap.matchMedia();

      // スクロールを一箇所に留め、数字を一つずつ主役交代させる演出はデスクトップのみ
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { opacity: 0.3, scale: 0.9 });
        gsap.set(items[0], { opacity: 1, scale: 1 });

        const steps = items.length;
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "top top+=96",
          end: () => `+=${window.innerHeight * (steps - 1) * 0.7}`,
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            const active = Math.min(steps - 1, Math.floor(self.progress * steps));
            items.forEach((el, i) => {
              gsap.to(el, {
                opacity: i === active ? 1 : 0.3,
                scale: i === active ? 1 : 0.9,
                duration: 0.3,
                overwrite: "auto",
              });
            });
          },
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={cn("grid gap-8 sm:grid-cols-3 lg:gap-10", className)}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
        >
          <p className="font-display text-4xl text-brand tabular-nums sm:text-5xl lg:text-7xl">
            <StatCounter value={s.value} suffix={s.suffix} onProgress={handleProgress(i)} />
          </p>
          <div className="mt-2 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 36 36"
              className="-rotate-90 shrink-0 lg:h-5 lg:w-5"
              aria-hidden="true"
            >
              <circle
                cx="18"
                cy="18"
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/10"
              />
              <circle
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                cx="18"
                cy="18"
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE}
                className="text-brand"
              />
              <path
                ref={(el) => {
                  checkRefs.current[i] = el;
                }}
                d="M11 18l4.5 4.5L25 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand opacity-0 transition-opacity duration-300"
              />
            </svg>
            <p className="text-xs font-bold tracking-widest text-white/50 uppercase lg:text-sm">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
