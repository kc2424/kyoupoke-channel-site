"use client";

import { useEffect, useState } from "react";

import { YouTubeIcon } from "@/components/brand-icons";
import { cn } from "@/lib/utils";

const SHOW_AFTER = 320;

/**
 * モバイル下部に固定するチャンネル登録CTA。
 * ヒーローを少しスクロールしてから出す（ファーストビューを塞がないため）。
 * lg以上はヘッダー内のCTAが常時見えているので非表示にする。
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 ease-out motion-reduce:transition-none lg:hidden",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      )}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href="https://www.youtube.com/@KYOUPOKE?sub_confirmation=1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-dark px-6 py-4 text-sm font-bold text-white shadow-xl transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <YouTubeIcon aria-hidden="true" className="h-5 w-5" />
        チャンネル登録する
      </a>
    </div>
  );
}
