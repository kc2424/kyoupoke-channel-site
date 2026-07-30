import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 既定は白黒(グレースケール)で沈め、`group/mono`が付いた祖先要素をホバーした時だけ色を解禁する。
 * 動画サムネイルなど「コンテンツ自体の色を主役にする」場面で使う。
 */
export function MonoReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grayscale-[85%] contrast-110 saturate-0 transition-[filter] duration-700 ease-out group-hover/mono:grayscale-0 group-hover/mono:contrast-100 group-hover/mono:saturate-100",
        className
      )}
    >
      {children}
    </div>
  );
}
