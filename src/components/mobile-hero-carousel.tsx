"use client";

import { ChevronDown } from "lucide-react";
import { GiantTitle } from "@/components/giant-title";
import { HeroStickers } from "@/components/hero-stickers";

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
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
      </div>

      {/* ヒーロー画面に浮いてるふわふわステッカー */}
      <HeroStickers />

      {/* 下部：白グラデーション上のタイトグラフィック・PC版文言・スクロール案内 */}
      <div className="relative z-10 p-6 pb-12 flex flex-col items-center text-center">
        {/* KYOU POKE タイトル：位置を少し上に持って行き、文字サイズを大きく強調 */}
        <div className="mb-3 scale-110 sm:scale-100">
          <GiantTitle>KYOU POKE</GiantTitle>
        </div>

        {/* PC版の文言（タグラインテキスト） */}
        <p className="mt-2 max-w-xs text-xs leading-relaxed font-bold text-neutral-800 whitespace-pre-line">
          世界トップクラスの対戦理論と、笑えるバラエティ企画を届ける
          {"\n"}
          ポケモン対戦YouTuberグループ。
        </p>

        {/* Scroll 指示 */}
        <a href="#profile" className="mt-6 flex flex-col items-center gap-1 text-[#d9552e] hover:text-[#b8431f] transition-colors">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SCROLL</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-[#d9552e]" />
        </a>
      </div>
    </div>
  );
}
