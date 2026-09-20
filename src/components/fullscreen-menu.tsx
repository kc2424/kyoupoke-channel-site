"use client";

import { useId, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { scrollToHash } from "@/lib/lenis";
import { navItems, socialLinks } from "@/lib/nav";
import { playNavTransition } from "@/lib/nav-transition";
import { cn } from "@/lib/utils";
import { useModalDialog } from "@/components/use-modal-dialog";
import { ScrambleText } from "@/components/scramble-text";

export function FullscreenMenu() {
  const [open, setOpen] = useState(false);
  const dialogRef = useModalDialog(open);
  const dialogId = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // アンカーはトップにいるときだけLenisでスクロール。
  // 下層ページ、または /news のような別ページはルーターで遷移する。
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
    <dialog
      ref={dialogRef}
      id={dialogId}
      data-lenis-prevent
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      className={cn(
        // 暖色のブランドグラデーション。黒は使わない。
        // 上下を濃いめ・中央を明るめにして、小さい文字(上部のロゴ/Close・下部のリンク)は
        // 濃い側に、巨大なナビ文字は中央に来るようにし、どのサイズでも白文字が読めるようにする。
        "fixed inset-0 m-0 hidden h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-gradient-to-b from-[#b03f1c] via-[#d9552e] to-[#9c3616] p-0 text-white open:block"
      )}
      aria-label="メニュー"
    >
      {/* 装飾は文字の背面(z-0)にのみ置き、可読性を落とさないよう半透明の白に留める */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute top-0 left-[8%] h-full w-40 bg-white/10 transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: open ? "translateY(0)" : "translateY(-100%)" }}
        />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ffd7a6]/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-full flex-col justify-between gap-6 px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="font-wordmark text-xl text-white lg:text-2xl">KYOU POKE</span>
          <button
            type="button"
            data-dialog-close
            onClick={() => setOpen(false)}
            className="rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-brand-dark lg:px-6 lg:py-3 lg:text-base"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-1 py-4 sm:gap-2">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") && !isHome ? `/${item.href}` : item.href}
              onClick={handleNavClick(item.href)}
              onMouseEnter={() => setHovered(item.href)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "font-display flex items-center gap-2 text-[8.5vw] leading-[1.15] sm:gap-4 sm:text-5xl",
                "transition-[transform,opacity,color] duration-300 motion-reduce:transition-none",
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
                aria-hidden="true"
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
    </dialog>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-brand-dark bg-white/90 px-5 py-2.5 text-sm font-bold text-brand-dark xl:hidden"
        aria-label="メニューを開く"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
      >
        Menu
      </button>

      {/* showModal()でtop layerへ移るため、ヘッダーのbackdrop-blurに閉じ込められない。 */}
      {overlay}
    </>
  );
}
