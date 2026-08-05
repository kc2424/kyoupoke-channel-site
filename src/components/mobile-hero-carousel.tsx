"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ChevronDown, Play } from "lucide-react";
import { GiantTitle } from "@/components/giant-title";
import { WipeLink } from "@/components/wipe-link";

export function MobileHeroCarousel() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950 text-white sm:hidden">
      {/* スマホ全画面ぴったりに敷き詰める大判ヒーロー画像（顔部分は100%クリア・モヤ一切なし） */}
      <div className="absolute inset-0">
        <Image
          src="/hero-mobile.png"
          alt="今日ポケ メンバー"
          fill
          unoptimized
          priority
          quality={95}
          className="object-cover object-[50%_10%]"
        />
        {/* 顔には一切被らないよう、文字がある最下部35%のみにグラデーションを限定 */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* 上部ヘッダーバッジ */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-[#b8431f]/90 px-3.5 py-1 text-xs font-mono font-bold text-white backdrop-blur-md shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>登録者 67万人突破</span>
        </span>

        <span className="rounded-full bg-[#d9552e] border border-amber-300/40 px-3 py-1 font-mono text-xs font-bold text-white shadow-md">
          FAN SITE
        </span>
      </div>

      {/* 下部：大判タイトグラフィック・コピー・スクロール案内 */}
      <div className="relative z-10 p-6 pb-8 flex flex-col items-center text-center">
        <GiantTitle>KYOU POKE</GiantTitle>

        <p className="mt-2 text-xs font-bold text-amber-300 tracking-widest uppercase">
          バンビー ✕ いろは ✕ くろこ
        </p>

        <p className="mt-2 max-w-xs text-xs sm:text-sm text-neutral-100 leading-relaxed font-medium">
          世界トップクラスの対戦理論 ✕ 笑えるバラエティ
          <br />
          ポケモン対戦YouTubeチャンネル「今日ポケ」
        </p>

        <div className="mt-6 flex items-center gap-3 w-full max-w-xs">
          <WipeLink
            href="#videos"
            wipeColor="bg-black"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d9552e] to-[#b8431f] border border-amber-300/40 px-5 py-3.5 text-xs font-bold text-white shadow-2xl hover:scale-105 transition-transform"
          >
            <Play className="h-3.5 w-3.5 fill-current text-amber-300" />
            <span>最新動画を見る</span>
          </WipeLink>
        </div>

        {/* Scroll 指示 */}
        <a href="#profile" className="mt-6 flex flex-col items-center gap-1 text-amber-300/90 hover:text-white transition-colors">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SCROLL</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-amber-400" />
        </a>
      </div>
    </div>
  );
}
