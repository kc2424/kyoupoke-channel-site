import type { MetadataRoute } from "next";

import { getAllNews } from "@/content/news";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/seo";

// SITE_INDEXABLE が false の間は空のsitemapを返す（=クロール対象を提示しない）。
// 公開時に src/lib/seo.ts のフラグを true にすれば、そのまま全URLが出力される。
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_INDEXABLE) return [];

  const abs = (path: string) => new URL(path, SITE_URL).toString();
  const news = getAllNews();
  const latestNewsDate = news[0]?.date;

  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: abs("/news"),
      lastModified: latestNewsDate ? new Date(latestNewsDate) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...news.map((article) => ({
      url: abs(`/news/${article.slug}`),
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
