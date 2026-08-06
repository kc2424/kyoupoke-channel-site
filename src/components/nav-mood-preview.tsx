"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { scrollToHash } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export type NavMoodItem = {
  label: string;
  href: string;
  caption: string;
  tone: "light" | "dark" | "brand";
  image?: string;
  icon?: ReactNode;
};

const panelToneClasses: Record<NavMoodItem["tone"], string> = {
  light: "bg-neutral-200 text-neutral-900",
  dark: "bg-black text-white",
  brand: "bg-brand text-white",
};

const barToneClasses: Record<NavMoodItem["tone"], string> = {
  light: "bg-neutral-400",
  dark: "bg-brand",
  brand: "bg-black",
};

/**
 * ヘッダーナビの各項目にホバー/フォーカスした瞬間、クリックする前にそのセクションの
 * 空気感（トーン色＋代表カット）だけを差し出すフローティングプレビュー。
 * GSAP不使用の純CSS transition（既存のMonoReveal/GalleryCaptionと同じ設計方針）。
 */
export function NavMoodPreview({ items, className }: { items: readonly NavMoodItem[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToHash(href);
    }
  };

  return (
    <nav
      className={cn(
        "hidden items-center gap-6 text-sm font-bold text-neutral-700 md:flex lg:gap-8 lg:text-base",
        className
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex(i)}
          onBlur={() => setActiveIndex(null)}
        >
          <a
            href={item.href}
            onClick={handleClick(item.href)}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            data-cursor-label={item.label}
            data-cursor-index={`${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`}
            className="group relative inline-block pb-1"
          >
            <span className="inline-block font-bold transition-[font-weight] duration-300 ease-out group-hover:font-black">
              {item.label}
            </span>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </a>

          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-full left-1/2 z-40 hidden w-48 -translate-x-1/2 origin-top overflow-hidden rounded-sm shadow-xl transition-all duration-300 ease-out lg:block",
              activeIndex === i ? "translate-y-3 opacity-100" : "translate-y-1 opacity-0"
            )}
          >
            <div className={cn("relative flex h-28 w-full items-center justify-center overflow-hidden", panelToneClasses[item.tone])}>
              {item.image ? (
                <Image src={item.image} alt="" fill sizes="192px" className="object-cover" />
              ) : (
                item.icon
              )}
              <div className={cn("absolute inset-x-0 bottom-0 h-1", barToneClasses[item.tone])} />
            </div>
            <div className="border border-t-0 border-black/10 bg-white px-3 py-2">
              <p className="text-xs font-bold text-neutral-900">{item.caption}</p>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}
