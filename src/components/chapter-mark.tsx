"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// 章番号は装飾だが「薄すぎて見えない」状態にはしない。
// 背景色ごとにコントラスト比3:1（大きい文字の基準）を満たす濃さに揃えてある。
const TONE_STYLES = {
  light: { number: "text-brand", slash: "text-neutral-500" },
  dark: { number: "text-white", slash: "text-white/70" },
  brand: { number: "text-white", slash: "text-white/70" },
} as const;

export function ChapterMark({
  index,
  total,
  tone = "light",
  className,
}: {
  index: number;
  total: number;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const styles = TONE_STYLES[tone];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1, x: 0 });
        return;
      }

      gsap.set(el, { opacity: 0, x: -16 });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () =>
          gsap.to(el, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }),
      });

      return () => trigger.kill();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={cn(
        "font-display flex items-baseline gap-1 text-lg tabular-nums lg:text-2xl",
        className
      )}
    >
      <span className={styles.number}>{String(index).padStart(2, "0")}</span>
      <span className={styles.slash}>/{String(total).padStart(2, "0")}</span>
    </div>
  );
}
