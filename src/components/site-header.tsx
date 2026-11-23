"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { FullscreenMenu } from "@/components/fullscreen-menu";
import { LogoMark } from "@/components/logo-mark";
import { UnderlineLink } from "@/components/underline-link";
import { Badge } from "@/components/ui/badge";
import { WipeLink } from "@/components/wipe-link";
import { scrollToPageTop } from "@/lib/lenis";
import { navItems, resolveNavHref } from "@/lib/nav";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 40;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // トップページにいるときだけ「先頭へスクロール」に差し替える。
  // 下層ページではふつうに / へ遷移させる。
  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!isHome) return;
    e.preventDefault();
    if (window.scrollY > 0) {
      scrollToPageTop();
    } else {
      router.refresh();
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out",
        scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-6 py-3 sm:px-10 sm:py-4 lg:px-16 lg:py-5">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="group flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3 xl:gap-4"
        >
          <LogoMark
            animated
            className="h-9 w-9 shrink-0 drop-shadow-md sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-wordmark whitespace-nowrap text-lg text-brand sm:text-2xl xl:text-3xl">
            KYOU POKE
          </span>
          <Badge className="hidden shrink-0 bg-brand-dark text-white sm:inline-flex lg:hidden xl:inline-flex xl:px-4 xl:py-1.5 xl:text-sm">
            FAN SITE
          </Badge>
        </Link>
        {/* 項目数が増えても折り返さないよう、横並びは1280px以上に限定する。 */}
        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-bold text-neutral-800 xl:flex xl:gap-6">
          {navItems.map((item) => (
            <UnderlineLink key={item.href} href={resolveNavHref(item.href, isHome)}>
              {item.label}
            </UnderlineLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            cursorLabel="OPEN"
            className="hidden sm:inline-flex xl:px-7 xl:py-3.5 xl:text-base"
          >
            YouTubeを見る
          </WipeLink>
          <FullscreenMenu />
        </div>
      </div>
    </header>
  );
}
