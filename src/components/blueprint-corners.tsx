import { cn } from "@/lib/utils";

const TONE_STYLES = {
  light: "border-white/80",
  dark: "border-black/70",
  brand: "border-brand",
} as const;

export function BlueprintCorners({
  tone = "light",
  label,
  className,
}: {
  tone?: keyof typeof TONE_STYLES;
  label?: string;
  className?: string;
}) {
  const border = TONE_STYLES[tone];

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-3", className)}>
      <span className={cn("absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2", border)} />
      <span className={cn("absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2", border)} />
      <span className={cn("absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2", border)} />
      <span className={cn("absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2", border)} />
      {label ? (
        <span
          className={cn(
            // 写真やイラストの上に直接載る注記なので、背景色に頼らず
            // 影で下地から浮かせて可読性を確保する。
            "absolute bottom-1 left-6 font-mono text-[10px] tracking-widest uppercase lg:text-xs",
            tone === "light"
              ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]"
              : "text-black/80 [text-shadow:0_1px_3px_rgba(255,255,255,0.7)]"
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
