"use client";

import { Bell, ArrowRight } from "lucide-react";

export function NewsBulletin() {
  return (
    <div className="w-full bg-gradient-to-r from-[#d9552e] via-amber-500 to-[#b8431f] text-white py-2.5 px-4 shadow-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 text-xs font-bold">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest">
            <Bell className="h-3 w-3 text-amber-300 animate-bounce" />
            <span>NEWS</span>
          </span>
          <p className="truncate text-white">
            【WCS 2025】いろは選手が世界大会出場決定！公式SHOP最新グッズ予約受付中 🔥
          </p>
        </div>

        <a
          href="https://kyoupoke.shop"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 sm:inline-flex items-center gap-1 text-xs text-white hover:underline font-mono"
        >
          <span>今日ポケ SHOP →</span>
        </a>
      </div>
    </div>
  );
}
