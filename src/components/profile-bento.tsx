"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, Users, PlayCircle, ShieldCheck } from "lucide-react";
import { WipeLink } from "@/components/wipe-link";

export function ProfileBento({
  aboutParagraph1,
  aboutParagraph2,
}: {
  aboutParagraph1: string;
  aboutParagraph2: string;
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* メイン概要カード（Bento スパン2） */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 sm:p-8 text-white shadow-xl sm:col-span-2"
      >
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-dark/20 blur-3xl" />
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
            <ShieldCheck className="h-4 w-4" />
            <span>ABOUT KYOUPOKE</span>
          </div>
          <h3 className="font-display mt-3 text-2xl sm:text-3xl lg:text-4xl leading-snug">
            世界トップクラスの対戦理論 ✕ 笑えるバラエティ企画
          </h3>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            {aboutParagraph1}
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-400">
            {aboutParagraph2}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5 text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            結成: 2021.08.08
          </span>
          <span>•</span>
          <span>銀の盾獲得 (2022)</span>
          <span>•</span>
          <span className="text-amber-400 font-bold">登録者 67万人+</span>
        </div>
      </motion.div>

      {/* メンバークイックカード */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-amber-500/10 p-6 backdrop-blur-md shadow-sm hover:border-brand transition-colors"
      >
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
            <Users className="h-5 w-5" />
          </div>
          <h4 className="font-display mt-4 text-xl font-bold text-neutral-900">メンバー紹介</h4>
          <p className="mt-2 text-sm text-neutral-600">
            バンビー・いろは・くろこ。3人それぞれの圧倒的実績と愛される人柄。
          </p>
        </div>
        <WipeLink
          href="#members"
          wipeColor="bg-brand-dark"
          className="mt-6 inline-flex w-fit rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white border-transparent"
        >
          メンバーを見る →
        </WipeLink>
      </motion.div>

      {/* 実績クイックカード */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-brand transition-colors"
      >
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-md">
            <Award className="h-5 w-5 text-amber-400" />
          </div>
          <h4 className="font-display mt-4 text-xl font-bold text-neutral-900">実績・メディア出演</h4>
          <p className="mt-2 text-sm text-neutral-600">
            YouTube銀の盾、テレビ東京出演、WCS世界大会出場権などの輝かしい記録。
          </p>
        </div>
        <WipeLink
          href="#achievements"
          wipeColor="bg-black"
          className="mt-6 inline-flex w-fit rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white border-transparent"
        >
          実績一覧を見る →
        </WipeLink>
      </motion.div>

      {/* 動画クイックカード (スパン2) */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 p-6 sm:p-8 text-white shadow-xl sm:col-span-2"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <PlayCircle className="h-5 w-5" />
            </div>
            <h4 className="font-display mt-4 text-xl sm:text-2xl font-bold text-white">おすすめ動画＆最新投稿</h4>
            <p className="mt-2 text-sm text-neutral-300 max-w-xl">
              伝説の即興対戦から白熱の大会名勝負まで。今日ポケの魅力を凝縮した必見動画。
            </p>
          </div>
          <Sparkles className="h-6 w-6 text-amber-400 hidden sm:block animate-spin-slow" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-400">Total Views: 1.2 Billion+</span>
          <WipeLink
            href="#videos"
            wipeColor="bg-amber-500"
            className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-900 border-transparent hover:text-white"
          >
            動画を再生 →
          </WipeLink>
        </div>
      </motion.div>
    </div>
  );
}
