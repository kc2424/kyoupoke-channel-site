import { AchievementIcon } from "@/components/achievement-icon";
import { ActIndex } from "@/components/act-index";
import { BlueprintCorners } from "@/components/blueprint-corners";
import { ChapterMark } from "@/components/chapter-mark";
import { CurtainReveal } from "@/components/curtain-reveal";
import { FadeIn } from "@/components/fade-in";
import { FrameScrub } from "@/components/frame-scrub";
import { FullscreenMenu } from "@/components/fullscreen-menu";
import { GalleryCaption } from "@/components/gallery-caption";
import { GenerativeTrace } from "@/components/generative-trace";
import { GiantTitle } from "@/components/giant-title";
import { GrowthTimeline } from "@/components/growth-timeline";
import { HeroStickers } from "@/components/hero-stickers";
import { LogoMark } from "@/components/logo-mark";
import { Magnetic } from "@/components/magnetic";
import { MemberCard } from "@/components/member-card";
import { MonoReveal } from "@/components/mono-reveal";
import { NavMoodPreview, type NavMoodItem } from "@/components/nav-mood-preview";
import { OpArtRings } from "@/components/op-art-rings";
import { ParallaxImage } from "@/components/parallax-image";
import { RevealText } from "@/components/reveal-text";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollWeight } from "@/components/scroll-weight";
import { SectionBlend } from "@/components/section-blend";
import { SnapReveal } from "@/components/snap-reveal";
import { SoundToggle } from "@/components/sound-toggle";
import { SparkTap } from "@/components/spark-tap";
import { StatSpotlight } from "@/components/stat-spotlight";
import { TiltCard } from "@/components/tilt-card";
import { VideoModal } from "@/components/video-modal";
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

const acts = [
  { id: "profile", label: "プロフィール", tone: "light" },
  { id: "members", label: "メンバー", tone: "light" },
  { id: "achievements", label: "実績", tone: "dark" },
  { id: "videos", label: "動画", tone: "light" },
  { id: "links", label: "リンク", tone: "brand" },
] as const;

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

const stats = [
  { value: 58, suffix: "万人+", label: "チャンネル登録者数" },
  { value: 10, suffix: "億回+", label: "総再生回数" },
  { value: 10, suffix: "万人", label: "銀の盾を達成（2022年）" },
];

const achievements = [
  { label: "YouTube Creator Awards", sub: "銀の盾（登録者10万人）", tone: "brand", icon: "award" },
  { label: "テレビ東京「バトオフ」", sub: "公式番組へ出演", tone: "black", icon: "tv" },
  { label: "ポケモン竜王戦2024", sub: "ゲーム部門出場", tone: "black", icon: "controller" },
  { label: "PJCS2025 / WCS2025", sub: "いろは選手が出場権獲得", tone: "brand", icon: "globe" },
  { label: "今日ポケ杯", sub: "ニコニコ生放送と連携開催", tone: "black", icon: "live" },
  { label: "Pokémon TCG Pocket", sub: "コラボイベント開催", tone: "brand", icon: "cards" },
] as const;

// 実績カードをタップした時の音高倍率（ペンタトニックスケール）。カードごとに固有の音を鳴らす
const achievementTones = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2] as const;

const growthMilestones = [
  { date: "2021.08.08", label: "活動開始" },
  { date: "2022", label: "登録者10万人・銀の盾" },
  { date: "NOW", label: "登録者58万人+ / 再生10億回+" },
];

// TODO: 実際のおすすめ動画のIDに差し替えてください
const videos = [
  { id: 1, videoId: "dQw4w9WgXcQ" },
  { id: 2, videoId: "dQw4w9WgXcQ" },
  { id: 3, videoId: "dQw4w9WgXcQ" },
];

