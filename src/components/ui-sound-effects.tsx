"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function UISoundEffects() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (muted) return;

    const playClickSound = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch {
        // AudioContext disabled fallback
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button']")) {
        playClickSound();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [muted]);

  return (
    <button
      onClick={() => setMuted((v) => !v)}
      aria-label={muted ? "効果音ON" : "効果音OFF"}
      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white/80 px-3 py-1 text-xs font-bold text-neutral-700 backdrop-blur-md hover:bg-neutral-100 transition-all shadow-sm"
    >
      {muted ? <VolumeX className="h-3.5 w-3.5 text-neutral-400" /> : <Volume2 className="h-3.5 w-3.5 text-brand" />}
      <span>SE {muted ? "OFF" : "ON"}</span>
    </button>
  );
}
