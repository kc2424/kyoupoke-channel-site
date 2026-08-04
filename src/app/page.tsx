import { BlueprintCorners } from "@/components/blueprint-corners";
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
import { HeroPhoto } from "@/components/hero-photo";
import { HeroStickers } from "@/components/hero-stickers";
import { LogoMark } from "@/components/logo-mark";
import { MemberCard } from "@/components/member-card";
import { OpArtRings } from "@/components/op-art-rings";
import { ParallaxImage } from "@/components/parallax-image";
import { PopReveal } from "@/components/pop-reveal";
import { RevealText } from "@/components/reveal-text";
import { SectionBlend } from "@/components/section-blend";
import { SectionHeading } from "@/components/section-heading";
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
import Image from "next/image";

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

const navItems = [
  { label: "プロフィール", href: "#profile" },
  { label: "メンバー", href: "#members" },
  { label: "実績", href: "#achievements" },
  { label: "動画", href: "#videos" },
  { label: "リンク", href: "#links" },
];

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
  { value: 67.3, decimals: 1, suffix: "万人+", label: "チャンネル登録者数" },
  { value: 12.5, decimals: 1, suffix: "億回+", label: "総再生回数" },
  { value: 10, decimals: 0, suffix: "万人", label: "銀の盾を達成（2022年）" },
];

const fallbackAchievements = [
  { label: "YouTube Creator Awards", sub: "銀の盾（登録者10万人）", tone: "brand" as const },
  { label: "テレビ東京「バトオフ」", sub: "公式番組へ出演", tone: "black" as const },
  { label: "PJCS / WCS 2年連続出場", sub: "いろは選手が出場権獲得", tone: "brand" as const },
  { label: "KYOUPOKE GYM", sub: "対戦イベントを開催", tone: "brand" as const },
];

// 実績の見出しに一致する場合、カード背景に写真を敷く。
const achievementImages: Record<string, string> = {
  "YouTube Creator Awards": "/achievements/youtube-award.jpg",
  "テレビ東京「バトオフ」": "/achievements/tv-tokyo-battle-of.jpg",
  "PJCS / WCS 2年連続出場": "/achievements/wcs-logo.png",
  "KYOUPOKE GYM": "/achievements/kyoupoke-gym.jpg",
};

const fallbackVideos = [
  { id: 1, videoId: "8BfcRA0mPfg", title: "【旅パで本気バトル】ポケモンSVをはじめから遊んで60分後に即対戦！" },
  { id: 2, videoId: "c31keuiRd7E", title: "【最終日合宿】「最終1位チャレンジしてきます。」ポケモン対戦に本気で挑む大人達のリアルに密着" },
  { id: 3, videoId: "V3svBZv4ykk", title: "【4世代vs5世代vs9世代】ポ ケ モ ン 最 強 世 代 決 定 戦 -グランドファイナル-" },
];

const fallbackMainLinks = [
  { label: "YouTube", sub: "本チャンネル", href: "https://www.youtube.com/@KYOUPOKE", icon: "YouTube" as const },
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
    "「今日ポケ」は2021年8月8日に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする3人組YouTuberグループです。バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。",
  about_paragraph2:
    "2022年にはチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞。現在はチャンネル登録者数 約67万人、総再生回数は12億回を超える規模まで成長しています。",
};

