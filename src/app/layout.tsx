import type { Metadata } from "next";
import { Mochiy_Pop_One, Modak, Noto_Sans_JP, Zen_Kaku_Gothic_New, Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { GrainOverlay } from "@/components/grain-overlay";
import { IntroLoader } from "@/components/intro-loader";
import { NavTransition } from "@/components/nav-transition";
import { SmoothScroll } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const mochiyPopOne = Mochiy_Pop_One({
  variable: "--font-logo",
  weight: "400",
  subsets: ["latin"],
});

const modak = Modak({
  variable: "--font-wordmark",
  weight: "400",
  subsets: ["latin"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-display",
  weight: ["700", "900"],
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kyoupoke-channel-site.vercel.app"),
  title: {
    default: "今日ポケ 非公式ファンサイト | KYOUPOKE",
    template: "%s | 今日ポケ 非公式ファンサイト",
  },
  description:
    "ポケモン対戦YouTubeチャンネル「今日ポケ」の非公式ファンサイト。メンバー紹介（バンビー・いろは・くろこ）、YouTube受賞実績、メディア出演情報を掲載！",
  keywords: [
    "今日ポケ",
    "KYOUPOKE",
    "バンビー",
    "いろは",
    "くろこ",
    "ポケモン",
    "ファンサイト",
  ],
  authors: [{ name: "今日ポケ ファン" }],
  openGraph: {
    title: "今日ポケ 非公式ファンサイト | KYOUPOKE",
    description:
      "ポケモン対戦YouTubeチャンネル「今日ポケ」の非公式ファンサイト。メンバー紹介（バンビー・いろは・くろこ）、YouTube受賞実績などを掲載！",
    url: "https://kyoupoke-channel-site.vercel.app",
    siteName: "今日ポケ 非公式ファンサイト",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/hero-mascots.png",
        width: 1200,
        height: 630,
        alt: "今日ポケ マスコットキャラクター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "今日ポケ 非公式ファンサイト | KYOUPOKE",
    description:
      "ポケモン対戦YouTubeチャンネル「今日ポケ」の非公式ファンサイト。メンバー紹介、最新情報、動画実績を掲載中！",
    images: ["/hero-mascots.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={cn(
        mochiyPopOne.variable,
        modak.variable,
        zenKakuGothicNew.variable,
        notoSansJP.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        <IntroLoader />
        <CustomCursor />
        <GrainOverlay />
        <NavTransition />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
