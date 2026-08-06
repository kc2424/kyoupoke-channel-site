"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FullscreenMenu } from "@/components/fullscreen-menu";
import { LogoMark } from "@/components/logo-mark";
import { UnderlineLink } from "@/components/underline-link";
import { Badge } from "@/components/ui/badge";
import { WipeLink } from "@/components/wipe-link";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 40;

export function SiteHeader({
  navItems,
}: {
  navItems: { label: string; href: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex min-w-0 items-center gap-2 cursor-pointer sm:gap-3 lg:gap-4 group"
        >
          <LogoMark
            animated
            className="h-9 w-9 shrink-0 drop-shadow-md sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-wordmark text-brand truncate text-lg sm:text-2xl lg:text-3xl">
            KYOU POKE
          </span>
          <Badge className="bg-brand-dark hidden shrink-0 text-white sm:inline-flex lg:px-4 lg:py-1.5 lg:text-sm">
            FAN SITE
          </Badge>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-bold text-neutral-800 md:flex lg:gap-8 lg:text-base">
          {navItems.map((item) => (
            <UnderlineLink key={item.href} href={item.href}>
              {item.label}
            </UnderlineLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            cursorLabel="OPEN"
            className="hidden sm:inline-flex lg:px-7 lg:py-3.5 lg:text-base"
          >
            YouTubeを見る
          </WipeLink>
          <FullscreenMenu />
        </div>
      </div>
    </header>
  );
}
