"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

const STRENGTH = 0.35;

export function Magnetic({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) {
        return;
      }

      const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        x(relX * STRENGTH);
        y(relY * STRENGTH);
      };

      const handleMouseLeave = () => {
        x(0);
        y(0);
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="inline-block will-change-transform">
      {children}
    </div>
  );
}
