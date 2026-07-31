"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function CurtainReveal({
  children,
  flapColor = "#ffffff",
  className,
}: {
  children: ReactNode;
  flapColor?: string;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const flap = flapRef.current;
      if (!wrapper || !flap) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(flap, { autoAlpha: 0 });
        return;
      }

      gsap.set(flap, { rotateX: 0, transformOrigin: "top center" });

      const tween = gsap.to(flap, {
        rotateX: -110,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          end: "top 35%",
          scrub: true,
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
      className={cn("relative overflow-hidden", className)}
      style={{ perspective: "1400px" }}
    >
      {children}
      <div
        ref={flapRef}
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: flapColor, backfaceVisibility: "hidden" }}
      />
    </div>
  );
}
