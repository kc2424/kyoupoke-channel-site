"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Swords } from "lucide-react";

type PartyTeam = {
  id: string;
  name: string;
  user: "バンビー" | "いろは" | "くろこ";
  pokemon: string[];
  typeTag: string;
  description: string;
  accent: string;
};

const TEAMS: PartyTeam[] = [
  {
    id: "banbee-koraidon",
    name: "晴れアグロ コライドン構築",
    user: "バンビー",
    pokemon: ["コライドン", "ハバタクカミ", "イーユイ", "パオジアン", "カイリュー", "ディンルー"],
    typeTag: "対面構築",
    description: "晴れ補正の超火力で上から押し切る、バンビー得意のアグロ高火力対面パーティ。",
    accent: "from-amber-500 to-orange-600",
  },
  {
    id: "iroha-calyrex",
    name: "論理的 サイクル黒バドレックス",
    user: "いろha",
    userFull: "いろは",
    pokemon: ["黒馬バドレックス", "ウーラオス", "カイリュー", "チオンジェン", "ドヒドイデ", "キョジオーン"],
    typeTag: "サイクル構築",
    description: "相手の受け崩しと定石を完封する、いろは考案の高度な論理的サイクルパーティ。",
    accent: "from-orange-500 to-red-600",
  },
  {
    id: "kuroko-miraidon",
    name: "悟り理論 ミライドンスタン",
    user: "くろこ",
    pokemon: ["ミライドン", "ハバタクカミ", "パオジアン", "ディンルー", "サーフゴー", "ヘイラッシャ"],
    typeTag: "グッドステッフ",
    description: "通算12回以上1位のくろこが愛用する、圧倒的な対応力と最善手を生むスタン構築。",
    accent: "from-amber-600 to-neutral-900",
  },
] as (PartyTeam & { userFull?: string })[];

export function PartyDeckPreview() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = TEAMS[activeIdx];

  return (
    <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
            <Swords className="h-4 w-4" />
            <span>今日ポケ 象徴パーティチーム構築</span>
          </div>
          <h4 className="font-display mt-1 text-xl font-bold">動画で活躍した名構築アーカイブ</h4>
        </div>

        {/* チーム切り替えタブ */}
        <div className="flex items-center gap-1.5 rounded-full bg-neutral-800 p-1">
          {TEAMS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                activeIdx === idx
                  ? "bg-amber-500 text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.user}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className={`inline-block rounded-full bg-gradient-to-r ${current.accent} px-3 py-0.5 text-xs font-bold text-white`}>
                {current.typeTag}
              </span>
              <h5 className="font-display mt-2 text-lg sm:text-2xl font-bold text-white">{current.name}</h5>
            </div>
            <span className="text-xs font-mono text-neutral-400">使用: {current.user}</span>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {current.description}
          </p>

          {/* 6匹のポケモンチップ */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {current.pokemon.map((poke, i) => (
              <div
                key={poke}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-800/60 px-3 py-2.5 text-xs font-bold text-neutral-200"
              >
                <span>{poke}</span>
                <span className="font-mono text-[10px] text-amber-400">#0{i + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
