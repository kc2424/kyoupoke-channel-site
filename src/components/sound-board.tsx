"use client";

import { useState } from "react";
import { Volume2, Sparkles, Zap, Flame, Smile } from "lucide-react";

type SoundChip = {
  id: string;
  label: string;
  sub: string;
  freq: number;
  type: OscillatorType;
  icon: typeof Volume2;
  color: string;
};

const SOUND_CHIPS: SoundChip[] = [
  { id: "start", label: "対戦開始！", sub: "BATTLE START", freq: 523.25, type: "sine", icon: Flame, color: "from-amber-500 to-orange-600" },
  { id: "rank1", label: "最終1位達成！", sub: "RANK #1 CHIME", freq: 880, type: "triangle", icon: Sparkles, color: "from-amber-400 to-yellow-500" },
  { id: "godplay", label: "神立ち回り！", sub: "GOD PLAY SFX", freq: 659.25, type: "square", icon: Zap, color: "from-orange-500 to-red-600" },
  { id: "wakopoke", label: "わこポケ！", sub: "FAN GREETING", freq: 440, type: "sine", icon: Smile, color: "from-amber-600 to-amber-700" },
];

export function SoundBoard() {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const playChime = (chip: SoundChip) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = chip.type;
      osc.frequency.setValueAtTime(chip.freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(chip.freq * 1.5, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      setActiveChip(chip.id);
      setTimeout(() => setActiveChip(null), 400);
    } catch {
      // AudioContext unavailable fallback
    }
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-md">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-800 uppercase">
          <Volume2 className="h-4 w-4 text-amber-500" />
          <span>今日ポケ ファン・サウンドボード</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-600">Web Audio Live SFX</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SOUND_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => playChime(chip)}
              className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all duration-200 ${
                isActive
                  ? "scale-95 shadow-inner bg-neutral-900 text-white"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${chip.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-display mt-2 text-sm font-bold">{chip.label}</span>
              <span className="text-[10px] font-mono text-neutral-600 uppercase mt-0.5">{chip.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
