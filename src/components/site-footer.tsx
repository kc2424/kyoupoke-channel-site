import Link from "next/link";

import { LogoMark } from "@/components/logo-mark";
import { navItems, socialLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

const CONTAINER = "mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16";

/**
 * 全ページ共通のフッター。
 * 「非公式ファンサイト」の注記はこのサイトの前提なので必ず表示する。
 */
export function SiteFooter({ isHome = false }: { isHome?: boolean }) {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-gradient-to-b from-[#3b180e] via-[#2a0e06] to-[#1c0803] pt-20 pb-28 text-white sm:pb-20">
      <div aria-hidden="true" className="flex select-none whitespace-nowrap">
        {[0, 1].map((row) => (
          <div
            key={row}
            className="animate-marquee flex shrink-0 items-center gap-10 pr-10 motion-reduce:animate-none"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-4">
                <span className="font-wordmark text-brand text-4xl sm:text-6xl lg:text-8xl">
                  KYOU POKE
                </span>
                <LogoMark className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className={cn(CONTAINER, "relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3")}>
        <div>
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
            Sitemap
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navItems.map((item) => {
              const href = item.href.startsWith("#")
                ? isHome
                  ? item.href
                  : `/${item.href}`
                : item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    className="text-white/80 transition-colors duration-200 hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
            Official Links
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {socialLinks.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors duration-200 hover:text-brand"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
            About this site
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            このページは非公式のファンサイトです。今日ポケの活動を応援しています。
            今日ポケ本人・所属先とは関係がなく、公式の連絡窓口ではありません。
          </p>
          <p className="mt-4 text-xs text-white/50">
            『ポケットモンスター』は株式会社ポケモン、任天堂、ゲームフリーク、
            クリーチャーズの登録商標です。動画・画像等の権利は各権利者に帰属します。
          </p>
        </div>
      </div>

      <p className={cn(CONTAINER, "relative mt-12 text-center text-xs text-white/50")}>
        © {new Date().getFullYear()} 今日ポケ ファンサイト（非公式）
      </p>
    </footer>
  );
}
