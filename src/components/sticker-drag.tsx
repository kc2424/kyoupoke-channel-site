"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(Draggable, InertiaPlugin);

export function StickerDrag({
  children,
  className,
  rotate = -6,
  boundsSelector,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  boundsSelector: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = elRef.current;
      const bounds = el?.closest(boundsSelector);
      if (!el || !bounds) return;

      gsap.set(el, { rotation: rotate });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const [draggable] = Draggable.create(el, {
        type: "x,y",
        bounds,
        inertia: true,
        edgeResistance: 0.65,
        onPress() {
          gsap.to(el, { scale: 1.08, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        },
        onRelease() {
          gsap.to(el, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        },
      });

      return () => {
        draggable.kill();
      };
    },
    { scope: elRef, dependencies: [rotate, boundsSelector] }
  );

  return (
    <div
      ref={elRef}
      className={cn(
        "inline-flex w-fit cursor-grab touch-none items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shadow-lg select-none active:cursor-grabbing lg:px-6 lg:py-3 lg:text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
