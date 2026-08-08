"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

import { scrollToHash } from "@/lib/lenis";
import { navItems, socialLinks } from "@/lib/nav";
import { playNavTransition } from "@/lib/nav-transition";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/scramble-text";

export function FullscreenMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    // createPortal(document.body)はSSR時にbodyが無いため、マウント後に一度だけ切り替える。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 開いている間は背面のスクロールを止め、Escapeで閉じられるようにする。
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // アンカーはトップにいるときだけLenisでスクロール。
  // 下層ページ、または /news のような別ページはルーターで遷移する。
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    playNavTransition();
    setOpen(false);

    if (href.startsWith("#")) {
      if (isHome) {
        setTimeout(() => scrollToHash(href), 300);
      } else {
        setTimeout(() => router.push(`/${href}`), 300);
      }
      return;
    }
    setTimeout(() => router.push(href), 300);
  };

  const overlay = (
    <div
      className={cn(
        // 暖色のブランドグラデーション。黒は使わない。
        // 上下を濃いめ・中央を明るめにして、小さい文字(上部のロゴ/Close・下部のリンク)は
        // 濃い側に、巨大なナビ文字は中央に来るようにし、どのサイズでも白文字が読めるようにする。
        "fixed inset-0 z-[70] bg-gradient-to-b from-[#b03f1c] via-[#d9552e] to-[#9c3616]",
        "text-white transition-opacity duration-500",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="メニュー"
    >
      {/* 装飾は文字の背面(z-0)にのみ置き、可読性を落とさないよう半透明の白に留める */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute top-0 left-[8%] h-full w-40 bg-white/10 transition-transform duration-700 ease-out"
          style={{ transform: open ? "translateY(0)" : "translateY(-100%)" }}
        />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ffd7a6]/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="font-wordmark text-xl text-white lg:text-2xl">KYOU POKE</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-brand-dark lg:px-6 lg:py-3 lg:text-base"
          >
            Close
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col justify-center gap-1 overflow-y-auto py-4 sm:flex-none sm:gap-2 sm:py-0">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") && !isHome ? `/${item.href}` : item.href}
              onClick={handleNavClick(item.href)}
              onMouseEnter={() => setHovered(item.href)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "font-display flex items-center gap-2 text-[8.5vw] leading-[1.15] sm:gap-4 sm:text-5xl",
                "transition-[transform,opacity,color] duration-300",
                hovered === item.href ? "text-[#ffe8d6]" : "text-white"
              )}
              style={{
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                transform: open ? "translateX(0)" : "translateX(-40px)",
                opacity: open ? 1 : 0,
              }}
            >
              <ScrambleText text={item.label} active={hovered === item.href} />
              <span
                className="hidden text-3xl text-white transition-opacity duration-200 sm:inline sm:text-5xl"
                style={{ opacity: hovered === item.href ? 1 : 0 }}
              >
                →
              </span>
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4 text-sm font-bold sm:flex-row sm:items-end sm:justify-between lg:text-base">
          <div>
            <p className="text-white/80 uppercase">Links</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline-offset-4 transition-colors duration-200 hover:text-[#ffe8d6] hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-white/80">非公式ファンサイト</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-brand-dark bg-white/90 px-5 py-2.5 text-sm font-bold text-brand-dark lg:hidden"
        aria-label="メニューを開く"
      >
        Menu
      </button>

      {/* ヘッダーはスクロール時にbackdrop-blurが付き、fixed子孫の包含ブロックになってしまう。
          （= メニューがヘッダーの高さに閉じ込められ上のバーだけになる）
          それを避けるため、オーバーレイは必ずbodyへportalする。 */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
