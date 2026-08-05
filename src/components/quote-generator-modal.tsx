"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Copy, Check, X } from "lucide-react";

type MemberQuote = {
  member: "バンビー" | "いろは" | "くろこ";
  role: string;
  quote: string;
  context: string;
  color: string;
};

const QUOTES: MemberQuote[] = [
  {
    member: "バンビー",
    role: "絶対的エース",
    quote: "「人生で一番嬉しかった。最後まで諦めなくてよかった」",
    context: "SVシーズン1 歴代最高レート2415で最終1位を獲得した瞬間の名言",
    color: "from-amber-500 to-orange-600",
  },
  {
    member: "いろは",
    role: "論理の体現者",
    quote: "「勝ち筋を論理的に組み立てれば、奇跡は必然になる」",
    context: "構築デザイナーとしての対戦哲学とWCS日本代表決定時の名言",
    color: "from-orange-500 to-red-600",
  },
  {
    member: "くろこ",
    role: "悟りの天才",
    quote: "「感情を排して最善手を指し続ける。それが勝負の真理」",
    context: "通算最終1位12回以上を誇る『悟り』の対戦理論について",
    color: "from-amber-600 to-neutral-800",
  },
  {
    member: "バンビー",
    role: "絶対的エース",
    quote: "「今日ポケを開設しようって言ったあの日の選択が、人生最高の決断」",
    context: "今日ポケチャンネル結成時を振り返った名言",
    color: "from-amber-500 to-orange-600",
  },
];

export function QuoteGeneratorModal() {
  const [open, setOpen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = QUOTES[quoteIdx];

  const handleNext = () => {
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${current.quote} — ${current.member} (${current.context})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-neutral-900/80 px-4 py-2 text-xs font-bold text-amber-400 backdrop-blur-md hover:bg-neutral-800 hover:border-amber-400 transition-all shadow-md"
      >
        <Quote className="h-4 w-4" />
        <span>今日ポケ 名言カード</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                <Quote className="h-4 w-4" />
                <span>KYOUPOKE QUOTE CARD</span>
              </div>

              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 shadow-inner"
              >
                <span className={`inline-block rounded-full bg-gradient-to-r ${current.color} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
                  {current.member} ({current.role})
                </span>

                <blockquote className="mt-4 font-display text-lg sm:text-xl font-bold leading-relaxed text-white">
                  {current.quote}
                </blockquote>

                <p className="mt-4 border-t border-white/10 pt-3 text-xs text-neutral-400">
                  {current.context}
                </p>
              </motion.div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  次の名言
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "コピーしました！" : "名言をコピー"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
