"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ヒーロー写真の背景（黄色→淡いオレンジ→赤）に合わせた文字グラデーション。
const GRADIENT_STOPS = ["#fbdd8e", "#f6c453", "#e8763a", "#c8501f", "#8f2d14"];

function hexToRgb(hex: string) {
  const num = parseInt(hex.replace("#", ""), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function mixColor(t: number) {
  const segments = GRADIENT_STOPS.length - 1;
  const scaled = Math.min(Math.max(t, 0), 1) * segments;
  const i = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - i;
  const c1 = hexToRgb(GRADIENT_STOPS[i]);
  const c2 = hexToRgb(GRADIENT_STOPS[i + 1]);
  const r = Math.round(c1.r + (c2.r - c1.r) * localT);
  const g = Math.round(c1.g + (c2.g - c1.g) * localT);
  const b = Math.round(c1.b + (c2.b - c1.b) * localT);
  return `rgb(${r}, ${g}, ${b})`;
}

export function GiantTitle({ children }: { children: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [scale, setScale] = useState(1);

  // 端末幅に応じて実測でスケールを合わせる。
  // vw指定だけだとブレークポイント間（例: 390〜639px）で文字が
  // コンテナ幅を超えて左右が切れてしまうため、実際のレンダリング幅を
  // 測って必ず収まるようスケールする。
  // Webフォント（Titan One）はfont-display: swapのため、
  // document.fonts.ready が解決するタイミングと実際にグリフが
  // 描画されるタイミングがずれることがある（特にモバイルSafari）。
  // そのため fonts.ready / loadingdone イベントに加えて、
  // マウント後しばらくの間ポーリングして幅の変化を追い、
  // 安全マージンも大きめに確保する。
  useLayoutEffect(() => {
    const container = containerRef.current;
    const row = rowRef.current;
    if (!container || !row) return;

    let lastNatural = -1;

    const fit = () => {
      row.style.transform = "scale(1)";
      const available = container.clientWidth;
      const natural = row.scrollWidth;
      if (!available || !natural) return;
      lastNatural = natural;
      // 端の見切れを避けるため 15% の余白を確保
      const next = natural > available ? (available / natural) * 0.85 : 1;
      setScale(next);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    ro.observe(row);

    let cancelled = false;
    const safeFit = () => {
      if (!cancelled) fit();
    };

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(safeFit);
      // fonts.ready より前に個別フォントの読み込みが完了することもあるため、
      // loadingdone イベントでも都度再計測する
      document.fonts.addEventListener("loadingdone", safeFit);
    }
    window.addEventListener("load", safeFit);
    // 画面回転やブラウザのUI表示変化（アドレスバーの伸縮など）でも
    // 確実に再計算されるよう、window resizeも直接監視する
    window.addEventListener("resize", safeFit);
    window.addEventListener("orientationchange", safeFit);

    // イベントの取りこぼし対策として、マウント後しばらく短い間隔で
    // 実際の幅（scrollWidth）が変化していないか確認し続ける
    let checks = 0;
    const poll = window.setInterval(() => {
      checks += 1;
      const currentNatural = (() => {
        const prevTransform = row.style.transform;
        row.style.transform = "scale(1)";
        const w = row.scrollWidth;
        row.style.transform = prevTransform;
        return w;
      })();
      if (currentNatural !== lastNatural) {
        fit();
      }
      if (checks >= 20) window.clearInterval(poll);
    }, 150);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.clearInterval(poll);
      window.removeEventListener("load", safeFit);
      window.removeEventListener("resize", safeFit);
      window.removeEventListener("orientationchange", safeFit);
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.removeEventListener("loadingdone", safeFit);
      }
    };
  }, [children]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];

      // 浮き上がって登場する演出。
      // ヒーロー内で常に初期表示されるため、スクロール判定ではなくマウント直後に再生する。
      gsap.set(chars, { yPercent: 120, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.05,
        delay: 0.15,
      });

      // マウス位置に応じたふにゃふにゃスクイーズ（タッチ端末は mousemove だけ合成発火して
      // mouseleave が来ないため歪んだまま戻らなくなる。マウス操作可能な端末に限定する）
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const squishers = chars.map((el) => ({
        el,
        scaleX: gsap.quickTo(el, "scaleX", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
        scaleY: gsap.quickTo(el, "scaleY", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
        skewX: gsap.quickTo(el, "skewX", { duration: 0.6, ease: "elastic.out(1, 0.35)" }),
      }));

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const px = e.clientX - rect.left;

        squishers.forEach(({ el, scaleX, scaleY, skewX }) => {
          const charRect = el.getBoundingClientRect();
          const center = charRect.left - rect.left + charRect.width / 2;
          const dist = Math.abs(px - center);
          const influence = Math.max(0, 1 - dist / 260);
          const dir = px > center ? -1 : 1;

          scaleX(1 + influence * 0.4);
          scaleY(1 - influence * 0.22);
          skewX(dir * influence * 8);
        });
      };

      const handleMouseLeave = () => {
        squishers.forEach(({ scaleX, scaleY, skewX }) => {
          scaleX(1);
          scaleY(1);
          skewX(0);
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <h1
      ref={containerRef}
      className="font-wordmark flex w-full justify-center overflow-hidden text-[17vw] leading-[0.85] drop-shadow-[3px_5px_0_rgba(90,30,10,0.18)] sm:text-[13.5vw] landscape-compact:text-[11vh]"
    >
      <div
        ref={rowRef}
        style={{
          letterSpacing: "-0.02em",
          wordSpacing: "-0.35em",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        className="inline-flex"
      >
        {children.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className="inline-block will-change-transform"
            style={{ color: mixColor(children.length > 1 ? i / (children.length - 1) : 0) }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </div>
    </h1>
  );
}
