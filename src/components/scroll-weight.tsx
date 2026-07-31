import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * `--scroll-skew`（src/components/smooth-scroll.tsx がスクロール速度から算出）を
 * そのまま傾きに変換するだけの薄いラッパー。エディトリアルな大見出しなど
 * 「ここぞ」という一箇所に限定して使う（多用すると煩雑になるため）。
 */
export function ScrollWeight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("will-change-transform", className)}
      style={{ transform: "skewY(var(--scroll-skew, 0deg))" }}
    >
      {children}
    </div>
  );
}