const links = [
  { label: "YouTubeチャンネル", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X（旧Twitter）", href: "https://x.com/KYOUPOKEch" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];

const navMoodItems: NavMoodItem[] = [
  { ...navItems[0], tone: "light", image: "/icon.png", caption: "3人の相棒たちのプロフィール" },
  { ...navItems[1], tone: "light", image: "/hero-mascots.png", caption: "バンビー・いろは・くろこ" },
  {
    ...navItems[2],
    tone: "dark",
    icon: <AchievementIcon name="award" tone="black" className="mb-0 h-14 w-14 lg:h-14 lg:w-14" />,
    caption: "銀の盾から公式番組出演まで",
  },
  { ...navItems[3], tone: "light", image: `https://img.youtube.com/vi/${videos[0].videoId}/hqdefault.jpg`, caption: "おすすめの対戦動画" },
  { ...navItems[4], tone: "brand", icon: <LogoMark className="h-12 w-12" />, caption: "SNS・SHOPへのリンク集" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <ScrollProgress sections={acts} />
      <ActIndex acts={acts} />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 lg:px-10 lg:py-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <LogoMark animated className="h-12 w-12 lg:h-16 lg:w-16" />
          <span className="font-wordmark text-2xl text-brand lg:text-4xl">KYOU POKE</span>
          <Badge className="bg-brand text-white lg:px-4 lg:py-1.5 lg:text-sm">FAN SITE</Badge>
        </div>
        <NavMoodPreview items={navMoodItems} />
        <div className="flex items-center gap-3 lg:gap-4">
          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            cursorLabel="OPEN"
            className="hidden sm:inline-flex lg:px-8 lg:py-4 lg:text-base"
          >
            YouTubeを見る
          </WipeLink>
          <SoundToggle />
          <FullscreenMenu />
        </div>
      </header>

      <section className="relative overflow-hidden bg-white px-6 pt-24 pb-10 sm:px-10">
        <HeroStickers />
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
        <section className="border-y border-neutral-200 bg-white px-6 py-14 sm:px-10 lg:py-24">
          <ScrollWeight className="mx-auto flex max-w-[1600px] flex-col items-start gap-1 lg:gap-2">
            <RevealText
              as="p"
              text="絶対的エース。"
              className="font-display text-4xl leading-[1.05] text-neutral-900 sm:text-6xl lg:text-8xl"
            />
            <RevealText
              as="p"
              text="論理の体現者。"
              className="font-display text-4xl leading-[1.05] text-brand sm:text-6xl lg:self-center lg:text-8xl"
            />
            <RevealText
              as="p"
              text="悟りの天才。"
              className="font-display text-4xl leading-[1.05] text-neutral-900 sm:text-6xl lg:self-end lg:text-8xl"
            />
          </ScrollWeight>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-white px-6 pb-16 sm:px-10 lg:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
            <p className="font-display text-2xl text-brand lg:text-3xl">Meet the Members</p>
          </div>
          <CurtainReveal className="mt-6 rounded-2xl" flapColor="#ffffff">
            <div tabIndex={0} className="group/gallery relative rounded-2xl focus:outline-none">
              <ParallaxImage
                wrapperClassName="h-[220px] w-full rounded-2xl bg-[#df5330] sm:h-[340px] lg:h-[500px]"
                src="/hero-mascots.png"
                alt="今日ポケ マスコットイラスト"
                fill
                priority
              />
              <BlueprintCorners tone="light" label="FIG.01 — MASCOTS" />
              <GalleryCaption
                eyebrow="Fig.01 — くろこ / いろは / バンビー"
                caption="1つの部屋、1台の画面。3人の距離感がそのままチームの空気。"
              />
            </div>
          </CurtainReveal>
        </section>
      </FadeIn>

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-6 py-16">
        <FadeIn>
          <section id="profile" className="scroll-mt-24">
            <ChapterMark index={1} total={5} className="mb-2" />
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
                <GrowthTimeline
                  milestones={growthMilestones}
                  className="mt-10 lg:mt-14"
                />
              </CardContent>
            </Card>
          </section>
        </FadeIn>

        <section id="members">
          <ChapterMark index={2} total={5} className="mb-2" />
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

      <div className="relative">
        <SectionBlend from="#f5f5f5" to="#000000" />
        <GenerativeTrace seed={1} />
      </div>

      <FadeIn>
        <section
          id="achievements"
          className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-16 sm:px-10"
        >
          <OpArtRings className="top-1/2 right-0 h-[280px] w-[280px] -translate-y-1/2 translate-x-1/3 sm:h-[420px] sm:w-[420px] lg:h-[560px] lg:w-[560px]" />
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <ChapterMark index={3} total={5} tone="dark" className="mb-2" />
            <RevealText
              as="h2"
              text="実績・出演"
              className="font-display text-3xl text-white lg:text-5xl"
            />
            <p className="mt-2 text-xs font-bold tracking-widest text-white/40 uppercase lg:text-sm">
              Recognition
            </p>
            <StatSpotlight
              stats={stats}
              className="mt-10 border-y border-white/10 py-8 lg:py-10"
            />
            <SnapReveal className="mt-10 grid gap-3 sm:grid-cols-3 lg:gap-5">
              {achievements.map((a, i) => {
                const isFlagship = i === 0;
                return (
                  <SparkTap
                    key={a.label}
                    tone={achievementTones[i % achievementTones.length]}
                    className={cn(
                      "flex cursor-pointer rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-1 hover:shadow-lg lg:p-7",
                      isFlagship
                        ? "aspect-[16/9] flex-row items-center gap-5 sm:col-span-3 sm:aspect-[32/9] lg:gap-8"
                        : "aspect-[4/3] flex-col justify-end",
                      a.tone === "brand" && "bg-brand text-white",
                      a.tone === "black" && "bg-white/10 text-white"
                    )}
                  >
                    <AchievementIcon
                      name={a.icon}
                      tone={a.tone}
                      className={isFlagship ? "mb-0 h-12 w-12 shrink-0 lg:h-20 lg:w-20" : undefined}
                    />
                    <div>
                      <p
                        className={cn(
                          "font-display leading-tight",
                          isFlagship ? "text-xl sm:text-2xl lg:text-4xl" : "text-lg sm:text-xl lg:text-2xl"
                        )}
                      >
                        {a.label}
                      </p>
                      <p
                        className={cn(
                          "mt-1 font-bold opacity-70",
                          isFlagship ? "text-xs lg:text-base" : "text-xs lg:text-sm"
                        )}
                      >
                        {a.sub}
                      </p>
                    </div>
                  </SparkTap>
                );
              })}
            </SnapReveal>
          </div>
        </section>
      </FadeIn>

      <div className="relative">
        <SectionBlend from="#000000" to="#f5f5f5" />
        <GenerativeTrace seed={2} />
      </div>

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-6 py-16">
        <section id="videos">
          <ChapterMark index={4} total={5} className="mb-2" />
          <RevealText
            as="h2"
            text="おすすめ動画"
            className="font-display text-3xl text-neutral-900 lg:text-5xl"
          />
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
            Videos
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:gap-8">
            {videos.map((v, i) => (
              <FadeIn key={v.id} delay={i * 0.1}>
                <TiltCard>
                  <Card className="group/mono overflow-hidden p-0 shadow-sm" data-cursor-label="見る">
                    <VideoModal videoId={v.videoId} title={`おすすめ動画${v.id}`}>
                      <MonoReveal className="relative aspect-video">
                        <FrameScrub videoId={v.videoId} alt={`おすすめ動画${v.id}のサムネイル`} />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform duration-300 group-hover/mono:scale-110 lg:h-20 lg:w-20">
                            <svg
                              viewBox="0 0 24 24"
                              className="ml-1 h-6 w-6 fill-current lg:h-8 lg:w-8"
                              aria-hidden="true"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </MonoReveal>
                    </VideoModal>
                    <CardContent className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-5">
                      <span className="font-display text-lg text-brand lg:text-xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-neutral-500 lg:text-base">
                        おすすめ動画{v.id}（TODO: タイトルを書き換えてください）
                      </p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
          <Magnetic>
            <WipeLink
              href="https://www.youtube.com/@KYOUPOKE"
              cursorLabel="OPEN"
              className="mt-8 lg:px-8 lg:py-4 lg:text-base"
            >
              チャンネルの動画をもっと見る
            </WipeLink>
          </Magnetic>
        </section>

      </main>

      <div className="relative">
        <SectionBlend from="#f5f5f5" to="#d9552e" />
        <GenerativeTrace seed={3} />
      </div>

      <FadeIn>
        <section id="links" className="scroll-mt-24 bg-brand px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-[1600px]">
            <ChapterMark index={5} total={5} tone="brand" className="mb-2" />
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
                <Magnetic key={l.href}>
                  <WipeLink
                    href={l.href}
                    wipeColor="bg-black"
                    cursorLabel="OPEN"
                    className="border-white text-white lg:px-8 lg:py-4 lg:text-base"
                  >
                    {l.label}
                  </WipeLink>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="relative">
        <SectionBlend from="#d9552e" to="#000000" />
        <GenerativeTrace seed={4} />
      </div>

      <footer className="relative overflow-hidden bg-black py-16">
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

        <p className="relative mt-12 px-6 text-center text-sm text-white/60 sm:px-10 lg:text-base">
          このページは非公式のファンサイトです。今日ポケの活動を応援しています。
        </p>
      </footer>
    </div>
  );
}
