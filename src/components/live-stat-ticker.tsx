"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Play, Award } from "lucide-react";

export function LiveStatTicker() {
  const [subscribers, setSubscribers] = useState(673820);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubscribers((prev) => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-neutral-950 text-white text-[11px] font-mono border-b border-white/10 py-1.5 px-4 overflow-hidden">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE METRICS</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Users className="h-3 w-3 text-brand" />
            <span>登録者数:</span>
            <span className="font-bold text-white tabular-nums">{subscribers.toLocaleString()} 人</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Play className="h-3 w-3 text-amber-400" />
            <span>総再生数:</span>
            <span className="font-bold text-white">12.5 億回超</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Award className="h-3 w-3 text-emerald-400" />
            <span>最高レート:</span>
            <span className="font-bold text-amber-300">2415 (SV S1 最終1位)</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-white/60 text-[10px]">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          <span>毎日更新中</span>
        </div>
      </div>
    </div>
  );
}
