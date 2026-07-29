"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function GiantTitle({ children }: { children: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];

      // 浮き上がって登場する演出
      gsap.set(chars, { yPercent: 120, opacity: 0 });
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => {
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.05,
          });
        },
      });

      // マウス位置に応じたふにゃふにゃスクイーズ
      const squishers = chars.map((el) => ({
        el,
        scaleX: gsap.quickTo(el, "scaleX", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
        scaleY: gsap.quickTo(el, "scaleY", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
        skewX: gsap.quickTo(el, "skewX", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
      }));

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const px = e.clientX - rect.left;

        squishers.forEach(({ el, scaleX, scaleY, skewX }) => {
          const charRect = el.getBoundingClientRect();
          const center = charRect.left - rect.left + charRect.width / 2;
          const dist = Math.abs(px - center);
          const influence = Math.max(0, 1 - dist / 260);
          const dir = px > center ? -1 : 1;

          scaleX(1 + influence * 0.4);
          scaleY(1 - influence * 0.22);
          skewX(dir * influence * 8);
        });
      };

      const handleMouseLeave = () => {
        squishers.forEach(({ scaleX, scaleY, skewX }) => {
          scaleX(1);
          scaleY(1);
          skewX(0);
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <h1
      ref={containerRef}
      className="font-wordmark text-brand flex w-full justify-center overflow-visible text-[20vw] leading-[0.85] sm:text-[13.5vw]"
      style={{ letterSpacing: "-0.02em", wordSpacing: "-0.35em" }}
    >
      {children.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className="inline-block will-change-transform"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h1>
  );
}
