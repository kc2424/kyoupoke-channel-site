"use client";

import { useState, useEffect } from "react";
import { Palette, Sparkles, Moon, Sun } from "lucide-react";

type ThemeMode = "orange" | "cyber" | "gold";

export function ThemeAmbientToggle() {
  const [theme, setTheme] = useState<ThemeMode>("orange");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme-aura", theme);
  }, [theme]);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white/80 p-1 text-xs font-bold shadow-md backdrop-blur-md">
      <button
        onClick={() => setTheme("orange")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 transition-all ${
          theme === "orange" ? "bg-amber-500 text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        <span>標準</span>
      </button>

      <button
        onClick={() => setTheme("cyber")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 transition-all ${
          theme === "cyber" ? "bg-neutral-900 text-amber-400 shadow-sm" : "text-neutral-600 hover:text-neutral-900"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        <span>サイバー</span>
      </button>

      <button
        onClick={() => setTheme("gold")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 transition-all ${
          theme === "gold" ? "bg-amber-600 text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>ゴールド</span>
      </button>
    </div>
  );
}
