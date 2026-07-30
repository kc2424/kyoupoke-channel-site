"use client";

import { useState } from "react";

import { scrollToHash } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/scramble-text";

const navItems = [
  { label: "プロフィール", href: "#profile" },
  { label: "メンバー", href: "#members" },
  { label: "実績", href: "#achievements" },
  { label: "動画", href: "#videos" },
  { label: "リンク", href: "#links" },
];

const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X", href: "https://x.com/KYOUPOKEch" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];

export function FullscreenMenu() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-black px-5 py-2.5 text-sm font-bold text-black lg:px-6 lg:py-3 lg:text-base"
      >
        Menu
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black text-white transition-opacity duration-500",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="bg-brand pointer-events-none absolute top-0 left-[12%] h-full w-24 transition-transform duration-700 ease-out"
          style={{ transform: open ? "translateY(0)" : "translateY(-100%)" }}
        />

        <div className="relative flex h-full flex-col justify-between px-6 py-8 sm:px-12 sm:py-10">
          <div className="flex items-center justify-between">
            <span className="font-wordmark text-brand text-xl lg:text-2xl">KYOU POKE</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white lg:px-6 lg:py-3 lg:text-base"
            >
              Close
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  setTimeout(() => scrollToHash(item.href), 300);
                }}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                className="font-display flex items-center gap-4 text-[13vw] leading-[1.05] text-white transition-transform duration-300 sm:text-6xl"
                style={{
                  transitionDelay: open ? `${i * 60}ms` : "0ms",
                  transform: open ? "translateX(0)" : "translateX(-40px)",
                  opacity: open ? 1 : 0,
                }}
              >
                <ScrambleText text={item.label} active={hovered === item.href} />
                <span
                  className="text-brand text-3xl transition-opacity duration-200 sm:text-5xl"
                  style={{ opacity: hovered === item.href ? 1 : 0 }}
                >
                  →
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4 text-sm font-bold sm:flex-row sm:items-end sm:justify-between lg:text-base">
            <div>
              <p className="text-white/40 uppercase">Links</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {socialLinks.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <p className="text-white/40">非公式ファンサイト</p>
          </div>
        </div>
      </div>
    </>
  );
}
