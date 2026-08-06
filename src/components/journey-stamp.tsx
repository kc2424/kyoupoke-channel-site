"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const TONE_STYLES = {
  brand: "text-white/85",
  black: "text-white/55",
} as const;

/**
 * 実績カードの角に押される「パスポートの入国スタンプ」風バッジ。
 * カードが画面に入ったタイミングで、傾いた大きめの状態からインクを
 * 押し付けるように一度だけ着地させる（once: true・scrubなし）。
 */
export function JourneyStamp({
  index,
  total,
  tone = "black",
  className,
}: {
  index: number;
  total: number;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // indexだけから決まる小さな傾き（-8〜8度）。毎回同じ見た目になるようMath.randomは使わない
      const restRotate = ((index * 47) % 17) - 8;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { rotate: restRotate, scale: 1, opacity: 1 });
        return;
      }

      gsap.set(el, { rotate: restRotate - 22, scale: 1.7, opacity: 0 });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            rotate: restRotate,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2.4)",
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: ref, dependencies: [index] }
  );

  const label = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 64 64"
      className={cn("pointer-events-none h-10 w-10 shrink-0 lg:h-14 lg:w-14", TONE_STYLES[tone], className)}
    >
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3.5" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="32" y="30" textAnchor="middle" fill="currentColor" fontSize="13" className="font-display">
        {label}
      </text>
      <text x="32" y="41" textAnchor="middle" fill="currentColor" fontSize="6" letterSpacing="1">
        / {totalLabel}
      </text>
    </svg>
  );
}
