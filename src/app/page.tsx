import Image from "next/image";

import { FadeIn } from "@/components/fade-in";
import { GiantTitle } from "@/components/giant-title";
import { LogoMark } from "@/components/logo-mark";
import { MemberCard } from "@/components/member-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WipeLink } from "@/components/wipe-link";

const members = [
  {
    name: "バンビー",
    role: "MC / バランサー",
    tags: ["MC", "全体進行", "SM S5・S6連続1位"],
    text: "1998年2月10日生まれ、埼玉県出身。番組全体の進行を担うMC的存在。第7世代（SM）で史上初の2期連続最終1位、第9世代（SV）シーズン1で歴代最高レートの最終1位を獲得した実力者。",
    focal: "78% 25%",
  },
  {
    name: "いろは",
    role: "構築デザイナー / ムードメーカー",
    tags: ["構築デザイナー", "ムードメーカー", "PJCS2025出場"],
    text: "1996年4月28日生まれ、愛知県出身。独自のパーティ構築から「構築デザイナー」と呼ばれる。2025年にはポケモンジャパンチャンピオンシップス（PJCS2025）・世界大会（WCS2025）出場権を獲得。",
    focal: "52% 25%",
  },
  {
    name: "くろこ",
    role: "理論派 / 最年少",
    tags: ["理論派", "最年少", "最終1位10回以上"],
    text: "1999年5月28日生まれ、神奈川県出身。通算最終1位10回以上を誇る圧倒的な対戦理論の持ち主でありながら、動画内では謙虚な後輩キャラを貫くギャップが魅力。",
    focal: "22% 25%",
  },
];

const achievements = [
  { label: "YouTube Creator Awards", sub: "銀の盾（登録者10万人）", tone: "brand" },
  { label: "テレビ東京「バトオフ」", sub: "公式番組へ出演", tone: "black" },
  { label: "ポケモン竜王戦2024", sub: "ゲーム部門出場", tone: "cream" },
  { label: "PJCS2025 / WCS2025", sub: "いろは選手が出場権獲得", tone: "brand-dark" },
  { label: "今日ポケ杯", sub: "ニコニコ生放送と連携開催", tone: "cream" },
  { label: "Pokémon TCG Pocket", sub: "コラボイベント開催", tone: "black" },
];

const thanksBadges = ["Thank you!", "ありがとう!", "Gracias!", "Merci!", "Danke!"];

const videos = [1, 2, 3];

