"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function StatCounter({
  value,
  suffix = "",
  decimals = 0,
  className,
  onProgress,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  onProgress?: (progress: number) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    n.toLocaleString("ja-JP", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = `${format(value)}${suffix}`;
        onProgress?.(1);
        return;
      }

      const counter = { n: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            n: value,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${format(counter.n)}${suffix}`;
              onProgress?.(value === 0 ? 1 : counter.n / value);
            },
          }),
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {format(0)}
      {suffix}
    </span>
  );
}
