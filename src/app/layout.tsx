import type { Metadata } from "next";
import { Mochiy_Pop_One, Modak, Noto_Sans_JP, Zen_Kaku_Gothic_New, Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { GrainOverlay } from "@/components/grain-overlay";
import { IntroLoader } from "@/components/intro-loader";
import { NavTransition } from "@/components/nav-transition";
import { SmoothScroll } from "@/components/smooth-scroll";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, buildMetadata, websiteJsonLd } from "@/lib/seo";
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

// メタ情報は src/lib/seo.ts に一本化している。
// robotsのnoindexも同ファイルの SITE_INDEXABLE フラグで一括制御する。
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata(),
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
        <JsonLd data={websiteJsonLd()} />
        <IntroLoader />
        <CustomCursor />
        <GrainOverlay />
        <NavTransition />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
