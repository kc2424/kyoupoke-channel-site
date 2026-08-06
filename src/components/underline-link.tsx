"use client";

import type { MouseEvent, ReactNode } from "react";

import { scrollToHash } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export function UnderlineLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
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
      className={cn("group relative inline-block pb-1", className)}
    >
      <span className="inline-block font-bold transition-colors duration-300 ease-out group-hover:text-brand">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}
