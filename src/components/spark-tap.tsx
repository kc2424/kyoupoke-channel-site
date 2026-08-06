"use client";

import gsap from "gsap";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { useRef } from "react";

import { isSoundEnabled, playPop, popFrequencyProfile } from "@/lib/sound";

const SPARK_COLORS = ["bg-brand", "bg-white", "bg-black"];
const SPECTRUM_BAR_COUNT = 6;

export function SparkTap({
  children,
  className,
  sparkCount = 10,
  tone = 1,
}: {
  children: ReactNode;
  className?: string;
  sparkCount?: number;
  /** playPopに渡す音高倍率。カードごとに異なる値を渡すと固有の音になる */
  tone?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function spectrumBurst(originX: number, originY: number) {
    const container = containerRef.current;
    if (!container) return;
    const profile = popFrequencyProfile(tone, SPECTRUM_BAR_COUNT);
    const barWidth = 4;
    const gap = 3;
    const totalWidth = SPECTRUM_BAR_COUNT * barWidth + (SPECTRUM_BAR_COUNT - 1) * gap;

    profile.forEach((height, i) => {
      const bar = document.createElement("span");
      const maxHeight = 34;
      const barHeight = Math.max(height, 0.12) * maxHeight;
      bar.className = "pointer-events-none absolute top-0 left-0 origin-bottom rounded-full bg-brand";
      bar.style.width = `${barWidth}px`;
      bar.style.height = `${barHeight}px`;
      const x = originX - totalWidth / 2 + i * (barWidth + gap);
      bar.style.transform = `translate(${x}px, ${originY - barHeight}px)`;
      container.appendChild(bar);

      gsap.fromTo(
        bar,
        { scaleY: 0.15, opacity: 1 },
        {
          scaleY: 1,
          opacity: 0,
          duration: 0.35 + i * 0.03,
          ease: "power2.out",
          onComplete: () => bar.remove(),
        }
      );
    });
  }

  function burst(originX: number, originY: number) {
    playPop(tone);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isSoundEnabled()) spectrumBurst(originX, originY);
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

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    burst(event.clientX - rect.left, event.clientY - rect.top);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    burst(rect.width / 2, rect.height / 2);
  }

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="タップして祝う"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
