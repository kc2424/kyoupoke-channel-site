"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function SnapReveal({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const items = gsap.utils.toArray<HTMLElement>(scope.children);
      if (items.length === 0) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { opacity: 1, y: 0, rotate: 0, scale: 1 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 28, scale: 0.92 });
      items.forEach((item, i) => {
        gsap.set(item, { rotate: i % 2 === 0 ? -2 : 2 });
      });

      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.45,
            ease: "back.out(2.2)",
            stagger,
            overwrite: true,
          }),
      });
    },
    { scope: scopeRef }
  );

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}
