"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Calendar, Trophy, Award } from "lucide-react";

type MilestoneEvent = {
  year: string;
  title: string;
  sub: string;
  description: string;
  tag: string;
};

const EVENTS: MilestoneEvent[] = [
  {
    year: "2021.08",
    title: "今日ポケ チャンネル開設・活動開始",
    sub: "バンビー・いろは・くろこが結成",
    description: "より自由で面白いポケモン対戦企画を届けるため、YouTube「今日ポケch.」の動画配信をスタート。",
    tag: "チャンネル開設",
  },
  {
    year: "2022.09",
    title: "YouTube 銀の盾 達成",
    sub: "チャンネル登録者数 10万人突破",
    description: "YouTube Creator Awardsの銀の盾を受賞。ファン感謝企画や記念配信を開催。",
    tag: "銀の盾受賞",
  },
  {
    year: "2022.12",
    title: "SV シーズン1 歴代最高レート1位",
    sub: "バンビーがレート 2415 を記録",
    description: "ポケットモンスター スカーレット・バイオレットの初シーズンで圧倒的な最高レート2415を獲得し最終1位に君臨。",
    tag: "最終1位",
  },
  {
    year: "2025.06",
    title: "WCS 2025 世界大会 出場権獲得",
    sub: "いろは選手が日本代表に決定",
    description: "ポケモンジャパンチャンピオンシップス（PJCS2025）を勝ち抜き、世界大会（WCS2025）への切符を獲得。",
    tag: "世界大会出場",
  },
];

export function BattleTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = EVENTS[activeIdx];

  return (
    <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
            <History className="h-4 w-4" />
            <span>HISTORICAL MILESTONE CHRONICLE</span>
          </div>
          <h4 className="font-display mt-1 text-xl font-bold">今日ポケ 栄光の軌跡タイムライン</h4>
        </div>

        {/* 年表タブ */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-neutral-800 p-1">
          {EVENTS.map((e, idx) => (
            <button
              key={e.year}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full px-3 py-1 text-xs font-mono font-bold transition-all ${
                activeIdx === idx
                  ? "bg-amber-500 text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {e.year}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.year}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>{current.year}</span>
            </span>
            <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold">
              {current.tag}
            </span>
          </div>

          <h5 className="font-display mt-2 text-lg sm:text-2xl font-bold text-white">{current.title}</h5>
          <p className="mt-1 text-xs font-bold text-neutral-400">{current.sub}</p>
          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            {current.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
