import { type Client, isFullPage } from "@notionhq/client";

import { isPublishedBy } from "./content-validation";
import { STATS_DATA_SOURCE_ID } from "./notion";
import { CHANNEL_ID } from "./youtube";

type ChannelStats = { subscribers: number; views: number; checkedOn: string };
type SyncOptions = { dryRun?: boolean };

const metrics = [
  { key: "subscribers", label: "チャンネル登録者数", divisor: 10_000, suffix: "万人+" },
  { key: "views", label: "総再生回数", divisor: 100_000_000, suffix: "億回+" },
] as const;

function count(raw: unknown): number {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) throw new Error("invalid_youtube_statistics");
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error("invalid_youtube_statistics");
  return value;
}

export async function syncChannelStats(notion: Client, options: SyncOptions = {}) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("missing_youtube_api_key");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.search = new URLSearchParams({ id: CHANNEL_ID, part: "statistics" }).toString();
  const response = await fetch(url, {
    headers: { "X-Goog-Api-Key": apiKey },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`youtube_statistics_http_${response.status}`);
  const data = await response.json();
  const channel = data?.items?.[0];
  if (channel?.id !== CHANNEL_ID || channel.statistics?.hiddenSubscriberCount !== false) {
    throw new Error("invalid_youtube_statistics");
  }
  return saveChannelStats(notion, {
    subscribers: count(channel.statistics.subscriberCount),
    views: count(channel.statistics.viewCount),
    checkedOn: new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date()),
  }, options);
}

/** The first observation on a Japanese calendar day wins, including across retries. */
export async function saveChannelStats(notion: Client, stats: ChannelStats, { dryRun = false }: SyncOptions = {}) {
  const { checkedOn } = stats;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkedOn) || !isPublishedBy(checkedOn) ||
      !metrics.every(({ key }) => Number.isSafeInteger(stats[key]) && stats[key] > 0)) {
    throw new Error("invalid_channel_observation");
  }
  const result = await notion.dataSources.query({
    data_source_id: STATS_DATA_SOURCE_ID,
    filter: { or: metrics.map(({ label }) => ({ property: "ラベル", title: { equals: label } })) },
    page_size: 3,
  });
  const pages = result.results.filter(isFullPage);
  if (result.has_more || result.request_status?.type === "incomplete" ||
      pages.length !== result.results.length || pages.length !== metrics.length) throw new Error("ambiguous_stats_rows");

  // Validate both rows before updating either. Each page is updated atomically with its own observation date.
  const writes = metrics.flatMap(({ key, label, divisor, suffix }) => {
    const page = pages.find(({ properties }) => {
      const field = properties["ラベル"];
      return field?.type === "title" && field.title.map((text) => text.plain_text).join("") === label;
    });
    if (!page) throw new Error("ambiguous_stats_rows");
    const properties = page.properties;
    const unit = properties["接尾語"];
    const decimals = properties["小数桁"];
    const current = properties["数値"];
    const observed = properties["確認日"];
    const raw = properties["取得値"];
    if (unit?.type !== "rich_text" || unit.rich_text.map((text) => text.plain_text).join("") !== suffix ||
        decimals?.type !== "number" || decimals.number === null || !Number.isInteger(decimals.number) ||
        decimals.number < 0 || decimals.number > 6 || current?.type !== "number" ||
        observed?.type !== "date" || raw?.type !== "number") throw new Error("invalid_stats_schema");
    if (observed.date && observed.date.start >= checkedOn) return [];
    const scale = 10 ** decimals.number;
    const formatted = Math.floor(stats[key] / (divisor / scale)) / scale;
    return [{
      page_id: page.id,
      properties: {
        "数値": { number: formatted },
        "取得値": { number: stats[key] },
        "確認日": { date: { start: checkedOn } },
      },
    }];
  });

  if (!dryRun) {
    for (const write of writes) await notion.pages.update(write);
  }
  return { checkedOn, updated: writes.length };
}
