import type { ReactNode } from "react";

// Content remains visible before hydration and if JavaScript is unavailable.
export function FadeIn({ children, className }: {
  children: ReactNode; delay?: number; x?: number; y?: number; className?: string;
}) {
  return <div className={className}>{children}</div>;
}
