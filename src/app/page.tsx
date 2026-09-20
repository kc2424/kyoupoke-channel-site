import Link from "next/link";
import { BlueprintCorners } from "@/components/blueprint-corners";
import { AmbientMeshBackground } from "@/components/ambient-mesh-background";
import { BentoCard } from "@/components/bento-card";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { formatNewsDate, getLatestNews } from "@/content/news";
import { videoJsonLd } from "@/lib/seo";
import {
  InstagramIcon,
  ShopIcon,
  TikTokIcon,
  UserIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/brand-icons";
import { FadeIn } from "@/components/fade-in";
import { GiantTitle } from "@/components/giant-title";
import { HeroStickers } from "@/components/hero-stickers";
import { MemberCard } from "@/components/member-card";
import { ParallaxImage } from "@/components/parallax-image";
import { RevealText } from "@/components/reveal-text";
import { SectionHeading } from "@/components/section-heading";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteHeader } from "@/components/site-header";
import { SnapReveal } from "@/components/snap-reveal";
import { SparkTap } from "@/components/spark-tap";
import { StatSpotlight } from "@/components/stat-spotlight";
import { TiltCard } from "@/components/tilt-card";
import { VideoModal } from "@/components/video-modal";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WipeLink } from "@/components/wipe-link";
import {
  fetchAchievements,
  fetchLinks,
  fetchPublishedMembers,
  fetchSiteTexts,
  fetchStats,
  fetchVideos,
  type NotionLinkIcon,
} from "@/lib/notion";
import { fetchLatestVideos } from "@/lib/youtube";
import Image from "@/components/site-image";
import { SmoothScroll } from "@/components/smooth-scroll";
import { imageSource, imageSourceSet } from "@/lib/prepared-images";

const linkIconMap: Record<NotionLinkIcon, typeof YouTubeIcon> = {
  YouTube: YouTubeIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Shop: ShopIcon,
  User: UserIcon,
};

// Notion側の「メンバー・コンテンツ」DBを一定間隔で再取得する。
export const revalidate = 300;

// ページ全体で共有する横方向のグリッド。
// ヘッダーからフッターまで左端が1本の線で揃うよう、余白は必ずここに一本化する。
const CONTAINER = "mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16";

// Notion未接続時、またはNotion側にメンバーが未登録の場合のフォールバック。
const fallbackMembers = [
  {
    name: "バンビー",
    role: "絶対的エース",
    tags: ["絶対的エース", "第7世代2連続最終1位", "歴代最高レート2415"],
    text: "1998年2月10日生まれ、埼玉県出身。番組を牽引する絶対的エースであり、ポケモン最終1位を2度獲得。幼少期の挫折をバネにした不屈の精神と、活動へのフルコミットメントぶりが持ち味。第7世代（SM）で史上初の2期連続最終1位、第9世代（SV）シーズン1で歴代最高レートの最終1位を獲得した実力者。今日ポケch.の開設を提案した発起人でもある。",
    photo: "/members/banbee.png",
    milestones: [
      { period: "中高時代", text: "対戦実況者の配信をきっかけにポケモン対戦を始め、本格参戦した初シーズンでいきなりレート2000を達成。" },
      { period: "大学時代", text: "『USUM』で2期連続最終1位を獲得し、一気に注目を集める。動画制作にのめり込んでいく。" },
      { period: "2021年", text: "より幅広い企画やトークができる場を求めてメンバーに声をかけ、「今日ポケch.」を結成。" },
      { period: "『SV』シーズン1", text: "歴代最高レートで最終1位を獲得。本人いわく「人生で一番嬉しかった」瞬間。" },
    ],
  },
  {
    name: "いろは",
    role: "論理の体現者",
    tags: ["論理の体現者", "WCS2025日本代表", "第7世代シングル最終6位"],
    text: "1996年4月28日生まれ、愛知県出身。『ポケットモンスター 赤・緑』発売の年に生まれ、ポケモンと共に育った世代の体現者。社会人経験に裏打ちされた安定感のある解説と、独自のパーティ構築から「構築デザイナー」と呼ばれるセンスが持ち味。2025年にはポケモンジャパンチャンピオンシップス（PJCS2025）・世界大会（WCS2025）出場権を獲得。",
    photo: "/members/iroha.png",
    milestones: [
      { period: "高校時代", text: "対戦知識に詳しい友人たちや対戦配信の影響で、ポケモン対戦に本格的にのめり込む。" },
      { period: "大学時代", text: "ポケモンサークルの仲間と切磋琢磨し、『ORAS』最終シーズンでレート2200を達成。" },
      { period: "大学院時代", text: "『USUM』でシーズン6位・10位（2期連続1ページ目）を獲得。動画制作の面白さから大学院進学を選択。" },
      { period: "2021年8月", text: "バンビーからの誘いで「今日ポケ」に参加。当時は仕事終わりに撮影へ駆けつけていた。" },
      { period: "その後", text: "専業YouTuberへ転向し、活動に専念。" },
    ],
  },
  {
    name: "くろこ",
    role: "悟りの天才",
    tags: ["悟りの天才", "通算最終1位12回以上", "歴代最強トレーナー"],
    text: "通算ランクマッチ最終1位12回以上を誇る圧倒的な対戦理論の持ち主で、剣盾時代には二大巨頭の一角と称された。感情を排した「悟り」のロジックで対戦を組み立てながら、動画内では謙虚な後輩キャラを貫くギャップが魅力。",
    photo: "/members/kuroko.png",
    milestones: [
      { period: "高校卒業後", text: "「レート2000ってかっこよくね？」と思い立ち、19歳からポケモン対戦を本格的に開始。" },
      { period: "初シーズン", text: "参戦初シーズンでいきなりレート2000（53位）を達成し、翌シーズンには一桁順位を獲得して頭角を現す。" },
      { period: "大学時代", text: "YouTubeを開設。USUM後期〜剣盾初期にかけて1位獲得を機に知名度が上昇。" },
      { period: "2021年7月", text: "あしゅからの勧誘をきっかけに「今日ポケ」に参加。" },
    ],
  },
];

