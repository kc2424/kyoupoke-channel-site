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
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
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
