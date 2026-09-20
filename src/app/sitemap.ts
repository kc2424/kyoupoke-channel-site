import type { MetadataRoute } from "next";

import { getAllNews } from "@/content/news";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/seo";
import { publicationTimestamp } from "@/lib/content-validation";

export const revalidate = 300;

function sitemapDate(value: string | undefined): Date | undefined {
  const timestamp = value ? publicationTimestamp(value) : undefined;
  return timestamp === undefined ? undefined : new Date(timestamp);
}

// SITE_INDEXABLE が false の間は空のsitemapを返す（=クロール対象を提示しない）。
// 公開時に src/lib/seo.ts のフラグを true にすれば、そのまま全URLが出力される。
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_INDEXABLE) return [];

  const abs = (path: string) => new URL(path, SITE_URL).toString();
  let news: Awaited<ReturnType<typeof getAllNews>> = [];
  try {
    news = await getAllNews();
  } catch {
    console.error("[content] sitemapのお知らせ取得失敗");
  }
  const latestNewsDate = news.reduce<string | undefined>((latest, article) => {
    const candidate = article.updatedAt ?? article.date;
    return !latest || publicationTimestamp(candidate)! > publicationTimestamp(latest)!
      ? candidate
      : latest;
  }, undefined);

  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: abs("/news"),
      lastModified: sitemapDate(latestNewsDate),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...news.map((article) => ({
      url: abs(`/news/${article.slug}`),
      lastModified: sitemapDate(article.updatedAt ?? article.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
