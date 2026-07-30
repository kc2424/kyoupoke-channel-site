"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * サムネイルをクリックすると、拡大しながらポップアップするモーダルで動画を再生する。
 * 常時iframeを埋め込まないことで、複数動画を並べても初期読み込みが重くならない。
 */
export function VideoModal({
  videoId,
  title,
  children,
}: {
  videoId: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left"
        aria-label={`${title}を再生`}
      >
        {children}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-10",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={title}
        onClick={() => setOpen(false)}
      >
        <div
          className="relative w-full max-w-4xl transition-transform duration-300 ease-out"
          style={{
            transform: open ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute -top-12 right-0 rounded-full border-2 border-white px-5 py-2 text-sm font-bold text-white lg:px-6 lg:py-2.5 lg:text-base"
          >
            Close
          </button>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
            {open && (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