const links = [
  { label: "YouTubeチャンネル", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X（旧Twitter）", href: "https://x.com/KYOUPOKEch" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="font-logo text-2xl text-brand">今日ポケ</span>
          <Badge className="bg-brand text-white">FAN SITE</Badge>
        </div>
        <WipeLink href="https://www.youtube.com/@KYOUPOKE">
          YouTubeを見る
        </WipeLink>
      </header>

      <section className="relative overflow-hidden bg-white px-6 pt-20 pb-10 sm:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(var(--brand) 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />
        <span className="pointer-events-none absolute top-1/2 left-4 hidden -translate-y-1/2 -rotate-90 text-xs font-bold tracking-widest text-neutral-400 uppercase sm:block">
          Unofficial Fan Site
        </span>
        <span className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rotate-90 text-xs font-bold tracking-widest text-neutral-400 uppercase sm:block">
          YouTube → World
        </span>

        <GiantTitle>今日ポケ</GiantTitle>

        <FadeIn delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-center text-neutral-600">
            世界トップクラスの対戦理論と、笑えるバラエティ企画を届けるポケモン対戦YouTuberグループ。
          </p>
        </FadeIn>

        <div className="mt-12 border-t border-neutral-200 pt-4 text-xs font-bold tracking-widest text-neutral-400 uppercase">
          Featured
        </div>
      </section>

      <FadeIn>
        <section className="bg-white px-6 pb-16 sm:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm font-bold text-neutral-500">
              今日ポケ（旧称：今日の○○ポケチャンネル）
            </p>
            <p className="font-display text-2xl text-brand">Meet the Members</p>
          </div>
          <div className="relative mt-6 h-[320px] w-full overflow-hidden rounded-2xl sm:h-[460px]">
            <Image
              src="/hero.png"
              alt="今日ポケ メンバーイメージ"
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </section>
      </FadeIn>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16">
        <FadeIn>
          <section id="profile">
            <h2 className="font-display text-3xl text-neutral-900">プロフィール</h2>
            <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              About
            </p>
            <Card className="mt-6 p-6 shadow-sm">
              <CardContent className="px-0">
                <p className="leading-relaxed text-neutral-700">
                  「今日ポケ」は2021年8月8日に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする3人組YouTuberグループです。
                  バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。
                </p>
                <p className="mt-4 leading-relaxed text-neutral-700">
                  2022年にはチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞。
                  現在はチャンネル登録者数 約58万人、総再生回数は10億回を超える規模まで成長しています。
                </p>
              </CardContent>
            </Card>
          </section>
        </FadeIn>

        <section id="members">
          <h2 className="font-display text-3xl text-neutral-900">メンバー紹介</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Members
          </p>
          <p className="mt-2 text-xs text-neutral-400">
            カードをタップすると詳細が開きます
          </p>
          <div className="mt-6 border-t border-neutral-200">
            {members.map((m, i) => (
              <FadeIn key={m.name} delay={i * 0.1}>
                <MemberCard
                  index={i}
                  name={m.name}
                  role={m.role}
                  tags={m.tags}
                  text={m.text}
                  focal={m.focal}
                />
              </FadeIn>
            ))}
          </div>
        </section>

        <FadeIn>
          <section id="achievements">
            <h2 className="font-display text-3xl text-neutral-900">実績・出演</h2>
            <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Recognition
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={cn(
                    "flex aspect-[4/3] cursor-default flex-col justify-end rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-1 hover:shadow-lg",
                    a.tone === "brand" && "bg-brand text-white",
                    a.tone === "brand-dark" && "bg-brand-dark text-white",
                    a.tone === "black" && "bg-black text-white",
                    a.tone === "cream" && "bg-[#f4ede4] text-neutral-900"
                  )}
                >
                  <p className="font-display text-lg leading-tight sm:text-xl">
                    {a.label}
                  </p>
                  <p className="mt-1 text-xs font-bold opacity-70">{a.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <section id="videos">
          <h2 className="font-display text-3xl text-neutral-900">おすすめ動画</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Videos
          </p>
          {/* TODO: 動画IDを実際のおすすめ動画のIDに差し替えてください */}
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {videos.map((n, i) => (
              <FadeIn key={n} delay={i * 0.1}>
                <Card className="overflow-hidden p-0 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title={`おすすめ動画${n}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="flex items-center gap-3 px-4 py-4">
                    <span className="font-display text-lg text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-neutral-500">
                      おすすめ動画{n}（TODO: タイトルを書き換えてください）
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            className="mt-8"
          >
            チャンネルの動画をもっと見る
          </WipeLink>
        </section>

        <FadeIn>
          <section id="links">
            <h2 className="font-display text-3xl text-neutral-900">リンク</h2>
            <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Links
            </p>
            {/* TODO: Instagram・TikTokの正式なURLが分かったら差し替えてください */}
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((l) => (
                <WipeLink key={l.href} href={l.href} wipeColor="bg-brand">
                  {l.label}
                </WipeLink>
              ))}
            </div>
          </section>
        </FadeIn>
      </main>

      <footer className="relative overflow-hidden border-t border-neutral-200 bg-black px-6 py-20 text-center sm:px-10">
        <div className="relative mx-auto inline-block">
          <h2 className="font-display text-brand text-[16vw] leading-none sm:text-[9vw]">
            ありがとう
          </h2>
          <span className="absolute top-2 -left-4 -translate-x-full rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white sm:-left-8">
            {thanksBadges[0]}
          </span>
          <span className="absolute top-1/3 -right-4 translate-x-full rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white sm:-right-10">
            {thanksBadges[1]}
          </span>
          <span className="absolute -bottom-6 left-1/4 rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white">
            {thanksBadges[2]}
          </span>
          <span className="absolute -bottom-2 right-1/4 rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white">
            {thanksBadges[3]}
          </span>
        </div>
        <p className="relative mt-10 text-sm text-white/60">
          このページは非公式のファンサイトです。今日ポケの活動を応援しています。
        </p>
      </footer>
    </div>
  );
}
