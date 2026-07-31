"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function GiantTitle({ children }: { children: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [scale, setScale] = useState(1);

  // 端末幅に応じて実測でスケールを合わせる。
  // vw指定だけだとブレークポイント間（例: 390〜639px）で文字が
  // コンテナ幅を超えて左右が切れてしまうため、実際のレンダリング幅を
  // 測って必ず収まるようスケールする。
  // Webフォント（Titan One）の読み込み完了で文字幅が変わっても
  // コンテナ自体のサイズは変わらないため、document.fonts.ready と
  // row要素自体のリサイズも監視して再計測する。
  useLayoutEffect(() => {
    const container = containerRef.current;
    const row = rowRef.current;
    if (!container || !row) return;

    const fit = () => {
      row.style.transform = "scale(1)";
      const available = container.clientWidth;
      const natural = row.scrollWidth;
      if (!available || !natural) return;
      // 端の見切れを避けるため 4% の余白を確保
      const next = natural > available ? (available / natural) * 0.96 : 1;
      setScale(next);
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);
    ro.observe(row);

    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }
    // フォント読み込みタイミングの取りこぼし対策として、少し遅らせても再計測
    const t1 = window.setTimeout(fit, 300);
    const t2 = window.setTimeout(fit, 1000);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [children]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];

      // 浮き上がって登場する演出
      gsap.set(chars, { yPercent: 120, opacity: 0 });
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => {
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.05,
          });
        },
      });

      // マウス位置に応じたふにゃふにゃスクイーズ
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
      className="font-wordmark text-brand flex w-full justify-center overflow-hidden text-[20vw] leading-[0.85] sm:text-[13.5vw]"
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
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </div>
    </h1>
  );
}
