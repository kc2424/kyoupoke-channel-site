"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ImageProps } from "next/image";
import Image from "@/components/site-image";
import { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxImage({
  wrapperClassName,
  className,
  alt,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const image = imageRef.current;
      if (!wrapper || !image) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        image,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", wrapperClassName)}>
      <Image
        ref={imageRef}
        alt={alt}
        className={cn("scale-110 object-contain will-change-transform", className)}
        {...props}
      />
    </div>
  );
}
