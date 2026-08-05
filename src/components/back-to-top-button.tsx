"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Magnetic } from "@/components/magnetic";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out animate-in fade-in zoom-in-90">
      <Magnetic>
        <button
          onClick={scrollToTop}
          aria-label="ページトップへ戻る"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-amber-500 hover:scale-110 active:scale-95"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </Magnetic>
    </div>
  );
}
