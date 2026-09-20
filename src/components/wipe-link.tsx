import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function WipeLink({
  href,
  children,
  className,
  wipeColor = "bg-black",
  cursorLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  wipeColor?: string;
  cursorLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-label={cursorLabel}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
        className
      )}
    >
      {/* PC版限定の1.0秒アニメーションワイプ帯 */}
      <span
        className={cn(
          "absolute inset-0 hidden -translate-x-full transition-transform duration-[1000ms] ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none sm:block",
          wipeColor
        )}
      />
      <span className="relative z-10 transition-colors duration-200 sm:duration-[1000ms] sm:group-hover:text-white sm:group-focus-visible:text-white motion-reduce:transition-none">
        {children}
      </span>
    </a>
  );
}
