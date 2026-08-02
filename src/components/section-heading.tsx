import { ChapterMark } from "@/components/chapter-mark";
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
  total = 5,
  label,
  heading,
  note,
  tone = "light",
  className,
}: {
  index: number;
  total?: number;
  label: string;
  heading: string;
  note?: string;
  tone?: keyof typeof TONE_STYLES;
  className?: string;
}) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <ChapterMark index={index} total={total} tone={tone} />
          <span
            className={cn(
              "text-xs font-bold tracking-widest uppercase lg:text-sm",
              styles.label
            )}
          >
            {label}
          </span>
        </div>
        <RevealText
          as="h2"
          text={heading}
          className={cn(
            "font-display mt-3 text-3xl sm:text-4xl lg:text-5xl",
            styles.heading
          )}
        />
      </div>
      {note && (
        <p className={cn("text-sm lg:text-right lg:text-base", styles.note)}>{note}</p>
      )}
    </div>
  );
}
