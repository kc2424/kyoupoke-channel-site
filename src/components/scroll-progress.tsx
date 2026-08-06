"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";

import { onLenisReady } from "@/lib/lenis";

type Section = { id: string; label: string };

/**
 * ページ全体の読了位置を、最上部の細いバーで常に静かに示す。
 * Bogdan Kolomiyets氏のポートフォリオ（CSS Design Awards Site of the Day）が、
 * ローディング演出から遷移まで「あらゆる小さな接点」に同じ抑制されたモーション言語を
 * 行き渡らせている点を参考に、派手さではなく機能に紐づく常時表示のインジケータとして追加。
 * Lenisのscrollイベントを購読するだけで、smooth-scroll.tsx側の
 * lenis.on('scroll', ScrollTrigger.update) の連携には手を加えない。
 *
 * `sections`を渡すと、バーの先端に「今どのセクションを読んでいるか」を示す
 * 小さなラベルが追従する（DesignRush Design Award「IFF 2025 Sustainability Report」
 * が、長いスクロール体験で常設のトップバーにセクション名を対応させ「読者が常に
 * 自分の位置を把握できる」ようにしている考え方を参考にした）。
 */
export function ScrollProgress({ sections }: { sections?: readonly Section[] }) {
  const barRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    let readyLenis: Lenis | null = null;
    const tracked = sections
      ?.map((section) => ({ ...section, el: document.getElementById(section.id) }))
      .filter((section): section is Section & { el: HTMLElement } => section.el !== null);

    function handleScroll({ progress }: { progress: number }) {
      const bar = barRef.current;
      if (bar) bar.style.transform = `scaleX(${progress})`;

      const tag = tagRef.current;
      if (tag) {
        tag.style.left = `${progress * 100}%`;
        tag.style.opacity = progress > 0.02 && progress < 0.995 ? "1" : "0";
      }

      if (!tracked || tracked.length === 0) return;
      const anchor = window.innerHeight * 0.4;
      let index = 0;
      for (let i = 0; i < tracked.length; i++) {
        if (tracked[i].el.getBoundingClientRect().top <= anchor) index = i;
      }
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        if (labelRef.current) labelRef.current.textContent = tracked[index].label;
      }
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
  }, [sections]);

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
      {sections && sections.length > 0 && (
        <div
          ref={tagRef}
          className="absolute top-2 left-0 -translate-x-1/2 opacity-0 transition-opacity duration-300"
        >
          <span
            ref={labelRef}
            className="font-display block rounded-full bg-black px-2 py-0.5 text-[9px] tracking-widest whitespace-nowrap text-white shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
