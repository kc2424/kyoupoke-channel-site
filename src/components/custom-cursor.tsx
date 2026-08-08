"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { onNativeCursorChange } from "@/lib/native-cursor";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  // 動画モーダルなどiframeを開いている間はカスタムカーソルを引っ込め、
  // OS標準のカーソルに主導権を渡す。
  const [nativeCursor, setNativeCursor] = useState(false);

  useEffect(() => onNativeCursorChange(setNativeCursor), []);

  useEffect(() => {
    const root = document.documentElement;
    if (nativeCursor) {
      root.classList.remove("cursor-none");
    } else if (
      !window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches
    ) {
      root.classList.add("cursor-none");
    }
  }, [nativeCursor]);

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
        className="pointer-events-none fixed top-0 left-0 z-[999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity duration-200"
        style={{ opacity: active && !nativeCursor ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height,opacity] duration-200 ease-out"
        style={{
          opacity: active && hovering && !nativeCursor ? 1 : 0,
          width: hovering ? 40 : 32,
          height: hovering ? 40 : 32,
        }}
      >
        <span className="absolute top-0 left-0 h-2.5 w-2.5 border-t-2 border-l-2 border-white" />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 border-t-2 border-r-2 border-white" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-white" />
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 border-r-2 border-b-2 border-white" />
      </div>
      <span
        ref={labelRef}
        aria-hidden
        className="font-display pointer-events-none fixed top-0 left-0 z-[999] ml-8 -translate-x-1/2 -translate-y-1/2 text-lg font-bold tracking-wide text-white uppercase mix-blend-difference transition-opacity duration-200"
        style={{ opacity: active && label && !nativeCursor ? 1 : 0 }}
      >
        {label}
      </span>
    </>
  );
}
