"use client";

import { useEffect, useState } from "react";
import { Users, Award, Play, Link, ChevronUp } from "lucide-react";
import { Magnetic } from "@/components/magnetic";

export function FloatingQuickDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-6">
      <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-neutral-900/85 p-2 text-white shadow-2xl backdrop-blur-xl">
        <Magnetic>
          <a
            href="#members"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-white/20 active:scale-95"
          >
            <Users className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">メンバー</span>
          </a>
        </Magnetic>

        <Magnetic>
          <a
            href="#achievements"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-white/20 active:scale-95"
          >
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">実績</span>
          </a>
        </Magnetic>

        <Magnetic>
          <a
            href="#videos"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-white/20 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 text-amber-400 fill-current" />
            <span className="hidden sm:inline">動画</span>
          </a>
        </Magnetic>

        <Magnetic>
          <a
            href="#links"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-white/20 active:scale-95"
          >
            <Link className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">リンク</span>
          </a>
        </Magnetic>

        <div className="h-4 w-px bg-white/20 mx-1" />

        <Magnetic>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="トップへ"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark transition-colors shadow-md"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
