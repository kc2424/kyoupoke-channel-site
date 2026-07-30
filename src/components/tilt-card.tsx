"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

const MAX_TILT = 10;

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const card = cardRef.current;
      const glare = glareRef.current;
      if (!wrap || !card || !glare) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) {
        return;
      }

      const rotateX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
      const rotateY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
      const glareX = gsap.quickTo(glare, "xPercent", { duration: 0.5, ease: "power3.out" });
      const glareY = gsap.quickTo(glare, "yPercent", { duration: 0.5, ease: "power3.out" });
      const glareOpacity = gsap.quickTo(glare, "opacity", { duration: 0.3 });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotateX((0.5 - py) * MAX_TILT * 2);
        rotateY((px - 0.5) * MAX_TILT * 2);
        glareX(px * 100 - 50);
        glareY(py * 100 - 50);
        glareOpacity(1);
      };

      const handleMouseLeave = () => {
        rotateX(0);
        rotateY(0);
        glareOpacity(0);
      };

      wrap.addEventListener("mousemove", handleMouseMove);
      wrap.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        wrap.removeEventListener("mousemove", handleMouseMove);
        wrap.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className={cn("[perspective:1200px]", className)}>
      <div
        ref={cardRef}
        className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
      >
        {children}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
