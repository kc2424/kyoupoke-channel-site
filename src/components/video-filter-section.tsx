"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TiltCard } from "@/components/tilt-card";
import { VideoModal } from "@/components/video-modal";
import Image from "next/image";
import { Play, Sparkles, Flame, Trophy } from "lucide-react";

type VideoItem = {
  id: number | string;
  videoId: string;
  title: string;
  category?: string;
};

const CATEGORIES = [
  { id: "all", label: "すべて", icon: Sparkles },
  { id: "match", label: "ガチ対戦・大会", icon: Trophy },
  { id: "variety", label: "企画・旅", icon: Flame },
];

export function VideoFilterSection({ videos }: { videos: VideoItem[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredVideos = videos.filter((v) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "match") {
      return (
        v.title.includes("対戦") ||
        v.title.includes("バトル") ||
        v.title.includes("1位") ||
        v.title.includes("決定戦")
      );
    }
    if (activeCategory === "variety") {
      return (
        v.title.includes("旅") ||
        v.title.includes("密着") ||
        v.title.includes("はじめから") ||
        !v.title.includes("対戦")
      );
    }
    return true;
  });

  return (
    <div className="mt-8">
      {/* カテゴリフィルタータブ */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 動画カードグリッド */}
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-3 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((v, i) => (
            <motion.div
              key={v.videoId || v.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TiltCard>
                <Card className="group/mono overflow-hidden p-0 shadow-sm border-neutral-200 hover:border-amber-500/50 transition-colors" data-cursor-label="WATCH">
                  <VideoModal videoId={v.videoId} title={`おすすめ動画 ${i + 1}`}>
                    <div className="relative aspect-video">
                      <Image
                        src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                        alt={v.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/mono:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-xl transition-transform duration-300 group-hover/mono:scale-110">
                          <Play className="ml-1 h-6 w-6 fill-current" />
                        </span>
                      </span>
                    </div>
                  </VideoModal>
                  <CardContent className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-5">
                    <span className="font-display text-lg font-bold text-brand lg:text-xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="line-clamp-2 text-sm font-bold text-neutral-800 lg:text-base">{v.title}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
