"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const TONE_DOT = {
  light: "bg-neutral-300",
  dark: "bg-black",
  brand: "bg-brand",
} as const;

export function ActIndex({
  acts,
}: {
  acts: readonly { id: string; label: string; tone: keyof typeof TONE_DOT }[];
}) {
  const [active, setActive] = useState(0);
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const triggers = acts.map((act, i) =>
        ScrollTrigger.create({
          trigger: `#${act.id}`,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        })
      );

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: scopeRef, dependencies: [acts] }
  );

  return (
    <div
      ref={scopeRef}
      className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 lg:block"
    >
      <nav
        aria-label="セクション目次"
        className="flex flex-col items-end gap-3 rounded-full bg-white/80 px-3 py-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm"
      >
        {acts.map((act, i) => (
          <a key={act.id} href={`#${act.id}`} className="group flex items-center gap-2 py-1">
            <span
              className={cn(
                "font-display text-[10px] tracking-widest whitespace-nowrap text-neutral-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                i === active && "opacity-100"
              )}
            >
              {act.label}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                TONE_DOT[act.tone],
                i === active ? "h-2.5 w-2.5" : "h-1.5 w-1.5 opacity-50"
              )}
            />
          </a>
        ))}
      </nav>
    </div>
  );
}
