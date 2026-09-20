import { cn } from "@/lib/utils";

export function AmbientMeshBackground({ variant = "aurora" }: {
  variant?: "aurora" | "waves" | "dots" | "stripes" | "cinematic" | "matrix" | "ring" | "bubbles";
}) {
  return <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden",
    ["dots", "matrix"].includes(variant)
      ? "bg-[radial-gradient(#d9552e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06]"
      : "bg-[radial-gradient(ellipse_at_top_right,rgba(217,85,46,0.07),transparent_65%)]")}
  />;
}
