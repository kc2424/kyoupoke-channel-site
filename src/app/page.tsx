import Image from "next/image";

import { FadeIn } from "@/components/fade-in";
import { FullscreenMenu } from "@/components/fullscreen-menu";
import { GiantTitle } from "@/components/giant-title";
import { LogoMark } from "@/components/logo-mark";
import { MemberCard } from "@/components/member-card";
import { RevealText } from "@/components/reveal-text";
import { StickerBadge } from "@/components/sticker-badge";
import { UnderlineLink } from "@/components/underline-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WipeLink } from "@/components/wipe-link";

const navItems = [
  { label: "プロフィール", href: "#profile" },
  { label: "メンバー", href: "#members" },
  { label: "実績", href: "#achievements" },
  { label: "動画", href: "#videos" },
  { label: "リンク", href: "#links" },
];

const members = [
  {
    name: "バンビー",
    role: "絶対的エース",
    tags: ["絶対的エース", "世界1位2回", "SM S5・S6連続1位"],
    text: "1998年2月10日生まれ、埼玉県出身。番組を牽引する絶対的エースであり、ポケモン世界1位を2度獲得。幼少期の挫折をバネにした不屈の精神と、活動へのフルコミットメントぶりが持ち味。第7世代（SM）で史上初の2期連続最終1位、第9世代（SV）シーズン1で歴代最高レートの最終1位を獲得した実力者。",
    focal: "66% 35%",
  },
  {
    name: "いろは",
    role: "論理の体現者",
    tags: ["論理の体現者", "構築デザイナー", "PJCS2025出場"],
    text: "1996年4月28日生まれ、愛知県出身。『ポケットモンスター 赤・緑』発売の年に生まれ、ポケモンと共に育った世代の体現者。社会人経験に裏打ちされた安定感のある解説と、独自のパーティ構築から「構築デザイナー」と呼ばれるセンスが持ち味。2025年にはポケモンジャパンチャンピオンシップス（PJCS2025）・世界大会（WCS2025）出場権を獲得。",
    focal: "50% 36%",
  },
  {
    name: "くろこ",
    role: "悟りの天才",
    tags: ["悟りの天才", "世界1位14回以上", "剣盾二大巨頭"],
    text: "1999年5月28日生まれ、神奈川県出身。通算世界1位14回以上を誇る圧倒的な対戦理論の持ち主で、剣盾時代には「サック氏」と並び称された二大巨頭の一角。感情を排した「悟り」のロジックで対戦を組み立てながら、動画内では謙虚な後輩キャラを貫くギャップが魅力。",
    focal: "38% 38%",
  },
];

const achievements = [
  { label: "YouTube Creator Awards", sub: "銀の盾（登録者10万人）", tone: "brand" },
  { label: "テレビ東京「バトオフ」", sub: "公式番組へ出演", tone: "black" },
  { label: "ポケモン竜王戦2024", sub: "ゲーム部門出場", tone: "black" },
  { label: "PJCS2025 / WCS2025", sub: "いろは選手が出場権獲得", tone: "brand" },
  { label: "今日ポケ杯", sub: "ニコニコ生放送と連携開催", tone: "black" },
  { label: "Pokémon TCG Pocket", sub: "コラボイベント開催", tone: "brand" },
];

const videos = [1, 2, 3];

