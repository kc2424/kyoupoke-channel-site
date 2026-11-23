import type { Metadata } from "next";
import { Modak } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, buildMetadata, websiteJsonLd } from "@/lib/seo";

const modak = Modak({ variable: "--font-wordmark", weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata(),
  verification: { google: "nifgD416wfIdzToYwTxhxnTzknA6dKu1ardId5AMk_g" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" className={modak.variable}>
    <body className="min-h-screen bg-white text-neutral-900 antialiased">
      <a href="#main-content" className="skip-link">本文へ移動</a>
      <JsonLd data={websiteJsonLd()} />
      {children}
    </body>
  </html>;
}
