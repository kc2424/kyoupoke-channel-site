"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// フェードインしてからゆっくり広がるKen Burns風の演出。
// zoom: 1より大きくすると中央基準でさらに寄る(人物を大きく見せる)。
// parallax: trueだとスクロール量に応じて写真だけがゆっくり上下する視差効果を追加する。
export function HeroPhoto({
  src,
  alt,
  objectPosition = "object-top",
  zoom = 1,
  parallax = false,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  zoom?: number;
  parallax?: boolean;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = parallaxRef.current;
      if (!el || !parallax) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: parallaxRef, dependencies: [parallax] }
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0, scale: 1.12 * zoom }}
      animate={{ opacity: 0.9, scale: zoom }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [zoom, zoom * 1.06, zoom] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className={`object-cover ${objectPosition}`}
            style={{ transform: "translateY(-20px)" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
