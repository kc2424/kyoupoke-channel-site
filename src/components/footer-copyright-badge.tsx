"use client";

import { ShieldCheck, Heart } from "lucide-react";

export function FooterCopyrightBadge() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 font-mono">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>非公式ファンサイト (Unofficial Fan Site) — 本人・関係者非公認</span>
      </div>

      <div className="flex items-center gap-1.5 text-amber-300">
        <span>Crafted with</span>
        <Heart className="h-3.5 w-3.5 fill-current text-brand" />
        <span>for KYOUPOKE Fans</span>
      </div>
    </div>
  );
}
