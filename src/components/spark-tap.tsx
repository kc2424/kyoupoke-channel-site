"use client";

import gsap from "gsap";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";

const SPARK_COLORS = ["bg-brand", "bg-white", "bg-black"];

export function SparkTap({
  children,
  className,
  sparkCount = 10,
  celebrationLabel = "この実績を祝う",
}: {
  children: ReactNode;
  className?: string;
  sparkCount?: number;
  celebrationLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function burst(originX: number, originY: number) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < sparkCount; i += 1) {
      const spark = document.createElement("span");
      const size = 5 + Math.random() * 5;
      spark.className = `pointer-events-none absolute top-0 left-0 rounded-full ${
        SPARK_COLORS[i % SPARK_COLORS.length]
      }`;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.transform = `translate(${originX - size / 2}px, ${originY - size / 2}px)`;
      container.appendChild(spark);

      const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.4;
      const distance = 40 + Math.random() * 50;

      gsap.fromTo(
        spark,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0.3,
          duration: 0.55 + Math.random() * 0.2,
          ease: "power2.out",
          onComplete: () => spark.remove(),
        }
      );
    }
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    burst(event.clientX - rect.left, event.clientY - rect.top);
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      {children}
      <button
        type="button"
        onClick={handleClick}
        aria-label={celebrationLabel}
        data-cursor-label="CELEBRATE"
        className="absolute top-3 right-3 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-white/80 bg-neutral-900/75 text-lg text-white shadow-sm backdrop-blur-sm transition-transform hover:scale-110 focus-visible:scale-110 sm:top-4 sm:right-4"
      >
        <span aria-hidden="true">✦</span>
      </button>
    </div>
  );
}
