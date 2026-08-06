"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<string | null>(null);
  const [playAffordance, setPlayAffordance] = useState(false);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    const labelEl = labelRef.current;
    if (!ring || !dot || !trail || !labelEl) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const trailX = gsap.quickTo(trail, "x", { duration: 0.18, ease: "power3.out" });
    const trailY = gsap.quickTo(trail, "y", { duration: 0.18, ease: "power3.out" });
    const labelX = gsap.quickTo(labelEl, "x", { duration: 0.45, ease: "power3.out" });
    const labelY = gsap.quickTo(labelEl, "y", { duration: 0.45, ease: "power3.out" });

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const handleMove = (e: MouseEvent) => {
      if (!active) setActive(true);
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      trailX(e.clientX);
      trailY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);

      // 移動速度・向きから「先端はくっきり、後端はぼける」非対称な軌跡を描く
      const dt = Math.max(e.timeStamp - lastT, 1);
      if (lastT > 0) {
        const speed = Math.min(Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt, 2);
        const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX) * (180 / Math.PI);
        gsap.set(trail, {
          rotation: angle + 180,
          scaleX: Math.min(1 + speed * 5, 6),
          opacity: Math.min(speed * 0.5, 0.45),
        });
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;

      const target = (e.target as HTMLElement)?.closest?.("a, button, [role='button']");
      setHovering(Boolean(target));

      const labelTarget = (e.target as HTMLElement)?.closest?.("[data-cursor-label]") as HTMLElement | null;
      setLabel(labelTarget?.dataset.cursorLabel ?? null);
      setPreviewIndex(labelTarget?.dataset.cursorIndex ?? null);

      const playTarget = (e.target as HTMLElement)?.closest?.("[data-cursor-play]");
      setPlayAffordance(Boolean(playTarget));
    };

    const handleLeave = () => {
      setActive(false);
      gsap.to(trail, { opacity: 0, duration: 0.3, overwrite: true });
    };

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
        ref={trailRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[998] h-[3px] w-5 -translate-y-1/2 rounded-full bg-white opacity-0 blur-[2.5px] mix-blend-difference [mask-image:linear-gradient(to_right,black,transparent)] [-webkit-mask-image:linear-gradient(to_right,black,transparent)]"
        style={{ transformOrigin: "left center" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity duration-200"
        style={{ opacity: active && !playAffordance ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white transition-[width,height,opacity,background-color,border-color] duration-200 ease-out"
        style={{
          opacity: active ? 1 : 0,
          width: playAffordance ? 64 : hovering ? 56 : 32,
          height: playAffordance ? 64 : hovering ? 56 : 32,
          backgroundColor: playAffordance
            ? "var(--brand)"
            : hovering
              ? "rgba(255, 255, 255, 0.15)"
              : "transparent",
          borderColor: playAffordance ? "transparent" : "white",
          mixBlendMode: playAffordance ? "normal" : "difference",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="ml-0.5 h-5 w-5 fill-white transition-opacity duration-150"
          style={{ opacity: playAffordance ? 1 : 0 }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
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
