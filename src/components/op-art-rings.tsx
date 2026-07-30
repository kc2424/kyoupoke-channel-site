"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const RING_COUNT = 7;

export function OpArtRings({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const rings = ringsRef.current;
      if (!wrapper || !rings) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // ずっとゆっくり回転し続ける催眠的な演出
      gsap.to(rings, {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      // スクロール量に応じてリングが呼吸するように伸縮
      gsap.fromTo(
        rings,
        { scale: 0.85 },
        {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
    >
      <svg
        ref={ringsRef}
        viewBox="0 0 200 200"
        className="h-full w-full will-change-transform"
      >
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={14 + i * 13}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={i % 2 === 0 ? 3 : 1.5}
            opacity={0.5 - i * 0.055}
          />
        ))}
      </svg>
    </div>
  );
}