// TODO: 自己紹介文・役割が分かり次第、正式な内容に差し替えてください
const staffMembers = [
  {
    name: "あしゅ",
    role: "天の声・司会",
    text: "今日ポケの企画進行や実況を支える「天の声」。詳しいプロフィールは準備中です。",
  },
  {
    name: "ふらとら",
    role: "編集・企画",
    text: "動画の編集・企画で活躍するメンバー。詳しいプロフィールは準備中です。",
  },
  {
    name: "サイヨーマ",
    role: "編集・企画",
    text: "動画の編集・企画で活躍するメンバー。詳しいプロフィールは準備中です。",
  },
];

const fallbackStats = [
  { value: 68.3, decimals: 1, suffix: "万人+", label: "チャンネル登録者数" },
  { value: 12.5, decimals: 1, suffix: "億回+", label: "総再生回数" },
  { value: 10, decimals: 0, suffix: "万人", label: "銀の盾を達成（2022年）" },
];

// 新しい実績ほど先頭に並べる（Notion側の「表示順」と同じ並び）。
const fallbackAchievements = [
  {
    label: "REJECT杯 優勝",
    sub: "チームくろこが「はじまりの王者」獲得（2026年8月）",
    tone: "brand" as const,
  },
  {
    label: "REJECT パートナーシップ",
    sub: "プロeスポーツチームと提携（2026年8月）",
    tone: "black" as const,
  },
  {
    label: "PJCS / WCS 2年連続出場",
    sub: "いろは選手が2025・2026年と連続で日本代表・世界大会出場権獲得",
    tone: "brand" as const,
  },
  { label: "KYOUPOKE GYM", sub: "対戦イベントを開催", tone: "brand" as const },
  { label: "テレビ東京「バトオフ」", sub: "公式番組へ出演（2024年5月27日〜7月1日放映）", tone: "black" as const },
  { label: "YouTube Creator Awards", sub: "銀の盾（登録者10万人）", tone: "brand" as const },
];

