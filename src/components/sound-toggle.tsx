"use client";

import { useEffect, useState } from "react";

import { loadSoundPreference, playPop, setSoundEnabled } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(loadSoundPreference());
  }, []);

  function handleClick() {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) playPop();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={enabled}
      aria-label={enabled ? "タップ音をオフにする" : "タップ音をオンにする"}
      title={enabled ? "タップ音: オン" : "タップ音: オフ"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors lg:h-11 lg:w-11",
        enabled
          ? "border-brand bg-brand text-white"
          : "border-black text-black",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 lg:h-5 lg:w-5"
        aria-hidden="true"
      >
        <path
          d="M4 9v6h4l5 4V5L8 9H4Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {enabled ? (
          <path
            d="M17 8.5c1.2 1 1.9 2.2 1.9 3.5s-.7 2.5-1.9 3.5M19.3 6c1.8 1.5 2.9 3.5 2.9 6s-1.1 4.5-2.9 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M16.5 9.5 21 14M21 9.5l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
