import { cn } from "@/lib/utils";

/**
 * 既定では非表示、`group/gallery`が付いた祖先要素をホバー/フォーカスした時だけ
 * 展示物の解説プレートのようなキャプションが下から現れる。
 * 常時UIを出さず写真そのものを主役にし、意味情報は求めた時だけ差し出す。
 */
export function GalleryCaption({
  eyebrow,
  caption,
  className,
}: {
  eyebrow: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 [clip-path:inset(100%_0_0_0)] transition-[opacity,clip-path] duration-500 ease-out group-hover/gallery:opacity-100 group-hover/gallery:[clip-path:inset(0_0_0_0)] group-focus-within/gallery:opacity-100 group-focus-within/gallery:[clip-path:inset(0_0_0_0)] lg:p-6",
        className
      )}
    >
      <span className="bg-brand mb-2 block h-px w-8" />
      <p className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase lg:text-xs">
        {eyebrow}
      </p>
      <p className="font-display mt-1 text-sm text-white italic lg:text-base">{caption}</p>
    </div>
  );
}
