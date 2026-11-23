"use client";

import type { MouseEvent, ReactNode } from "react";

import { scrollToHash } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export function UnderlineLink({
  href,
  children,
  className,
  cursorLabel,
  cursorIndex,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  cursorLabel?: string;
  cursorIndex?: string;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      href.startsWith("#") &&
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      scrollToHash(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      data-cursor-label={cursorLabel}
      data-cursor-index={cursorIndex}
      className={cn("group relative inline-block rounded-sm pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2", className)}
    >
      <span className="inline-block font-bold transition-colors duration-300 ease-out group-hover:text-brand">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand-dark transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
    </a>
  );
}
