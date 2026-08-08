"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 動画パネルを開いた瞬間、黒帯(レターボックス)が画面全体を覆った状態から
 * 上下に開いていき、「これから上映が始まる」ような開幕の儀式感を演出する。
 *
 * 帯は必ず高さ0まで開ききること。途中で止めるとYouTubeプレーヤーの
 * タイトル(上端)と操作バー(下端)に被って読めない・押せなくなる。
 *
 * 演出はCSSトランジションで行う。GSAPだと開閉のたびに副作用の再実行順へ
 * 依存してしまい、帯が開き切らないまま残ることがあったため。
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
  // activeで0%まで開く。閉じている間は50%で画面を覆った状態に戻す。
  const barClass = cn(
    "pointer-events-none absolute inset-x-0 z-10 bg-black",
    "transition-[height] duration-700 delay-150 ease-[cubic-bezier(0.65,0,0.35,1)]",
    "motion-reduce:transition-none"
  );
  const barStyle = { height: active ? "0%" : "50%" };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div aria-hidden className={cn(barClass, "top-0")} style={barStyle} />
      <div aria-hidden className={cn(barClass, "bottom-0")} style={barStyle} />
    </div>
  );
}