const links = [
  { label: "YouTubeチャンネル", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X（旧Twitter）", href: "https://x.com/KYOUPOKEch" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 lg:px-10 lg:py-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <LogoMark className="h-12 w-12 lg:h-16 lg:w-16" />
          <span className="font-wordmark text-2xl text-brand lg:text-4xl">KYOU POKE</span>
          <Badge className="bg-brand text-white lg:px-4 lg:py-1.5 lg:text-sm">FAN SITE</Badge>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-bold text-neutral-700 md:flex lg:gap-8 lg:text-base">
          {navItems.map((item) => (
            <UnderlineLink key={item.href} href={item.href}>
              {item.label}
            </UnderlineLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 lg:gap-4">
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            className="hidden sm:inline-flex lg:px-8 lg:py-4 lg:text-base"
          >
            YouTubeを見る
          </WipeLink>
          <FullscreenMenu />
        </div>
      </header>

      <section className="relative overflow-hidden bg-white px-6 pt-24 pb-10 sm:px-10">
        <span className="pointer-events-none absolute top-1/2 left-4 hidden -translate-y-1/2 -rotate-90 text-xs font-bold tracking-widest text-neutral-400 uppercase sm:block lg:text-sm">
          Unofficial Fan Site
        </span>
        <span className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rotate-90 text-xs font-bold tracking-widest text-neutral-400 uppercase sm:block lg:text-sm">
          YouTube → World
        </span>

        <div className="flex justify-center">
          <LogoMark className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32" />
        </div>

        <GiantTitle>KYOU POKE</GiantTitle>

        <FadeIn delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-center text-neutral-600 lg:max-w-2xl lg:text-xl">
            世界トップクラスの対戦理論と、笑えるバラエティ企画を届けるポケモン対戦YouTuberグループ。
          </p>
        </FadeIn>

        <div className="mt-12 border-t border-neutral-200 pt-4 text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
          Featured
        </div>
      </section>

      <FadeIn>
        <section className="bg-white px-6 pb-16 sm:px-10 lg:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
            <p className="font-display text-2xl text-brand lg:text-3xl">Meet the Members</p>
          </div>
          <div className="relative mt-6 h-[220px] w-full overflow-hidden rounded-2xl bg-[#df5330] sm:h-[340px] lg:h-[500px]">
            <Image
              src="/hero-mascots.png"
              alt="今日ポケ マスコットイラスト"
              fill
              priority
              className="object-contain"
            />
          </div>
        </section>
      </FadeIn>

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-6 py-16">
        <FadeIn>
          <section id="profile" className="scroll-mt-24">
            <RevealText
              as="h2"
              text="プロフィール"
              className="font-display text-3xl text-neutral-900 lg:text-5xl"
            />
            <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
              About
            </p>
            <Card className="mt-6 p-6 shadow-sm lg:p-10">
              <CardContent className="px-0">
                <p className="leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                  「今日ポケ」は2021年8月8日に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする3人組YouTuberグループです。
                  バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。
                </p>
                <p className="mt-4 leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                  2022年にはチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞。
                  現在はチャンネル登録者数 約58万人、総再生回数は10億回を超える規模まで成長しています。
                </p>
              </CardContent>
            </Card>
          </section>
        </FadeIn>

        <section id="members">
          <RevealText
            as="h2"
            text="メンバー紹介"
            className="font-display text-3xl text-neutral-900 lg:text-5xl"
          />
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
            Members
          </p>
          <p className="mt-2 text-xs text-neutral-400 lg:text-sm">
            カードをタップすると詳細が開きます
          </p>
          <div className="mt-6 border-t border-neutral-200">
            {members.map((m, i) => (
              <FadeIn key={m.name} x={-60} y={0} delay={i * 0.15}>
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

      </main>

      <FadeIn>
        <section id="achievements" className="scroll-mt-24 bg-black px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-[1600px]">
            <RevealText
              as="h2"
              text="実績・出演"
              className="font-display text-3xl text-white lg:text-5xl"
            />
            <p className="mt-2 text-xs font-bold tracking-widest text-white/40 uppercase lg:text-sm">
              Recognition
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:gap-5">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={cn(
                    "flex aspect-[4/3] cursor-default flex-col justify-end rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-1 hover:shadow-lg lg:p-7",
                    a.tone === "brand" && "bg-brand text-white",
                    a.tone === "black" && "bg-white/10 text-white"
                  )}
                >
                  <p className="font-display text-lg leading-tight sm:text-xl lg:text-2xl">
                    {a.label}
                  </p>
                  <p className="mt-1 text-xs font-bold opacity-70 lg:text-sm">{a.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-6 py-16">
        <section id="videos">
          <RevealText
            as="h2"
            text="おすすめ動画"
            className="font-display text-3xl text-neutral-900 lg:text-5xl"
          />
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
            Videos
          </p>
          {/* TODO: 動画IDを実際のおすすめ動画のIDに差し替えてください */}
          <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:gap-8">
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
                  <CardContent className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-5">
                    <span className="font-display text-lg text-brand lg:text-xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-neutral-500 lg:text-base">
                      おすすめ動画{n}（TODO: タイトルを書き換えてください）
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            className="mt-8 lg:px-8 lg:py-4 lg:text-base"
          >
            チャンネルの動画をもっと見る
          </WipeLink>
        </section>

      </main>

      <FadeIn>
        <section id="links" className="scroll-mt-24 bg-brand px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-[1600px]">
            <RevealText
              as="h2"
              text="リンク"
              className="font-display text-3xl text-white lg:text-5xl"
            />
            <p className="mt-2 text-xs font-bold tracking-widest text-white/60 uppercase lg:text-sm">
              Links
            </p>
            {/* TODO: Instagram・TikTokの正式なURLが分かったら差し替えてください */}
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((l) => (
                <WipeLink
                  key={l.href}
                  href={l.href}
                  wipeColor="bg-black"
                  className="border-white text-white lg:px-8 lg:py-4 lg:text-base"
                >
                  {l.label}
                </WipeLink>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <footer className="relative overflow-hidden border-t border-neutral-200 bg-black py-16">
        <div className="flex select-none whitespace-nowrap">
          {[0, 1].map((row) => (
            <div
              key={row}
              aria-hidden={row === 1}
              className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center gap-4">
                  <span className="font-wordmark text-brand text-4xl sm:text-6xl lg:text-8xl">
                    KYOU POKE
                  </span>
                  <LogoMark className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <StickerBadge className="pointer-events-auto">
            <span className="font-display text-base sm:text-lg lg:text-2xl">
              一緒に応援しよう
            </span>
            <span className="text-xs opacity-80 sm:text-sm lg:text-base">Say hello 👋</span>
          </StickerBadge>
        </div>

        <p className="relative mt-12 px-6 text-center text-sm text-white/60 sm:px-10 lg:text-base">
          このページは非公式のファンサイトです。今日ポケの活動を応援しています。
        </p>
      </footer>
    </div>
  );
}
