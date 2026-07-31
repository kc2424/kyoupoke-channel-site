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
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0",
          wipeColor
        )}
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </a>
  );
}
