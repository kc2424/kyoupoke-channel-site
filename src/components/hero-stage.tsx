"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Flame } from "lucide-react";
import { WipeLink } from "@/components/wipe-link";

const MEMBER_HIGHLIGHTS = [
  {
    id: "banbee",
    name: "バンビー",
    role: "絶対的エース",
    quote: "「第7世代史上初2期連続1位 & SVシーズン1 歴代最高レート1位」",
    tag: "発起人 / エース",
    icon: Flame,
    color: "from-amber-500 to-orange-600",
    stats: "最高レート 2415",
  },
  {
    id: "iroha",
    name: "いろは",
    role: "論理の体現者",
    quote: "「WCS 2025 世界大会出場決定 & 構築デザイナー」",
    tag: "WCS日本代表",
    icon: Trophy,
    color: "from-orange-500 to-red-600",
    stats: "PJCS / WCS 出場権",
  },
  {
    id: "kuroko",
    name: "くろこ",
    role: "悟りの天才",
    quote: "「通算ランクマッチ最終1位 12回以上・歴代最多の最強プレイヤー」",
    tag: "最終1位 12回+",
    icon: Sparkles,
    color: "from-amber-600 to-amber-700",
    stats: "最終1位 12回超",
  },
];

export function HeroStage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMember = MEMBER_HIGHLIGHTS[activeIdx];
  const IconComponent = activeMember.icon;

  return (
    <div className="relative z-20 mt-6 w-full max-w-3xl px-4 sm:px-0">
      {/* 3人切り替えタブ */}
      <div className="flex items-center justify-center gap-2 rounded-full border border-white/40 bg-black/40 p-1.5 backdrop-blur-xl shadow-xl">
        {MEMBER_HIGHLIGHTS.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setActiveIdx(idx)}
            className={`relative flex-1 rounded-full py-2 px-3 text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeIdx === idx
                ? "text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            {activeIdx === idx && (
              <motion.div
                layoutId="active-hero-tab"
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${m.color}`}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <span>{m.name}</span>
              <span className="hidden sm:inline text-[10px] opacity-80">({m.role})</span>
            </span>
          </button>
        ))}
      </div>

      {/* 選択中メンバーのダイナミックハイライトバナー */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMember.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-4 rounded-2xl border border-white/20 bg-black/60 p-4 sm:p-5 text-white backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeMember.color} text-white shadow-md`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold">{activeMember.name}</h3>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300">
                    {activeMember.tag}
                  </span>
                </div>
                <p className="mt-0.5 text-xs sm:text-sm text-neutral-200 italic font-medium">
                  {activeMember.quote}
                </p>
              </div>
            </div>

            <WipeLink
              href="#members"
              wipeColor="bg-amber-500"
              className="self-end sm:self-auto rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white border-white/30 hover:border-white"
            >
              プロフィール詳細 →
            </WipeLink>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
