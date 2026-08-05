"use client";

import { useState } from "react";
import { Swords, Trophy, History, Zap, Sparkles } from "lucide-react";
import { PartyDeckPreview } from "@/components/party-deck-preview";
import { BattleQuizWidget } from "@/components/battle-quiz-widget";
import { BattleTimeline } from "@/components/battle-timeline";
import { MemberSkillRadar } from "@/components/member-skill-radar";

type TabId = "party" | "quiz" | "timeline" | "skills";

export function InteractiveFanTab() {
  const [activeTab, setActiveTab] = useState<TabId>("party");

  return (
    <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand uppercase">
            <Sparkles className="h-4 w-4" />
            <span>INTERACTIVE FAN HUB</span>
          </div>
          <h4 className="font-display mt-1 text-xl sm:text-2xl font-bold text-neutral-900">
            今日ポケ インタラクティブ・アーカイブ
          </h4>
        </div>

        {/* タブ切り替え */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-neutral-100 p-1">
          <button
            onClick={() => setActiveTab("party")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "party" ? "bg-brand text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>名構築</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "quiz" ? "bg-brand text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>ガチクイズ</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "timeline" ? "bg-brand text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>栄光の軌跡</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "skills" ? "bg-brand text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>能力比較</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "party" && <PartyDeckPreview />}
        {activeTab === "quiz" && <BattleQuizWidget />}
        {activeTab === "timeline" && <BattleTimeline />}
        {activeTab === "skills" && <MemberSkillRadar />}
      </div>
    </div>
  );
}
