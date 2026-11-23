"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronUp } from "lucide-react";

import { scrollToPageTop } from "@/lib/lenis";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          whileHover={reduceMotion ? undefined : { scale: 1.1, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          onClick={scrollToPageTop}
          aria-label="ページ最上部へ戻る"
          className="fixed right-6 bottom-24 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/80 bg-brand-dark text-white shadow-[0_4px_14px_0_rgba(217,85,46,0.39)] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 motion-reduce:transform-none lg:bottom-6"
        >
          <ChevronUp aria-hidden="true" className="h-6 w-6 stroke-[3] text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
