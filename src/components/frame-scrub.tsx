"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

/**
 * YouTubeが動画ごとに自動生成する3枚のフレーム画像(1.jpg/2.jpg/3.jpg、動画内の
 * 約25%/50%/75%地点)を、サムネイル上でのポインター横位置に応じてクロスフェード
 * させる。クリックする前から「これは静止画ではなく動画である」ことを、
 * 追加のアセットやWebGLを使わずポインター操作だけで予感させる狙い。
 */
export function FrameScrub({ videoId, alt }: { videoId: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setFrame(1 + Math.min(2, Math.floor(ratio * 3)));
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setFrame(0)}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-150 ease-out"
        style={{ opacity: frame === 0 ? 1 : 0 }}
      />
      {[1, 2, 3].map((n) => (
        <Image
          key={n}
          src={`https://img.youtube.com/vi/${videoId}/${n}.jpg`}
          alt=""
          aria-hidden="true"
          fill
          className="object-cover transition-opacity duration-150 ease-out"
          style={{ opacity: frame === n ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
