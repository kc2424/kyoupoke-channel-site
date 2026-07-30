"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * 動画パネルを開いた瞬間、黒帯(レターボックス)が画面全体を覆った状態から
 * シネマスコープ画角の薄い帯へGSAPで収縮し、「これから上映が始まる」ような
 * 開幕の儀式感を演出する。色味を変えるフィルター演出（MonoReveal）とは別の、
 * 帯の開閉という画角そのものの動きに焦点を当てたコンポーネント。
 */
export function LetterboxReveal({
  active,
  className,
  children,
}: {
  active: boolean;
  className?: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const top = topRef.current;
      const bottom = bottomRef.current;
      if (!top || !bottom) return;

      if (!active) {
        gsap.set([top, bottom], { height: "50%" });
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([top, bottom], { height: "6%" });
        return;
      }

      gsap.fromTo(
        [top, bottom],
        { height: "50%" },
        { height: "6%", duration: 0.7, ease: "power3.inOut", delay: 0.15 }
      );
    },
    { scope: wrapRef, dependencies: [active] }
  );

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      {children}
      <div ref={topRef} className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-black" />
      <div
        ref={bottomRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-black"
      />
    </div>
  );
}
