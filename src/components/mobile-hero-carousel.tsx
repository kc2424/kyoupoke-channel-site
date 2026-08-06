"use client";

import { Sparkles, ChevronDown, Play } from "lucide-react";
import { GiantTitle } from "@/components/giant-title";
import { WipeLink } from "@/components/wipe-link";

export function MobileHeroCarousel() {
  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-end overflow-hidden bg-white text-neutral-900 sm:hidden">
      {/* 画面いっぱいに敷き詰める大判ヒーロー画像（100dvhフル表示） */}
      <div className="absolute inset-0">
        <img
          src="/hero-mobile.png"
          alt="今日ポケ メンバー"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* 下部：黒ではなく純白（ホワイト）のなめらかなグラデーションオーバーレイ */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
      </div>

      {/* 下部：白グラデーション上のタイトグラフィック・コピー・スクロール案内 */}
      <div className="relative z-10 p-6 pb-8 flex flex-col items-center text-center">
        <GiantTitle>KYOU POKE</GiantTitle>



        <div className="mt-6 flex items-center gap-3 w-full max-w-xs">
          <WipeLink
            href="#videos"
            wipeColor="bg-black"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d9552e] to-[#b8431f] border border-amber-400/40 px-5 py-3.5 text-xs font-bold text-white shadow-2xl hover:scale-105 transition-transform"
          >
            <Play className="h-3.5 w-3.5 fill-current text-amber-300" />
            <span>最新動画を見る</span>
          </WipeLink>
        </div>

        {/* Scroll 指示 */}
        <a href="#profile" className="mt-6 flex flex-col items-center gap-1 text-[#d9552e] hover:text-[#b8431f] transition-colors">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SCROLL</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-[#d9552e]" />
        </a>
      </div>
    </div>
  );
}
