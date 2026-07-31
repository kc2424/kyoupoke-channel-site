"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type ReactNode } from "react";

import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  useGSAP(() => {
    const lenis = new Lenis({ autoRaf: false });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    // スクロール速度に応じて --scroll-skew を更新し、勢いのある操作ほど
    // ページの一部要素がわずかに傾く「重み」を持たせる（'kin 等が持つ
    // "weighted" なスクロール物理を参考に、独自のCSS変数駆動で実装）
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    let skew = 0;

    const tick = (time: number) => {
      lenis.raf(time * 1000);

      if (reduceMotion) return;

      const target = gsap.utils.clamp(-6, 6, (lenis.velocity ?? 0) * 0.5);
      skew += (target - skew) * 0.12;
      root.style.setProperty("--scroll-skew", `${skew.toFixed(2)}deg`);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
      root.style.removeProperty("--scroll-skew");
    };
  }, []);

  return <>{children}</>;
}
