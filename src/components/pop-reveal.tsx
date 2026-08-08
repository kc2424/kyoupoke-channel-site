"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// 弾んで飛び出すように登場する演出。カーテンめくりの代わりに使う、
// より賑やかでワクワク感のあるリビール。
export function PopReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      const burst = burstRef.current;
      if (!wrapper || !content || !burst) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(content, { opacity: 1, scale: 1, rotate: 0 });
        gsap.set(burst, { autoAlpha: 0 });
        return;
      }

      gsap.set(content, { opacity: 0, scale: 0.6, rotate: -6, transformOrigin: "center" });
      gsap.set(burst, { opacity: 0, scale: 0.3 });

      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(burst, { opacity: 1, scale: 1.15, duration: 0.5, ease: "power2.out" })
            .to(burst, { opacity: 0, duration: 0.5, ease: "power1.in" }, "-=0.1")
            .to(
              content,
              { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" },
              "<"
            );
        },
      });

      return () => trigger.kill();
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      <div
        ref={burstRef}
        aria-hidden
        className="bg-brand pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      <div ref={contentRef} className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}
