import type { Metadata } from "next";

/**
 * このサイトを検索エンジンにインデックスさせるかどうかの唯一のスイッチ。
 *
 * 今日ポケch.運営から公認ファンサイトとして公開の許諾を得たため `true`（= index, follow）。
 * 以下がまとめて有効になっている:
 *   - <meta name="robots"> が index, follow になる（layout.tsx）
 *   - /sitemap.xml が全URLを出力する（app/sitemap.ts）
 *   - /robots.txt が Allow: / と sitemap 参照を出力する（app/robots.ts）
 * OGP・Twitter Card・JSON-LD構造化データはフラグに関係なく常に出力しているので、
 * SNSでURLを共有したときのカード表示は現時点でも正しく機能する。
 */
export const SITE_INDEXABLE = true;

/**
 * 本番URL。独自ドメイン取得後はここを差し替える。
 * OGPの画像URLやcanonical、sitemapの絶対URL生成に使う。
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kyoupoke-channel-site.vercel.app";

export const SITE_NAME = "今日ポケ ファンサイト";
export const SITE_DESCRIPTION =
  "ポケモン対戦YouTuberグループ「今日ポケ（KYOUPOKE）」の非公式ファンサイト。メンバー紹介、最新動画、SNSリンク、お知らせをまとめています。";

/** YouTubeチャンネルの情報。構造化データとリンクの一次情報。 */
export const CHANNEL = {
  name: "今日ポケ",
  url: "https://www.youtube.com/@KYOUPOKE",
  id: "UCmnZL4tFRl4sm-uJOxTLHmg",
} as const;

export const SOCIAL_URLS = [
  CHANNEL.url,
  "https://x.com/KYOUPOKEch",
  "https://www.instagram.com/kyoupokeexpress",
  "https://www.tiktok.com/@kyoupoke",
] as const;

/** OGP画像。1200x630相当の実画像に差し替えられるよう1か所にまとめる。 */
const OG_IMAGE = "/hero-members.jpg";

export const robotsMeta: Metadata["robots"] = SITE_INDEXABLE
  ? { index: true, follow: true }
  : { index: false, follow: false };

/**
 * 各ページのMetadataを組み立てる。OGPとTwitter Cardは常に付与する。
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  type = "website",
  publishedTime,
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = new URL(path, SITE_URL).toString();

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: robotsMeta,
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      locale: "ja_JP",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** サイト全体（WebSite + ファンサイトが扱う対象チャンネル）の構造化データ。 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "ja",
    about: {
      "@type": "Organization",
      name: CHANNEL.name,
      url: CHANNEL.url,
      sameAs: [...SOCIAL_URLS],
    },
  };
}

/**
 * YouTube動画の構造化データ（VideoObject）。
 * サムネイルとページURLはvideoIdから導出する。
 */
export function videoJsonLd(
  videos: { videoId: string; title: string; publishedAt?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "今日ポケの動画",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        thumbnailUrl: [`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`],
        embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
        // uploadDateはVideoObjectの必須項目。RSSから取れた動画のみ付与する。
        ...(v.publishedAt ? { uploadDate: v.publishedAt } : {}),
        publisher: {
          "@type": "Organization",
          name: CHANNEL.name,
          url: CHANNEL.url,
        },
      },
    })),
  };
}

/** お知らせ詳細ページの構造化データ（NewsArticle）。 */
export function newsArticleJsonLd({
  title,
  description,
  date,
  path,
}: {
  title: string;
  description: string;
  date: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: "ja",
    mainEntityOfPage: new URL(path, SITE_URL).toString(),
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** パンくずリストの構造化データ。 */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}
