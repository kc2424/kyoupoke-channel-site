"use client";

import { useState } from "react";
import { Sparkles, Heart } from "lucide-react";

export function FanStatsCounter() {
  const [cheers, setCheers] = useState(8492);
  const [level, setLevel] = useState("GOLD FAN");

  const handleFanCheer = () => {
    setCheers((c) => {
      const next = c + 1;
      if (next > 8500) setLevel("DIAMOND FAN 💎");
      return next;
    });
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-md">
      <Sparkles className="h-4 w-4 text-amber-400" />
      <span className="font-mono text-amber-300">ファンレベル: {level}</span>
      <span className="text-white/40">|</span>
      <button
        onClick={handleFanCheer}
        className="flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-white hover:bg-brand-dark transition-all active:scale-95 shadow-sm"
      >
        <Heart className="h-3.5 w-3.5 fill-current text-white animate-pulse" />
        <span>応援 {cheers.toLocaleString()}</span>
      </button>
    </div>
  );
}
