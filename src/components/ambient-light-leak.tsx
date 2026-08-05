"use client";

import { useEffect, useState } from "react";

export function AmbientLightLeak() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45 transition-opacity duration-1000"
      aria-hidden="true"
    >
      <div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#d9552e]/30 via-amber-500/20 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-[#b8431f]/25 via-orange-500/15 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 50}px, ${-mousePos.y * 50}px)`,
        }}
      />
    </div>
  );
}
