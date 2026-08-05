"use client";

import { useState } from "react";
import { Shield, Sparkles } from "lucide-react";

type TypeMatchup = {
  type: string;
  strongAgainst: string[];
  weakAgainst: string[];
  color: string;
};

const TYPES: TypeMatchup[] = [
  { type: "ほのお (Fire)", strongAgainst: ["くさ", "こおり", "むし", "はがね"], weakAgainst: ["みず", "じめん", "いわ"], color: "bg-orange-600" },
  { type: "みず (Water)", strongAgainst: ["ほのお", "じめん", "いわ"], weakAgainst: ["でんき", "くさ"], color: "bg-blue-600" },
  { type: "でんき (Electric)", strongAgainst: ["みず", "ひこう"], weakAgainst: ["じめん"], color: "bg-amber-500" },
  { type: "ドラゴン (Dragon)", strongAgainst: ["ドラゴン"], weakAgainst: ["こおり", "ドラゴン", "フェアリー"], color: "bg-indigo-600" },
  { type: "フェアリー (Fairy)", strongAgainst: ["かくとう", "ドラゴン", "あく"], weakAgainst: ["どく", "はがね"], color: "bg-pink-500" },
];

export function TypeSynergyWidget() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = TYPES[selectedIdx];

  return (
    <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand uppercase">
            <Shield className="h-4 w-4" />
            <span>POKÉMON TYPE MATRIX</span>
          </div>
          <h4 className="font-display mt-1 text-xl font-bold text-neutral-900">対戦タイプ相性クイックマトリクス</h4>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {TYPES.map((t, idx) => (
            <button
              key={t.type}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? `${t.color} text-white shadow-sm`
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {t.type.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <span className="text-xs font-bold text-emerald-800">【こうかばつぐん (2倍以上)】</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {current.strongAgainst.map((t) => (
              <span key={t} className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <span className="text-xs font-bold text-red-800">【弱点 (2倍以上被弾)】</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {current.weakAgainst.map((t) => (
              <span key={t} className="rounded-lg bg-red-600 text-white px-2.5 py-1 text-xs font-bold shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