// 実績の見出しに一致する場合、カード背景に写真を敷く。
// position は 4:3 に切り抜くときの寄せ方（未指定なら中央）。
// カードは下端に見出しを重ねるので、被写体やロゴが下部にある画像は
// object-top 側に寄せて文字と衝突させない。
const achievementImages: Record<string, { src: string; position?: string }> = {
  "YouTube Creator Awards": { src: "/achievements/youtube-award.jpg" },
  "テレビ東京「バトオフ」": { src: "/achievements/tv-tokyo-battle-of.jpg" },
  "PJCS / WCS 2年連続出場": { src: "/achievements/wcs-logo.png" },
  "KYOUPOKE GYM": { src: "/achievements/kyoupoke-gym.jpg" },
  "REJECT パートナーシップ": { src: "/achievements/reject-partnership.jpg" },
  "REJECT杯 優勝": {
    src: "/achievements/reject-cup-victory.jpg",
    position: "object-top",
  },
};

const fallbackVideos = [
  { id: 1, videoId: "8BfcRA0mPfg", title: "【旅パで本気バトル】ポケモンSVをはじめから遊んで60分後に即対戦！" },
  { id: 2, videoId: "c31keuiRd7E", title: "【最終日合宿】「最終1位チャレンジしてきます。」ポケモン対戦に本気で挑む大人達のリアルに密着" },
  { id: 3, videoId: "V3svBZv4ykk", title: "【4世代vs5世代vs9世代】ポ ケ モ ン 最 強 世 代 決 定 戦 -グランドファイナル-" },
];

const fallbackMainLinks = [
  { label: "YouTube", sub: "今日ポケ Official", href: "https://www.youtube.com/@KYOUPOKE", icon: "YouTube" as const },
  { label: "X（旧Twitter）", sub: "@KYOUPOKEch", href: "https://x.com/KYOUPOKEch", icon: "X" as const },
  { label: "Instagram", sub: "@kyoupokeexpress", href: "https://www.instagram.com/kyoupokeexpress", icon: "Instagram" as const },
  { label: "TikTok", sub: "@kyoupoke", href: "https://www.tiktok.com/@kyoupoke", icon: "TikTok" as const },
  { label: "今日ポケ SHOP", sub: "オンラインストア", href: "https://kyoupoke.shop", icon: "Shop" as const },
];

const fallbackMemberLinks = [
  { label: "バンビー", sub: "個人チャンネル", href: "https://www.youtube.com/channel/UCNOnv5No5KtT3fmvcztSkEg", icon: "User" as const },
  { label: "いろは", sub: "個人チャンネル", href: "https://www.youtube.com/channel/UCUR5Eg2dU2RFygBWyfkkIEQ", icon: "User" as const },
  { label: "くろこ", sub: "個人チャンネル", href: "https://www.youtube.com/channel/UC4e7rsaJW-M7vr55lsDMjYQ", icon: "User" as const },
];

const fallbackTexts = {
  hero_tagline: "世界トップクラスの対戦理論と、笑えるバラエティ企画を届ける\nポケモン対戦YouTuberグループ。",
  catchcopy_line1: "絶対的エース。",
  catchcopy_line2: "論理の体現者。",
  catchcopy_line3: "悟りの天才。",
  about_paragraph1:
    "「今日ポケ」は2021年8月11日に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする3人組YouTuberグループです。バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。",
  about_paragraph2:
    "2022年にはチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞。現在はチャンネル登録者数 約67万人、総再生回数は12億回を超える規模まで成長しています。",
};

// おすすめ動画・最新動画で共通のカード表示。
function VideoCard({ video, index, labelPrefix }: { video: { videoId: string; title: string }; index: number; labelPrefix: string }) {
  return (
    <TiltCard>
      <Card className="group/mono overflow-hidden p-0 shadow-sm" data-cursor-label="WATCH">
        <VideoModal videoId={video.videoId} title={video.title}>
          <div className="relative aspect-video">
            <Image
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title}
              fill
              sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1279px) 33vw, 480px"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform duration-300 group-hover/mono:scale-110 lg:h-20 lg:w-20">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current lg:h-8 lg:w-8" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </div>
        </VideoModal>
        <CardContent className="flex items-center gap-3 px-4 py-4 lg:px-6 lg:py-5">
          <span aria-label={`${labelPrefix}${index + 1}`} className="font-display text-lg text-brand-dark lg:text-xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="line-clamp-2 text-sm text-neutral-600 lg:text-base">{video.title}</p>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

