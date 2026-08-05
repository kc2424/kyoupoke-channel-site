"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Award } from "lucide-react";

export function MilestoneTracker() {
  const currentSubs = 67.3;
  const targetSubs = 100;
  const percentage = Math.min(100, Math.round((currentSubs / targetSubs) * 100));

  const [cheerCount, setCheerCount] = useState(1284);
  const [hasCheered, setHasCheered] = useState(false);

  const handleCheer = () => {
    if (hasCheered) return;
    setCheerCount((c) => c + 1);
    setHasCheered(true);
  };

  return (
    <div className="mt-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
            <Award className="h-4 w-4" />
            <span>CHANNEL MILESTONE TRACKER</span>
          </div>
          <h4 className="font-display mt-2 text-xl sm:text-2xl font-bold">
            金の盾（100万人）達成へのロードマップ
          </h4>
        </div>

        {/* 応援ボタン */}
        <button
          onClick={handleCheer}
          disabled={hasCheered}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md ${
            hasCheered
              ? "bg-red-500/20 text-red-300 border border-red-500/40"
              : "bg-gradient-to-r from-red-500 to-amber-500 text-white hover:scale-105 active:scale-95"
          }`}
        >
          <Heart className={`h-4 w-4 fill-current ${hasCheered ? "text-red-400" : "animate-pulse"}`} />
          <span>{hasCheered ? "応援送信完了！" : "ファンとして応援する"}</span>
          <span className="font-mono text-xs opacity-90">({cheerCount})</span>
        </button>
      </div>

      {/* プログレスバー */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold font-mono">
          <span className="text-amber-400">現在: {currentSubs} 万人</span>
          <span className="text-neutral-400">目標: {targetSubs} 万人 (金の盾)</span>
        </div>

        <div className="mt-2.5 h-4 w-full rounded-full bg-neutral-800 p-0.5 border border-neutral-700 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 shadow-lg relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>達成度: {percentage}%</span>
          </span>
          <span>あと { (targetSubs - currentSubs).toFixed(1) } 万人で到達！</span>
        </div>
      </div>
    </div>
  );
}
