"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Sparkles } from "lucide-react";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  member: "バンビー" | "いろは" | "くろこ";
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "【バンビー問題】SVシーズン1でバンビー選手が達成した『歴代最高レート』の最終順位とレートは？",
    options: [
      "最終1位 / レート 2415",
      "最終2位 / レート 2390",
      "最終1位 / レート 2250",
      "最終3位 / レート 2100",
    ],
    answer: 0,
    explanation: "正解は『最終1位 / レート 2415』！第9世代最初のシーズンで記録的達成を果たした伝説のシーズンです。",
    member: "バンビー",
  },
  {
    id: 2,
    question: "【いろは問題】構築デザイナーこと『いろは』選手が出場権を獲得した2025年の世界大会は？",
    options: [
      "WCS2025 (世界大会)",
      "VGC2023",
      "ポケモンリーグ2022",
      "EVO 2025",
    ],
    answer: 0,
    explanation: "正解は『WCS2025 (世界大会)』！PJCS2025を経て見事世界への切符を掴み取りました。",
    member: "いろは",
  },
  {
    id: 3,
    question: "【くろこ問題】通算ランクマッチ最終1位の獲得回数が『12回以上』を誇る天才は誰？",
    options: ["くろこ", "バンビー", "いろは", "あしゅ"],
    answer: 0,
    explanation: "正解は『くろこ』！圧巻の悟り理論と安定感で『12回以上』の最終1位を記録しています。",
    member: "くろこ",
  },
];

export function BattleQuizWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const q = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === q.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 p-6 sm:p-8 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
          <HelpCircle className="h-4 w-4" />
          <span>今日ポケ ガチ知識クイズ</span>
        </div>
        <span className="font-mono text-xs text-neutral-400">
          Q {currentIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6"
          >
            <h4 className="font-display text-lg sm:text-xl leading-relaxed text-white font-bold">
              {q.question}
            </h4>

            <div className="mt-6 space-y-3">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === q.answer;
                let btnStyle = "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700";

                if (selectedOpt !== null) {
                  if (isCorrect) btnStyle = "bg-emerald-900/60 border-emerald-500 text-emerald-200 shadow-md";
                  else if (isSelected) btnStyle = "bg-red-900/60 border-red-500 text-red-200";
                }

                return (
                  <button
                    key={opt}
                    disabled={selectedOpt !== null}
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-bold transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOpt !== null && isCorrect && (
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                      </div>
                    )}
                    {selectedOpt !== null && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl bg-neutral-800/80 p-4 text-xs sm:text-sm text-neutral-300 border border-neutral-700"
              >
                <p className="font-bold text-amber-400">【解説】</p>
                <p className="mt-1 leading-relaxed">{q.explanation}</p>

                <button
                  onClick={handleNext}
                  className="mt-4 w-full rounded-lg bg-amber-500 py-2.5 font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md"
                >
                  {currentIdx + 1 < QUIZ_QUESTIONS.length ? "次の問題へ →" : "結果を見る 🏆"}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <Award className="mx-auto h-16 w-16 text-amber-400 animate-bounce" />
            <h3 className="font-display mt-4 text-2xl font-bold text-white">クイズ完了！</h3>
            <p className="mt-2 text-3xl font-mono font-bold text-amber-400">
              {score} / {QUIZ_QUESTIONS.length} 正解
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              {score === QUIZ_QUESTIONS.length
                ? "全問正解！あなたは真の今日ポケガチ勢です！"
                : "ナイスチャレンジ！今日ポケの動画をチェックして復習しよう！"}
            </p>

            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              <RotateCcw className="h-4 w-4" />
              もう一度挑戦する
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
