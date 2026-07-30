import { cn } from "@/lib/utils";

export function LiveGlowFrame({
  children,
  className,
  rounded = "rounded-xl",
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn("animate-glow-spin pointer-events-none absolute -inset-[3px]", rounded)}
        style={{
          padding: 3,
          background:
            "conic-gradient(from 0deg, var(--brand), transparent 30%, transparent 70%, var(--brand))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className={cn("relative h-full w-full overflow-hidden", rounded)}>{children}</div>
    </div>
  );
}