// SNSリンク・メンバーチャンネル共通のカード。
// モバイルは縦に積むと8枚で画面を占有しすぎるため、アイコン+テキストの横1行に畳む。
// sm以上ではBentoグリッドらしい縦積みの大きめカードに戻す。
function LinkCard({
  link,
  Icon,
  feature = false,
}: {
  link: { label: string; sub: string; href: string };
  Icon: typeof YouTubeIcon;
  feature?: boolean;
}) {
  return (
    <BentoCard
      href={link.href}
      cursorLabel="OPEN"
      tone={feature ? "brand" : "light"}
      className="h-full flex-row items-center gap-4 p-4 sm:flex-col sm:items-stretch sm:justify-between sm:gap-0 sm:p-6 lg:p-8"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 sm:h-12 sm:w-12 lg:h-14 lg:w-14",
          feature ? "bg-white text-brand" : "bg-brand text-white"
        )}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col sm:mt-6 sm:flex-none">
        <span
          className={cn(
            "font-display truncate text-base sm:text-lg lg:text-2xl",
            feature ? "text-white" : "text-neutral-900"
          )}
        >
          {link.label}
        </span>
        <span
          className={cn(
            "truncate text-xs font-semibold sm:mt-1 lg:text-sm",
            feature ? "text-white/80" : "text-neutral-600"
          )}
        >
          {link.sub}
        </span>
      </span>

      {/* モバイルは矢印だけに省略し、sm以上で「ひらく →」を出す */}
      <span
        className={cn(
          "flex shrink-0 items-center gap-2 text-sm font-bold sm:mt-5",
          feature ? "text-white" : "text-brand"
        )}
      >
        <span className="hidden sm:inline">ひらく</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </BentoCard>
  );
}

