"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { WipeLink } from "@/components/wipe-link";

type MobileHeroCard = {
  id: string;
  name: string;
  role: string;
  tag: string;
  image: string;
  objectPos: string;
  quote: string;
  stats: string;
};

const MOBILE_HERO_CARDS: MobileHeroCard[] = [
  {
    id: "all",
    name: "今日ポケ 3人組",
    role: "対戦ガチ勢YouTuber",
    tag: "登録者 67万人+",
    image: "/hero-mobile.png",
    objectPos: "object-[50%_25%]",
    quote: "「世界トップクラスの対戦理論 ✕ 笑えるバラエティ」",
    stats: "総再生 12億回超",
  },
  {
    id: "banbee",
    name: "バンビー",
    role: "絶対的エース",
    tag: "最高レート 2415",
    image: "/members/banbee.png",
    objectPos: "object-[50%_15%]",
    quote: "「第7世代史上初2期連続1位 & SVシーズン1 歴代最高レート1位」",
    stats: "発起人 / エース",
  },
  {
    id: "iroha",
    name: "いろは",
    role: "論理の体現者",
    tag: "WCS2025 日本代表",
    image: "/members/iroha.png",
    objectPos: "object-[50%_15%]",
    quote: "「WCS2025 世界大会出場決定 & 構築デザイナー」",
    stats: "論理的対戦理論",
  },
  {
    id: "kuroko",
    name: "くろこ",
    role: "悟りの天才",
    tag: "最終1位 12回+",
    image: "/members/kuroko.png",
    objectPos: "object-[50%_15%]",
    quote: "「通算ランクマッチ最終1位 12回以上・歴代最多の最強プレイヤー」",
    stats: "悟り理論",
  },
];

export function MobileHeroCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = MOBILE_HERO_CARDS[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? MOBILE_HERO_CARDS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === MOBILE_HERO_CARDS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-b from-[#d9552e] via-[#b8431f] to-neutral-950 text-white shadow-2xl border-2 border-brand/40 sm:hidden">
      {/* メンバー写真ステージ（顔が絶対に見切れないフレーミング） */}
      <div className="relative w-full h-[62%] overflow-hidden bg-[#df5330]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={current.image}
              alt={current.name}
              fill
              priority
              quality={90}
              className={`object-cover ${current.objectPos}`}
            />
            {/* 上部・下部グラデーションスクリム */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950/90" />
          </motion.div>
        </AnimatePresence>

        {/* 上部ヘッダーバッジ */}
        <div className="relative z-10 flex items-center justify-between p-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-[11px] font-mono font-bold text-amber-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>{current.tag}</span>
          </span>

          <span className="rounded-full bg-black/60 border border-white/20 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md">
            0{activeIdx + 1} / 0{MOBILE_HERO_CARDS.length}
          </span>
        </div>

        {/* 左右ナビゲーション矢印ボタン */}
        <div className="relative z-10 flex items-center justify-between px-2 top-[20%]">
          <button
            onClick={handlePrev}
            aria-label="前へ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white border border-white/30 backdrop-blur-md active:scale-90 transition-transform shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="次へ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white border border-white/30 backdrop-blur-md active:scale-90 transition-transform shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 下部情報＆切り替えドック（顔に重ならない独立情報エリア） */}
      <div className="relative z-10 p-4 pt-2 bg-neutral-950/95 backdrop-blur-md border-t border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                  {current.role}
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">{current.stats}</span>
              </div>
            </div>

            <h2 className="font-wordmark mt-1 text-2xl font-bold text-white tracking-wide">
              {current.name}
            </h2>

            <p className="mt-1 text-xs text-neutral-300 leading-relaxed font-medium line-clamp-2">
              {current.quote}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ドットインジケーター ＆ 決定アクション */}
        <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-1.5">
            {MOBILE_HERO_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`スライド ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIdx === i ? "w-6 bg-brand shadow-sm" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>

          <WipeLink
            href="#videos"
            wipeColor="bg-black"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark border border-white/30 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-brand"
          >
            <Play className="h-3 w-3 fill-current text-amber-300" />
            <span>動画を見る</span>
          </WipeLink>
        </div>
      </div>
    </div>
  );
}
