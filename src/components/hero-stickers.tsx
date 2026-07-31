"use client";

import { StickerDrag } from "@/components/sticker-drag";

export function HeroStickers() {
  return (
    <div
      data-hero-bounds
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      aria-hidden="true"
    >
      <div className="pointer-events-auto absolute top-[16%] left-[6%]">
        <StickerDrag boundsSelector="[data-hero-bounds]" rotate={-8} className="bg-brand text-white">
          登録者67万人+
        </StickerDrag>
      </div>
      <div className="pointer-events-auto absolute right-[7%] bottom-[24%]">
        <StickerDrag boundsSelector="[data-hero-bounds]" rotate={6} className="bg-black text-white">
          総再生12億回+
        </StickerDrag>
      </div>
    </div>
  );
}
