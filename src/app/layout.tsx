import type { Metadata } from "next";
import { Mochiy_Pop_One, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

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
    <html lang="ja" className={`${mochiyPopOne.variable} ${notoSansJP.variable}`}>
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
