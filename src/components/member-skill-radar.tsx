"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

type SkillStat = {
  name: string;
  role: string;
  stats: { label: string; score: number }[];
  accent: string;
};

const MEMBER_SKILLS: SkillStat[] = [
  {
    name: "バンビー",
    role: "絶対的エース",
    stats: [
      { label: "超火力・対面勝負力", score: 99 },
      { label: "逆転クラッチ力", score: 98 },
      { label: "YouTube企画推進力", score: 96 },
      { label: "対戦メンタル", score: 97 },
    ],
    accent: "bg-amber-500",
  },
  {
    name: "いろは",
    role: "論理の体現者",
    stats: [
      { label: "パーティー構築センス", score: 99 },
      { label: "論理的立ち回り理論", score: 98 },
      { label: "安定感・勝率", score: 97 },
      { label: "解説・トーク力", score: 95 },
    ],
    accent: "bg-orange-600",
  },
  {
    name: "くろこ",
    role: "悟りの天才",
    stats: [
      { label: "悟り理論・最善手", score: 100 },
      { label: "通算勝率・再現性", score: 99 },
      { label: "冷徹な状況判断", score: 98 },
      { label: "謙虚ギャップ魅力", score: 96 },
    ],
    accent: "bg-neutral-800",
  },
];

export function MemberSkillRadar() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = MEMBER_SKILLS[selectedIdx];

  return (
    <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand uppercase">
            <Zap className="h-4 w-4" />
            <span>MEMBER COMPETITIVE METRICS</span>
          </div>
          <h4 className="font-display mt-1 text-xl font-bold text-neutral-900">プレイヤー能力アナリティクス</h4>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 p-1">
          {MEMBER_SKILLS.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? "bg-brand text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h5 className="font-display text-lg font-bold text-neutral-900">{current.name}</h5>
          <span className="text-xs font-bold text-neutral-500">{current.role}</span>
        </div>

        <div className="mt-4 space-y-4">
          {current.stats.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>{s.label}</span>
                <span className="font-mono text-brand">{s.score} / 100</span>
              </div>
              <div className="mt-1.5 h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden border border-neutral-200">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${s.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${current.accent}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
