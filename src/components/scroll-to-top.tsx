"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="ページ最上部へ戻る"
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center lg:bottom-6 rounded-full border-2 border-white/80 bg-gradient-to-r from-[#d9552e] to-[#b8431f] text-white shadow-[0_4px_14px_0_rgba(217,85,46,0.39)] backdrop-blur-md focus:outline-none"
        >
          <ChevronUp className="h-6 w-6 stroke-[3] text-amber-200 animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
