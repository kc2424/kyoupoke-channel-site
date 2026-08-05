"use client";

import { useEffect, useState } from "react";
import { Command, X } from "lucide-react";

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "?") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
          aria-label="閉じる"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <Command className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold">キーボードショートカット</h2>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-neutral-800/50 p-2.5">
            <span className="text-neutral-300">ショートカット一覧を表示</span>
            <kbd className="rounded bg-neutral-700 px-2 py-1 text-xs font-mono text-amber-400">⌘ K / ?</kbd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-neutral-800/50 p-2.5">
            <span className="text-neutral-300">モーダルを閉じる</span>
            <kbd className="rounded bg-neutral-700 px-2 py-1 text-xs font-mono text-amber-400">ESC</kbd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-neutral-800/50 p-2.5">
            <span className="text-neutral-300">トップへ戻る</span>
            <kbd className="rounded bg-neutral-700 px-2 py-1 text-xs font-mono text-amber-400">Home</kbd>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          今日ポケ ファンサイト - Accessible Quick Navigation
        </p>
      </div>
    </div>
  );
}
