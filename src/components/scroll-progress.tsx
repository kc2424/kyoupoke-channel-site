"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";

import { onLenisReady } from "@/lib/lenis";

/**
 * ページ全体の読了位置を、最上部の細いバーで常に静かに示す。
 * Bogdan Kolomiyets氏のポートフォリオ（CSS Design Awards Site of the Day）が、
 * ローディング演出から遷移まで「あらゆる小さな接点」に同じ抑制されたモーション言語を
 * 行き渡らせている点を参考に、派手さではなく機能に紐づく常時表示のインジケータとして追加。
 * Lenisのscrollイベントを購読するだけで、smooth-scroll.tsx側の
 * lenis.on('scroll', ScrollTrigger.update) の連携には手を加えない。
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let readyLenis: Lenis | null = null;

    function handleScroll({ progress }: { progress: number }) {
      const bar = barRef.current;
      if (!bar) return;
      bar.style.transform = `scaleX(${progress})`;
    }

    const cancelReady = onLenisReady((lenis) => {
      readyLenis = lenis;
      lenis.on("scroll", handleScroll);
      handleScroll({ progress: lenis.progress });
    });

    return () => {
      cancelReady();
      readyLenis?.off("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-black/5"
    >
      <div
        ref={barRef}
        className="bg-brand h-full w-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
