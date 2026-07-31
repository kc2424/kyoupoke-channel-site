"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { setNavTransitionTrigger } from "@/lib/nav-transition";

export function NavTransition() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;

    setNavTransitionTrigger(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.killTweensOf([top, bottom]);
      const tl = gsap.timeline();
      tl.set([top, bottom], { scaleY: 0 })
        .to([top, bottom], { scaleY: 1, duration: 0.32, ease: "power3.inOut" })
        .to([top, bottom], {
          scaleY: 0,
          duration: 0.42,
          ease: "power3.inOut",
          delay: 0.08,
        });
    });

    return () => setNavTransitionTrigger(null);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[65]"
      aria-hidden="true"
    >
      <div
        ref={topRef}
        className="bg-brand absolute inset-x-0 top-0 h-1/2 origin-top scale-y-0"
      />
      <div
        ref={bottomRef}
        className="bg-brand absolute inset-x-0 bottom-0 h-1/2 origin-bottom scale-y-0"
      />
    </div>
  );
}
