import { cn } from "@/lib/utils";

export type AchievementIconName = "award" | "tv" | "controller" | "globe" | "live" | "cards";

const paths: Record<AchievementIconName, string> = {
  award: "M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.2l-4.8 2.56.92-5.34L4.24 7.64l5.36-.78L12 2zM9 16.5L6 21l6-2.6L18 21l-3-4.5",
  tv: "M4 6h16v11H4z M9 21h6 M8 6l3-3 M16 6l-3-3",
  controller: "M7 8h2 M6 9v2 M15 9h.01 M17 11h.01 M6 6h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.2 2.05L15 13.5H9l-1.8 1.55A3 3 0 0 1 2 13v-3a4 4 0 0 1 4-4z",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18z M3.6 9h16.8 M3.6 15h16.8 M12 3a13 13 0 010 18 M12 3a13 13 0 000 18",
  live: "M12 3v12 M8 6a7 7 0 000 12 M16 6a7 7 0 010 12 M5 3a11 11 0 000 18 M19 3a11 11 0 010 18",
  cards: "M5 8l11-3 2.5 9.5L7.5 17.5z M5 8v10h10",
};

/**
 * 実績カード用の色分けアイコンバッジ。カードの背景色（オレンジ/黒）と逆転した
 * 高コントラストの円で、本文を読む前に「種類」が一目で伝わることを狙う。
 */
export function AchievementIcon({
  name,
  tone,
  className,
}: {
  name: AchievementIconName;
  tone: "brand" | "black";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full lg:h-11 lg:w-11",
        tone === "brand" ? "bg-white/90 text-brand" : "bg-brand text-white",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 lg:h-5 lg:w-5"
      >
        <path d={paths[name]} />
      </svg>
    </span>
  );
}