// おすすめ動画・最新動画で共通のカード表示。
function VideoCard({ video, index, labelPrefix }: { video: { videoId: string; title: string }; index: number; labelPrefix: string }) {
  return (
    <TiltCard>
      <Card className="group/mono overflow-hidden p-0 shadow-sm" data-cursor-label="WATCH">
        <VideoModal videoId={video.videoId} title={`${labelPrefix}${index + 1}`}>
          <div className="relative aspect-video">
            <Image
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title}
              fill
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
          <span className="font-display text-lg text-brand lg:text-xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="line-clamp-2 text-sm text-neutral-600 lg:text-base">{video.title}</p>
        </CardContent>
      </Card>
    </TiltCard>
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
  ] = await Promise.all([
    fetchPublishedMembers("メインメンバー"),
    fetchPublishedMembers("スタッフ"),
    fetchStats(),
    fetchAchievements(),
    fetchVideos(),
    fetchLinks(),
    fetchSiteTexts(),
    fetchLatestVideos(3),
  ]);

  const members =
    notionMembers && notionMembers.length > 0 ? notionMembers : fallbackMembers;
  const staff =
    notionStaff && notionStaff.length > 0 ? notionStaff : staffMembers;
  const stats = notionStats && notionStats.length > 0 ? notionStats : fallbackStats;
  const achievements =
    notionAchievements && notionAchievements.length > 0
      ? notionAchievements
      : fallbackAchievements;
  const videos = notionVideos && notionVideos.length > 0 ? notionVideos : fallbackVideos;
  const mainLinks =
    notionLinks && notionLinks.mainLinks.length > 0
      ? notionLinks.mainLinks
      : fallbackMainLinks;
  const memberLinks =
    notionLinks && notionLinks.memberLinks.length > 0
      ? notionLinks.memberLinks
      : fallbackMemberLinks;
  const texts = { ...fallbackTexts, ...notionTexts };

  return (
    // overflow-x-clip: LiveGlowFrame の回転するグロー枠が回転位相によって
    // 数px はみ出し、モバイルで横スクロールが出るのを止める。
    // clip は hidden と違いスクロールコンテナを作らないので sticky は効いたまま。
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <SiteHeader navItems={navItems} />

      <main>
      <section className="relative flex flex-col items-center overflow-hidden bg-[radial-gradient(130%_90%_at_20%_0%,#fff3d6_0%,#ffd9ae_45%,#ffffff_88%)] px-6 pt-8 pb-10 sm:bg-none sm:bg-white sm:min-h-[100svh] sm:px-10 sm:pt-0 sm:pb-0 lg:px-16">
        {/*
          モバイル: テキストを先に、写真をその下に配置（写真は本来の縦横比の
          ままフローに乗せて実サイズ表示）。ヒーロー全体には写真の色味に合わせた
          暖色グラデーションを敷き、テキスト部分にも写真の世界観を続ける。
          sm以上: 従来通りセクション全体に写真を敷き、テキストは腰〜胴体に重ねる。
        */}
        <span className="pointer-events-none absolute top-1/2 left-4 hidden -translate-y-1/2 -rotate-90 text-xs font-bold tracking-widest text-neutral-600 uppercase sm:block lg:text-sm">
          Unofficial Fan Site
        </span>
        <span className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rotate-90 text-xs font-bold tracking-widest text-neutral-600 uppercase sm:block lg:text-sm">
          YouTube → World
        </span>

        <div className="relative order-1 mb-6 flex flex-col items-center sm:order-none sm:mt-auto sm:mb-0 sm:pb-[8vh] lg:pb-[10vh]">
          {/* 腰〜胴体あたりのみ白ぼかしで視認性を確保（顔には掛からない）。sm以上（写真に重なる場合）のみ有効 */}
          <div className="pointer-events-none absolute inset-x-[-10vw] top-1/2 hidden h-[130%] -translate-y-1/2 bg-white/70 blur-3xl sm:block" />

          <FadeIn y={12}>
            <a
              href="#videos"
              data-cursor-label="VIEW"
              className="group relative mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-wide text-neutral-700 backdrop-blur-sm transition-colors duration-300 hover:border-brand hover:text-brand lg:text-sm"
            >
              <span className="text-brand">New</span>
              最新動画を公開中
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
          </FadeIn>

          <GiantTitle>KYOU POKE</GiantTitle>

          <FadeIn delay={0.3} y={12}>
            <p className="relative mt-6 max-w-md text-center text-sm whitespace-pre-line text-neutral-600 sm:max-w-lg sm:text-base lg:max-w-xl lg:text-lg">
              {texts.hero_tagline.includes("届ける")
                ? texts.hero_tagline.split(/(?<=届ける)/).map((chunk, i) => (
                    <span key={i}>
                      {chunk}
                      {i === 0 && <br />}
                    </span>
                  ))
                : texts.hero_tagline}
            </p>
          </FadeIn>
        </div>

        <div className="relative order-2 w-full overflow-hidden aspect-[1601/1101] sm:order-none sm:absolute sm:inset-0 sm:aspect-auto sm:overflow-visible">
          <HeroPhoto src="/hero-members.jpg" alt="今日ポケ メンバー3人" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <HeroStickers />
        </div>

        <div className="pointer-events-none relative order-3 mt-6 flex flex-col items-center gap-2 text-neutral-600 sm:order-none sm:absolute sm:bottom-8 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2">
          <span className="text-[10px] font-bold tracking-widest uppercase lg:text-xs">
            Scroll
          </span>
          <span className="h-8 w-px animate-pulse bg-neutral-400" />
        </div>
      </section>

      <FadeIn>
        <section className="bg-white pt-16 pb-10 lg:pt-20">
          <div className={CONTAINER}>
            <div className="border-t border-neutral-200 pt-4 text-xs font-bold tracking-widest text-neutral-600 uppercase lg:text-sm">
              Featured
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="border-y border-neutral-200 bg-white py-24 lg:py-32">
          <div className={cn(CONTAINER, "flex flex-col items-start gap-1 lg:gap-2")}>
            <RevealText
              as="p"
              text={texts.catchcopy_line1}
              className="font-display text-4xl leading-[1.05] text-neutral-900 sm:text-6xl lg:text-8xl"
            />
            <RevealText
              as="p"
              text={texts.catchcopy_line2}
              className="font-display text-4xl leading-[1.05] text-brand sm:text-6xl lg:self-center lg:text-8xl"
            />
            <RevealText
              as="p"
              text={texts.catchcopy_line3}
              className="font-display text-4xl leading-[1.05] text-neutral-900 sm:text-6xl lg:self-end lg:text-8xl"
            />
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-white pb-24 lg:pb-32">
          <div className={CONTAINER}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
              <p className="font-display text-2xl text-brand lg:text-3xl">Meet the Members</p>
            </div>
            <PopReveal className="mt-6 rounded-2xl">
              <div className="relative">
                <ParallaxImage
                  wrapperClassName="h-[220px] w-full rounded-2xl bg-[#df5330] sm:h-[340px] lg:h-[500px]"
                  className="object-cover"
                  src="/hero-mascots.png"
                  alt="今日ポケ マスコットイラスト"
                  fill
                  priority
                />
                <BlueprintCorners tone="light" label="FIG.01 — MASCOTS" />
              </div>
            </PopReveal>
          </div>
        </section>
      </FadeIn>

        <FadeIn>
          <section id="profile" className="scroll-mt-24 pb-24 lg:pb-32">
            <div className={CONTAINER}>
              {/* 見出しを左列に固定し、本文は右列でコンテナ右端まで広げる。 */}
              <div className="lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
                <SectionHeading
                  index={1}
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
                      「今日ポケ」は<span className="text-brand font-bold">2021年8月8日</span>に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする
                      <span className="text-brand font-bold">3人組</span>YouTuberグループです。
                      バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。
                    </p>
                  )}
                  {notionTexts?.about_paragraph2 ? (
                    <p className="mt-4 leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                      {texts.about_paragraph2}
                    </p>
                  ) : (
                    <p className="mt-4 leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                      2022年にはチャンネル登録者数<span className="text-brand font-bold">10万人</span>を達成し、YouTube Creator Awardsの銀の盾を受賞。
                      現在はチャンネル登録者数 約<span className="text-brand font-bold">67万人</span>、総再生回数は<span className="text-brand font-bold">12億回</span>を超える規模まで成長しています。
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {[
                  { href: "#members", label: "メンバー紹介", desc: "バンビー・いろは・くろこ、3人それぞれの実績と人柄。" },
                  { href: "#achievements", label: "実績・出演", desc: "登録者数や再生回数、受賞歴をまとめて紹介。" },
                  { href: "#videos", label: "おすすめ動画", desc: "まずはここから見てほしいおすすめの3本。" },
                  { href: "#links", label: "リンク", desc: "SNSやショップ、メンバー個人チャンネルへ。" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    data-cursor-label="VIEW"
                    className="group flex flex-col justify-between gap-6 rounded-2xl border border-neutral-200 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-lg lg:p-6"
                  >
                    <div>
                      <p className="font-display text-lg text-neutral-900 group-hover:text-brand lg:text-xl">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600 lg:text-base">{item.desc}</p>
                    </div>
                    <span className="text-xs font-bold tracking-widest text-neutral-600 uppercase transition-colors group-hover:text-brand">
                      View →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <section id="members" className="scroll-mt-24 pb-24 lg:pb-32">
          <div className={CONTAINER}>
            <SectionHeading
              index={2}
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

      <SectionBlend from="#ffffff" to="#000000" />

      <FadeIn>
        <section
          id="achievements"
          className="relative scroll-mt-24 overflow-hidden bg-black py-24 lg:py-32"
        >
          {/* カード群(実カード背景は不透明)と重ならないよう、見出し行の高さに合わせて右上に配置する */}
          <OpArtRings className="top-0 right-0 h-[220px] w-[220px] -translate-y-1/4 translate-x-1/3 sm:h-[320px] sm:w-[320px] lg:h-[420px] lg:w-[420px]" />
          <div className={cn(CONTAINER, "relative z-10")}>
            <SectionHeading index={3} label="Recognition" heading="実績・出演" tone="dark" />
            <StatSpotlight
              stats={stats}
              className="mt-10 border-y border-white/10 py-8 lg:py-10"
            />
            <SnapReveal className="mt-10 grid gap-3 sm:grid-cols-3 lg:gap-5">
              {achievements.map((a) => {
                const image = achievementImages[a.label];
                return (
                  <SparkTap
                    key={a.label}
                    className={cn(
                      "flex aspect-[4/3] cursor-pointer flex-col justify-end rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-1 hover:shadow-lg lg:p-7",
                      // 白文字を載せるオレンジは brand-dark(#b8431f)。brand(#d9552e)だと
                      // 白文字とのコントラストが3.97しか出ずAA基準(4.5)を満たさない。
                      a.tone === "brand" && "bg-brand-dark text-white",
                      a.tone === "black" && "bg-white/10 text-white"
                    )}
                  >
                    {image && (
                      <>
                        <Image
                          src={image}
                          alt={a.label}
                          fill
                          className="object-cover object-center"
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

      <SectionBlend from="#000000" to="#ffffff" />

        <section id="videos" className="scroll-mt-24 py-24 lg:py-32">
          <div className={CONTAINER}>
          <SectionHeading index={4} label="Videos" heading="おすすめ動画" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-8">
            {videos.map((v, i) => (
              <FadeIn key={v.id} delay={i * 0.1}>
                <VideoCard video={v} index={i} labelPrefix="おすすめ動画" />
              </FadeIn>
            ))}
          </div>

          {latestVideos && latestVideos.length > 0 && (
            <>
              <p className="mt-16 text-xs font-bold tracking-widest text-neutral-600 uppercase lg:text-sm">
                Latest
              </p>
              <h3 className="font-display mt-2 text-2xl text-neutral-900 lg:text-3xl">最新動画</h3>
              <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-8">
                {latestVideos.map((v, i) => (
                  <FadeIn key={v.videoId} delay={i * 0.1}>
                    <VideoCard video={v} index={i} labelPrefix="最新動画" />
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          <WipeLink
            href="https://www.youtube.com/@KYOUPOKE"
            cursorLabel="OPEN"
            className="mt-10 lg:px-8 lg:py-4 lg:text-base"
          >
            チャンネルの動画をもっと見る
          </WipeLink>
          </div>
        </section>

      <SectionBlend from="#ffffff" to="#b8431f" />

      <FadeIn>
        {/* 白文字を載せるためオレンジは brand-dark(#b8431f)。brand(#d9552e)では
            白文字とのコントラストが3.97でAA基準(4.5)に届かない。 */}
        <section id="links" className="scroll-mt-24 bg-brand-dark py-24 lg:py-32">
          <div className={CONTAINER}>
            <SectionHeading index={5} label="Links" heading="リンク" tone="brand" />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mainLinks.map((l) => {
                const Icon = linkIconMap[l.icon];
                return (
                  <WipeLink
                    key={l.href}
                    href={l.href}
                    wipeColor="bg-black"
                    cursorLabel="OPEN"
                    className="w-full justify-start gap-4 rounded-2xl border-white/30 px-5 py-4 text-left text-white transition-transform duration-300 hover:-translate-y-1 lg:px-6 lg:py-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 lg:h-12 lg:w-12">
                      <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-bold lg:text-lg">{l.label}</span>
                      <span className="text-xs text-white/90 lg:text-sm">{l.sub}</span>
                    </span>
                  </WipeLink>
                );
              })}
            </div>

            <p className="mt-10 text-xs font-bold tracking-widest text-white uppercase lg:text-sm">
              Member Channels
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {memberLinks.map((l) => {
                const Icon = linkIconMap[l.icon];
                return (
                  <WipeLink
                    key={l.href}
                    href={l.href}
                    wipeColor="bg-black"
                    cursorLabel="OPEN"
                    className="w-full justify-start gap-4 rounded-2xl border-white/30 px-5 py-4 text-left text-white transition-transform duration-300 hover:-translate-y-1 lg:px-6 lg:py-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 lg:h-12 lg:w-12">
                      <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-bold lg:text-lg">{l.label}</span>
                      <span className="text-xs text-white/90 lg:text-sm">{l.sub}</span>
                    </span>
                  </WipeLink>
                );
              })}
            </div>
          </div>
        </section>
      </FadeIn>
      </main>

      <SectionBlend from="#b8431f" to="#000000" />

      <footer className="relative overflow-hidden bg-black py-24">
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

        <p className={cn(CONTAINER, "relative mt-12 text-center text-sm text-white/70 lg:text-base")}>
          このページは非公式のファンサイトです。今日ポケの活動を応援しています。
        </p>
      </footer>
    </div>
  );
}
