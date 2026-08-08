import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Bentoグリッドの1マス。
 * hoverで浮き上がる共通のマイクロインタラクションと、
 * flat寄りのカード見た目（太めのボーダー + 角丸 + 影は控えめ）をここに集約する。
 *
 * href を渡すとカード全体がリンクになる（内部パスは next/link、httpは新規タブ）。
 */
export function BentoCard({
  children,
  className,
  href,
  tone = "light",
  cursorLabel,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  tone?: "light" | "brand" | "dark" | "warm";
  cursorLabel?: string;
  interactive?: boolean;
}) {
  const toneStyles = {
    light: "border-neutral-200 bg-white text-neutral-900",
    brand: "border-brand bg-brand text-white",
    dark: "border-neutral-900 bg-neutral-900 text-white",
    // ブランドオレンジを淡く敷いた暖色トーン。黒ほど浮かず、白カードとも並べやすい。
    warm: "border-brand/30 bg-[#fff1e4] text-neutral-900",
  }[tone];

  const classes = cn(
    "relative flex flex-col overflow-hidden rounded-2xl border-2 p-6 lg:p-8",
    "transition-all duration-300 ease-out",
    toneStyles,
    interactive &&
      "hover:-translate-y-1.5 hover:shadow-lg focus-visible:-translate-y-1.5 focus-visible:outline-none",
    interactive && tone === "light" && "hover:border-brand",
    className
  );

  if (!href) {
    return <div className={classes}>{children}</div>;
  }

  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-label={cursorLabel}
        className={cn(classes, "group")}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} data-cursor-label={cursorLabel} className={cn(classes, "group")}>
      {children}
    </Link>
  );
}
