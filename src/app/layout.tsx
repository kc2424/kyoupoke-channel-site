import type { Metadata } from "next";
import { Mochiy_Pop_One, Noto_Sans_JP, Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const mochiyPopOne = Mochiy_Pop_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "今日ポケ ファンサイト",
  description: "今日ポケ（KYOUPOKE）の非公式ファンサイト",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn(mochiyPopOne.variable, notoSansJP.variable, "font-sans", geist.variable)}>
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
