"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function GiantTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(ref.current, { scale: 1 + self.progress * 0.06 });
        },
      });

      return () => trigger.kill();
    },
    { scope: ref }
  );

  return (
    <h1
      ref={ref}
      className="font-logo text-brand w-full scale-y-110 text-center text-[16vw] leading-[0.95] tracking-tight sm:text-[11vw]"
    >
      {children}
    </h1>
  );
}
