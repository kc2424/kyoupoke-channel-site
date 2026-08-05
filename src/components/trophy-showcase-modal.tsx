"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Shield, Flame, X } from "lucide-react";

type MemberTrophy = {
  name: string;
  role: string;
  peakRate: string;
  titles: string[];
  description: string;
  badgeColor: string;
};

const TROPHIES: MemberTrophy[] = [
  {
    name: "バンビー",
    role: "絶対的エース",
    peakRate: "レート 2415 (歴代最高)",
    titles: ["SV シーズン1 最終1位", "USUM 2期連続最終1位", "今日ポケch. 発起人"],
    description: "史上初のUSUM2期連続1位、そしてSV最初のシーズンで歴代最高レート2415を獲得した絶対的エース。",
    badgeColor: "from-amber-500 to-orange-600",
  },
  {
    name: "いろは",
    role: "論理の体現者",
    peakRate: "WCS2025 世界大会出場権",
    titles: ["PJCS2025 日本代表", "第7世代 シングル最終6位", "ORAS レート2200達成"],
    description: "独自のパーティー構築センス『構築デザイナー』として知られ、2025年WCS世界大会出場を決定づけた論理の体現者。",
    badgeColor: "from-orange-500 to-red-600",
  },
  {
    name: "くろこ",
    role: "悟りの天才",
    peakRate: "通算 最終1位 12回以上",
    titles: ["ランクマッチ 最終1位12回+", "剣盾2大巨頭の筆頭", "初参戦レート2000達成"],
    description: "圧倒的な勝率と冷静な『悟り』の対戦理論で、通算ランクマッチ1位を12回以上獲得した超天才。",
    badgeColor: "from-amber-600 to-neutral-800",
  },
];

export function TrophyShowcaseModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 backdrop-blur-md hover:bg-amber-500/20 transition-all shadow-sm"
      >
        <Trophy className="h-4 w-4" />
        <span>殿堂入りトロフィー・実績</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <Trophy className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-display text-xl font-bold">メンバー殿堂入りトロフィー</h3>
                  <p className="text-xs text-neutral-400">KYOUPOKE Hall of Fame & Peak Ratings</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {TROPHIES.map((t) => (
                  <div
                    key={t.name}
                    className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/40 p-5 sm:p-6 backdrop-blur-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-700/60 pb-3">
                      <div>
                        <span className={`inline-block rounded-full bg-gradient-to-r ${t.badgeColor} px-3 py-1 text-xs font-bold text-white`}>
                          {t.role}
                        </span>
                        <h4 className="font-display mt-2 text-2xl font-bold text-white">{t.name}</h4>
                      </div>
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-right">
                        <span className="block text-[10px] font-mono text-amber-300 uppercase tracking-widest">Peak Distinction</span>
                        <span className="font-mono text-base font-bold text-amber-400">{t.peakRate}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.titles.map((title) => (
                        <span
                          key={title}
                          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/20"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{title}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
