"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Trophy, Flame, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { WipeLink } from "@/components/wipe-link";

type MobileHeroCard = {
  id: string;
  name: string;
  role: string;
  tag: string;
  image: string;
  quote: string;
  stats: string;
  color: string;
};

const MOBILE_HERO_CARDS: MobileHeroCard[] = [
  {
    id: "all",
    name: "今日ポケ 3人組",
    role: "対戦ガチ勢YouTuber",
    tag: "登録者 67万人+",
    image: "/hero-mobile.png",
    quote: "「世界トップクラスの対戦理論 ✕ 笑えるバラエティ」",
    stats: "総再生 12億回超",
    color: "from-amber-500 via-orange-600 to-amber-700",
  },
  {
    id: "banbee",
    name: "バンビー",
    role: "絶対的エース",
    tag: "最高レート 2415",
    image: "/members/banbee.png",
    quote: "「第7世代史上初2期連続1位 & SVシーズン1 歴代最高レート1位」",
    stats: "発起人 / エース",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "iroha",
    name: "いろは",
    role: "論理の体現者",
    tag: "WCS2025 日本代表",
    image: "/members/iroha.png",
    quote: "「WCS2025 世界大会出場決定 & 構築デザイナー」",
    stats: "論理的対戦理論",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "kuroko",
    name: "くろこ",
    role: "悟りの天才",
    tag: "最終1位 12回+",
    image: "/members/kuroko.png",
    quote: "「通算ランクマッチ最終1位 12回以上・歴代最多の最強プレイヤー」",
    stats: "悟り理論",
    color: "from-amber-600 to-neutral-900",
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
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-2xl border border-white/10 sm:hidden">
      {/* 背景写真（切替アニメーション付き） */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.name}
            fill
            priority
            quality={90}
            className="object-cover object-top"
          />
          {/* 可読性グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* 上部ヘッダーバッジ */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-mono font-bold text-amber-300 backdrop-blur-md">
          <Sparkles className="h-3 w-3" />
          <span>{current.tag}</span>
        </span>

        <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md">
          0{activeIdx + 1} / 0{MOBILE_HERO_CARDS.length}
        </span>
      </div>

      {/* 左右ナビゲーション矢印ボタン */}
      <div className="relative z-10 flex items-center justify-between px-2">
        <button
          onClick={handlePrev}
          aria-label="前へ"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 border border-white/20 backdrop-blur-md active:scale-90 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="次へ"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 border border-white/20 backdrop-blur-md active:scale-90 transition-transform"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* 下部情報＆切り替えドック */}
      <div className="relative z-10 p-5 pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full bg-gradient-to-r ${current.color} px-2.5 py-0.5 text-[10px] font-bold text-white`}>
                {current.role}
              </span>
              <span className="text-xs font-mono text-neutral-300">{current.stats}</span>
            </div>

            <h2 className="font-wordmark mt-1 text-3xl font-bold text-white drop-shadow-md">
              {current.name}
            </h2>

            <p className="mt-1 text-xs text-neutral-200 leading-relaxed font-medium line-clamp-2">
              {current.quote}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ドットインジケーター */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {MOBILE_HERO_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIdx === i ? "w-6 bg-amber-400" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <WipeLink
            href="#videos"
            wipeColor="bg-amber-500"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-neutral-950 shadow-lg"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>動画再生</span>
          </WipeLink>
        </div>
      </div>
    </div>
  );
}
