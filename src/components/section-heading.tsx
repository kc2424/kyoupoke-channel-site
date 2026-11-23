import { RevealText } from "@/components/reveal-text";
import { cn } from "@/lib/utils";

// 全セクションの見出しブロックの型。
// 「章番号 + 英字ラベル」を1行にまとめ、その下に日本語見出しを置く2段構成で統一する。
const TONE_STYLES = {
  light: { label: "text-neutral-600", heading: "text-neutral-900", note: "text-neutral-600" },
  dark: { label: "text-white/70", heading: "text-white", note: "text-white/70" },
  brand: { label: "text-white", heading: "text-white", note: "text-white" },
} as const;

export function SectionHeading({
  index,
  total,
  label,
  heading,
  note,
  tone = "light",
  className,
}: {
  index?: number;
  total?: number;
  label?: string;
  heading: string;
  note?: string;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(index !== undefined || label) && (
        <p className={cn("font-mono text-xs font-bold tracking-widest uppercase lg:text-sm", styles.label)}>
          {index !== undefined && (
            <span>
              {String(index).padStart(2, "0")}
              {total !== undefined ? ` / ${String(total).padStart(2, "0")}` : ""}
            </span>
          )}
          {index !== undefined && label ? <span aria-hidden="true"> — </span> : null}
          {label}
        </p>
      )}
      <RevealText
        as="h2"
        text={heading}
        className={cn(
          "font-display text-3xl sm:text-4xl lg:text-5xl",
          styles.heading
        )}
      />
      {note && <p className={cn("text-sm leading-relaxed", styles.note)}>{note}</p>}
    </div>
  );
}
