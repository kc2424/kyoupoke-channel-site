"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<string | null>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    if (!ring || !dot || !labelEl) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const labelX = gsap.quickTo(labelEl, "x", { duration: 0.45, ease: "power3.out" });
    const labelY = gsap.quickTo(labelEl, "y", { duration: 0.45, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      if (!active) setActive(true);
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);

      const target = (e.target as HTMLElement)?.closest?.("a, button, [role='button']");
      setHovering(Boolean(target));

      const labelTarget = (e.target as HTMLElement)?.closest?.("[data-cursor-label]") as HTMLElement | null;
      setLabel(labelTarget?.dataset.cursorLabel ?? null);
      setPreviewIndex(labelTarget?.dataset.cursorIndex ?? null);
    };

    const handleLeave = () => setActive(false);

    document.documentElement.classList.add("cursor-none");
    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity duration-200"
        style={{ opacity: active ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white mix-blend-difference transition-[width,height,opacity,background-color] duration-200 ease-out"
        style={{
          opacity: active ? 1 : 0,
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          backgroundColor: hovering ? "rgba(255, 255, 255, 0.15)" : "transparent",
        }}
      />
      <div
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] ml-8 flex -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-1 transition-opacity duration-200"
        style={{ opacity: active && label ? 1 : 0 }}
      >
        {previewIndex && (
          <span className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white uppercase mix-blend-difference">
            <span className="h-px w-4 bg-current" />
            {previewIndex}
          </span>
        )}
        <span className="font-display text-lg font-bold tracking-wide text-white uppercase mix-blend-difference">
          {label}
        </span>
      </div>
    </>
  );
}
