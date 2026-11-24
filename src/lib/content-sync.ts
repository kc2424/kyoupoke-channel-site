import { Client } from "@notionhq/client";
import { fetchOfficialNews } from "./news-sources";
import { syncNews } from "./sync-news";
import { syncChannelStats } from "./sync-stats";

async function updateStats(notion: Client, dryRun: boolean) {
  if (!process.env.YOUTUBE_API_KEY) return { status: "not_configured" } as const;
  try {
    return { status: "ok", ...await syncChannelStats(notion, { dryRun }) } as const;
  } catch {
    return { status: "failed" } as const;
  }
}

async function updateNews(notion: Client, dryRun: boolean) {
  try {
    const { articles, failedSources } = await fetchOfficialNews();
    const counts = await syncNews(notion, articles, { dryRun });
    return { status: failedSources.length ? "partial" : "ok", ...counts, failedSources } as const;
  } catch {
    return { status: "failed" } as const;
  }
}

/** Only counts and source names leave this module. Provider errors can contain request details. */
export async function syncContent({ dryRun = false } = {}) {
  if (!process.env.NOTION_TOKEN) throw new Error("notion_not_configured");
  const notion = new Client({ auth: process.env.NOTION_TOKEN, timeoutMs: 8000, logger: () => {} });
  const stats = await updateStats(notion, dryRun);
  const news = await updateNews(notion, dryRun);
  return { stats, news };
}

/** A missing statistics key leaves the installation in news-only mode. */
export function syncSucceeded(report: Awaited<ReturnType<typeof syncContent>>) {
  return report.news.status === "ok" && report.stats.status !== "failed";
}
