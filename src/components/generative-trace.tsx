"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STEPS = 9;
const WIDTH = 100;
const HEIGHT = 24;

// seed値だけで結果が決まる擬似乱数（mulberry32）。SSR/CSRで同じ経路になるよう、
// Math.random()は使わずこの関数だけで基板の配線のような折れ線を生成する。
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTracePath(seed: number) {
  const rand = mulberry32(seed);
  const segW = WIDTH / STEPS;
  let x = 0;
  let y = HEIGHT / 2;
  let d = `M0 ${y.toFixed(2)}`;

  for (let i = 0; i < STEPS; i++) {
    x += segW;
    const dir = rand() < 0.5 ? -1 : 1;
    y = Math.min(HEIGHT - 3, Math.max(3, y + dir * (3 + rand() * 7)));
    d += ` H${x.toFixed(2)} V${y.toFixed(2)}`;
  }
  d += ` H${WIDTH}`;
  return d;
}

/**
 * セクション境界に走る、基板配線のような折れ線。
 * seedから決定論的に生成し、mix-blend-differenceでどの背景色の上でも
 * 白黒反転して視認できるようにすることで、下地の色に依存しない一貫した
 * 「構造」として機能させる。
 */
export function GenerativeTrace({
  seed,
  className,
}: {
  seed: number;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const d = useMemo(() => buildTracePath(seed), [seed]);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const path = pathRef.current;
      if (!wrapper || !path) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(path, { strokeDashoffset: 0 });
        return;
      }

      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-full w-full mix-blend-difference"
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={0.6}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
