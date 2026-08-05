"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";

export function InertiaIndicator() {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = Date.now();

    const handleScroll = () => {
      const now = Date.now();
      const dt = Math.max(1, now - lastTime);
      const dy = Math.abs(window.scrollY - lastY);
      const v = Math.min(100, Math.round((dy / dt) * 50));

      setVelocity(v);
      lastY = window.scrollY;
      lastTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (velocity <= 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-none hidden md:flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900/80 px-3.5 py-1.5 text-[11px] font-mono text-amber-300 backdrop-blur-md shadow-lg transition-opacity duration-300 animate-in fade-in">
      <Gauge className="h-3.5 w-3.5 text-brand animate-spin-slow" />
      <span>VELOCITY: {velocity} PX/S</span>
    </div>
  );
}