export default async function Home() {
  const [
    notionMembers,
    notionStaff,
    notionStats,
    notionAchievements,
    notionVideos,
    notionLinks,
    notionTexts,
    latestVideos,
    latestNews,
  ] = await Promise.all([
    fetchPublishedMembers("メインメンバー"),
    fetchPublishedMembers("スタッフ"),
    fetchStats(),
    fetchAchievements(),
    fetchVideos(),
    fetchLinks(),
    fetchSiteTexts(),
    fetchLatestVideos(3),
    getLatestNews(3).catch(() => null),
  ]);

  const cmsConfigured = Boolean(process.env.NOTION_TOKEN);
  const members = notionMembers ?? (cmsConfigured ? [] : fallbackMembers);
  const staff = notionStaff ?? (cmsConfigured ? [] : staffMembers);
  const stats = notionStats ?? (cmsConfigured ? [] : fallbackStats);
  const achievements = notionAchievements ?? (cmsConfigured ? [] : fallbackAchievements);
  const achievementWideFrom = achievements.length % 3 === 2 ? achievements.length - 2 : -1;
  const videos = notionVideos ?? (cmsConfigured ? [] : fallbackVideos);
  const mainLinks = notionLinks?.mainLinks ?? (cmsConfigured ? [] : fallbackMainLinks);
  const memberLinks = notionLinks?.memberLinks ?? (cmsConfigured ? [] : fallbackMemberLinks);
  const texts = { ...fallbackTexts, ...notionTexts };
  const partiallyUnavailable = cmsConfigured && [notionMembers, notionStaff, notionStats, notionAchievements, notionVideos, notionLinks, notionTexts].some((value) => value === null);
  const subscribers = stats.find((stat) => stat.label === "チャンネル登録者数");
  const views = stats.find((stat) => stat.label === "総再生回数");
  const formatStat = (stat: (typeof stats)[number] | undefined) => stat
    ? stat.value.toLocaleString("ja-JP", { minimumFractionDigits: stat.decimals, maximumFractionDigits: stat.decimals }) + stat.suffix
    : undefined;
  const statsUpdatedAt = notionStats?.map((stat) => stat.updatedAt).filter((date): date is string => Boolean(date)).sort().at(-1);
  const aboutParagraph2 = texts.about_paragraph2
    .replace(/(現在はチャンネル登録者数\s*約?)[\d.]+万人/, (_, prefix) => subscribers ? prefix + subscribers.value + "万人" : _)
    .replace(/(総再生回数は)[\d.]+億回/, (_, prefix) => views ? prefix + views.value + "億回" : _);

  return (
    <SmoothScroll>
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <JsonLd data={videoJsonLd([...videos, ...(latestVideos ?? [])])} />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="relative isolate flex min-h-[760px] flex-col justify-end overflow-hidden bg-white sm:min-h-[700px] lg:min-h-[min(850px,100svh)] landscape-compact:min-h-[580px]">
          <picture className="absolute inset-0 -z-10">
            <source media="(max-width: 639px) and (orientation: portrait)" srcSet={imageSourceSet("/hero-mobile.png")} sizes="100vw" />
            {/* A single picture lets the browser request only the matching hero. */}
            <img src={imageSource("/hero-members.jpg", 1600)} srcSet={imageSourceSet("/hero-members.jpg")} sizes="100vw" width={1601} height={1101} fetchPriority="high" alt="今日ポケ メンバー3人" className="h-full w-full object-cover object-top" />
          </picture>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-white via-white/10 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45%] bg-gradient-to-t from-white via-white/90 to-transparent" />
          <HeroStickers subscribers={formatStat(subscribers)} views={formatStat(views)} />
          <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-96 pb-10 text-center sm:px-10 sm:pt-80 lg:pt-64 lg:pb-8">
            <p className="mb-3 rounded-full border border-brand-dark/20 bg-white/95 px-4 py-1 text-xs font-bold text-brand-dark">今日ポケch. 非公式ファンサイト</p>
            <GiantTitle>KYOU POKE</GiantTitle>
            <p className="mt-4 max-w-xl whitespace-pre-line text-sm font-semibold leading-relaxed text-neutral-800 sm:text-base">{texts.hero_tagline}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#videos" className="rounded-full bg-brand-dark px-7 py-3 text-sm font-bold text-white hover:bg-neutral-900">動画を見る ↓</a>
              <a href="#members" className="rounded-full border-2 border-neutral-900 bg-white/95 px-6 py-3 text-sm font-bold text-neutral-900 hover:bg-neutral-100">メンバーを知る</a>
            </div>
          </div>
        </section>
        {partiallyUnavailable && <p role="status" className="mx-auto max-w-4xl px-6 py-4 text-sm text-neutral-600">一部の情報を読み込めませんでした。時間をおいてもう一度ご覧ください。</p>}
      <FadeIn>
        <section id="videos" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <AmbientMeshBackground variant="cinematic" />
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading index={1} label="Videos" heading="おすすめ動画" note="企画や対戦、メンバーの掛け合い。気になる1本からお楽しみください。" />
            <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-8">
              {videos.map((v, i) => (
                <FadeIn key={v.id} delay={i * 0.1}>
                  <VideoCard video={v} index={i} labelPrefix="おすすめ動画" />
                </FadeIn>
              ))}
            </div>

            {latestVideos && latestVideos.length > 0 && (
              <details className="mt-10 rounded-2xl border border-neutral-200 p-5 sm:p-6">
                <summary className="cursor-pointer text-lg font-bold text-brand-dark">最新動画をチェックする</summary>
                <p className="mt-6 text-xs font-bold tracking-widest text-neutral-600 uppercase lg:text-sm">
                  Latest
                </p>
                <h3 className="font-display mt-2 text-2xl text-neutral-900 lg:text-3xl">最新動画</h3>
                <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-8">
                  {latestVideos.map((v, i) => (
                    <FadeIn key={v.videoId} delay={i * 0.1} className={i >= 3 ? "hidden sm:block" : undefined}>
                      <VideoCard video={v} index={i} labelPrefix="最新動画" />
                    </FadeIn>
                  ))}
                </div>
              </details>
            )}

            {!latestVideos && <p className="mt-6 text-sm text-neutral-600">最新動画を読み込めませんでした。チャンネルからご覧ください。</p>}

            <WipeLink
              href="https://www.youtube.com/@KYOUPOKE"
              cursorLabel="OPEN"
              className="mt-10 lg:px-8 lg:py-4 lg:text-base"
            >
              チャンネルの動画をもっと見る
            </WipeLink>
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section id="news" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <AmbientMeshBackground variant="bubbles" />
          <div className={cn(CONTAINER, "relative z-10")}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading index={2} label="News" heading="お知らせ" />
              <Link
                href="/news"
                data-cursor-label="MORE"
                className="group inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors duration-200 hover:text-brand-dark lg:text-base"
              >
                すべてのお知らせ
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {!latestNews && <p className="mt-6 text-sm text-neutral-600">お知らせを読み込めませんでした。時間をおいて一覧をご確認ください。</p>}
            {latestNews?.length === 0 && <p className="mt-6 text-neutral-600">現在、公開中のお知らせはありません。</p>}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(latestNews ?? []).map((article, i) => (
                <FadeIn key={article.slug} delay={i * 0.08} className="h-full">
                  <BentoCard
                    href={`/news/${article.slug}`}
                    cursorLabel="READ"
                    className="h-full"
                  >
                    <span className="flex items-center gap-3">
                      <span className="rounded-full bg-brand-dark px-3 py-1 text-[11px] font-bold text-white lg:text-xs">
                        {article.category}
                      </span>
                      <time
                        dateTime={article.date}
                        className="text-xs font-bold text-neutral-500 lg:text-sm"
                      >
                        {formatNewsDate(article.date)}
                      </time>
                    </span>
                    <span className="font-display mt-4 block text-lg leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-brand-dark lg:text-xl">
                      {article.title}
                    </span>
                    <span className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                      {article.summary}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                      詳しく見る
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </BentoCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section id="profile" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <div className={cn(CONTAINER, "relative z-10")}>
            <div className="lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
              <SectionHeading
                index={3}
                label="About"
                heading="プロフィール"
                className="lg:sticky lg:top-32 lg:self-start"
              />
              <div className="mt-6 lg:mt-0">
                {notionTexts?.about_paragraph1 ? (
                  <p className="leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                    {texts.about_paragraph1}
                  </p>
                ) : (
                  <p className="leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                    「今日ポケ」は<span className="text-brand-dark font-bold">2021年8月11日</span>に活動を開始した、『ポケットモンスター』シリーズ的対戦（対戦競技シーン）を専門とする
                    <span className="text-brand-dark font-bold">3人組</span>YouTuberグループです。
                    バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。
                  </p>
                )}
                <p className="mt-4 leading-relaxed text-neutral-700 lg:text-lg">{aboutParagraph2}</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
        <div className={cn(CONTAINER, "py-6")}>
          <div className="relative overflow-hidden rounded-2xl bg-brand">
            <ParallaxImage src="/hero-mascots.png" alt="今日ポケ マスコットイラスト" fill sizes="(max-width: 639px) calc(100vw - 48px), 1280px" wrapperClassName="h-[160px] sm:h-[260px]" className="object-cover" />
            <BlueprintCorners tone="light" label="KYOUPOKE" />
          </div>
        </div>
      <FadeIn>
        <section id="members" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading
              index={4}
              label="Members"
              heading="メンバー紹介"
              note="カードをタップすると詳細が開きます"
            />
            <div className="mt-10 border-t border-neutral-200">
              {members.map((m, i) => (
                <FadeIn key={m.name} x={-60} y={0} delay={i * 0.15}>
                  <MemberCard
                    index={i}
                    name={m.name}
                    role={m.role}
                    tags={m.tags}
                    text={m.text}
                    photo={m.photo}
                    milestones={m.milestones}
                  />
                </FadeIn>
              ))}
            </div>

            <p className="mt-16 text-xs font-bold tracking-widest text-neutral-600 uppercase lg:text-sm">
              Staff
            </p>
            <RevealText
              as="h3"
              text="裏方メンバー"
              className="font-display mt-1 text-2xl text-neutral-900 lg:text-4xl"
            />
            <div className="mt-6 border-t border-neutral-200">
              {staff.map((m, i) => (
                <FadeIn key={m.name} x={-60} y={0} delay={i * 0.1}>
                  <MemberCard
                    index={i}
                    name={m.name}
                    role={m.role}
                    tags={[]}
                    text={m.text}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section
          id="achievements"
          className="relative scroll-mt-24 overflow-hidden py-12 sm:py-16 lg:py-20 text-neutral-900"
        >
          <AmbientMeshBackground variant="waves" />
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading index={5} label="Recognition" heading="実績・出演" tone="light" />
            <StatSpotlight
              stats={stats}
              className="mt-8 py-6 sm:py-8 lg:py-10 text-neutral-900"
            />
            {statsUpdatedAt && <p className="text-xs text-neutral-600">掲載データ更新：<time dateTime={statsUpdatedAt}>{formatNewsDate(statsUpdatedAt)}</time></p>}
            <SnapReveal className="mt-10 grid gap-3 sm:grid-cols-6 lg:gap-5">
              {achievements.map((a, i) => {
                const image = achievementImages[a.label];
                const wide = achievementWideFrom >= 0 && i >= achievementWideFrom;
                return (
                  <SparkTap
                    key={a.label}
                    celebrationLabel={`${a.label}を祝う`}
                    className={cn(
                      "flex aspect-[4/3] flex-col justify-end rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-1 hover:shadow-lg lg:p-7",
                      wide ? "sm:col-span-3 sm:aspect-[2/1]" : "sm:col-span-2",
                      a.tone === "brand" && "bg-brand-dark text-white",
                      a.tone === "black" && "bg-neutral-900 text-white"
                    )}
                  >
                    {image && (
                      <>
                        <Image
                          src={image.src}
                          alt={a.label}
                          fill
                          sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1279px) 33vw, 480px"
                          className={cn(
                            "object-cover",
                            image.position ?? "object-center"
                          )}
                        />
                        <div
                          className={cn(
                            "absolute inset-0",
                            a.tone === "brand" ? "bg-brand-dark/30" : "bg-black/30"
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </>
                    )}
                    <p className="font-display relative text-lg leading-tight sm:text-xl lg:text-2xl">
                      {a.label}
                    </p>
                    <p className="relative mt-1 text-sm font-bold opacity-90 lg:text-base">
                      {a.sub}
                    </p>
                  </SparkTap>
                );
              })}
            </SnapReveal>
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section id="links" className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading index={6} label="Links" heading="SNS・リンク" tone="light" />
            {/* Bentoグリッド: 先頭のYouTubeを2マス分に広げて主役にする */}
            <div className="mt-10 grid auto-rows-[minmax(0,1fr)] gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainLinks.map((l, i) => {
                const isFeature = i === 0;
                return (
                  <FadeIn
                    key={l.href}
                    delay={i * 0.06}
                    className={cn("h-full", isFeature && "sm:col-span-2")}
                  >
                    <LinkCard link={l} Icon={linkIconMap[l.icon]} feature={isFeature} />
                  </FadeIn>
                );
              })}
            </div>

            <p className="mt-12 text-xs font-bold tracking-widest text-neutral-700 uppercase lg:text-sm">
              Member Channels
            </p>
            {/* メインのSNSカードと同じ見た目・同じ折り畳み方（モバイルは横1行）で揃える */}
            <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-3">
              {memberLinks.map((l, i) => (
                <FadeIn key={l.href} delay={i * 0.06} className="h-full">
                  <LinkCard link={l} Icon={linkIconMap[l.icon]} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section
          id="contact"
          className="relative overflow-hidden scroll-mt-24 py-12 sm:py-16 lg:py-20"
        >
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading index={7} label="Contact" heading="お問い合わせ" />

            <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-6">
              <BentoCard interactive={false} tone="warm" className="h-full justify-start">
                <p className="text-xs font-bold tracking-widest text-brand-dark uppercase">
                  Before you write
                </p>
                <p className="font-display mt-3 text-xl leading-snug text-neutral-900 lg:text-2xl">
                  本サイトは非公式の
                  <br />
                  ファンサイトです
                </p>
                <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                  こちらの窓口は<strong className="font-bold text-brand-dark">当ファンサイトの運営者宛</strong>です。
                  今日ポケ本人・所属先への連絡窓口ではありません。
                </p>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                  出演依頼・スポンサーシップ・タイアップなど
                  <strong className="font-bold text-brand-dark">お仕事のご相談は、必ず公式チャンネルおよび公式SNSに記載の連絡先</strong>
                  へお願いします。当サイトから取り次ぐことはできません。
                </p>
                <a
                  href="https://www.youtube.com/@KYOUPOKE/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors duration-200 hover:text-brand-dark"
                >
                  公式チャンネルの概要欄を見る
                  <span>→</span>
                </a>
              </BentoCard>

              <BentoCard interactive={false} className="h-full">
                <ContactForm address={process.env.CONTACT_EMAIL} />
              </BentoCard>
            </div>
          </div>
        </section>
      </FadeIn>
      </main>
      <SiteFooter isHome />
      <ScrollToTop />
      <MobileCtaBar />
    </div>
    </SmoothScroll>
  );
}
