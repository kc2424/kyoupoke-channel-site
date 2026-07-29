"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function RevealText({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: "h2" | "h3" | "p" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const chars = ref.current.querySelectorAll(".reveal-char");

      gsap.set(chars, { yPercent: 130, opacity: 0 });

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 88%",
        onEnter: () => {
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: { each: 0.025, from: "end" },
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span className="reveal-char inline-block will-change-transform">
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </Tag>
  );
}
