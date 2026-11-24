import { XMLParser, XMLValidator } from "fast-xml-parser";
import { cache } from "react";
import { isPublishedBy, validVideoId } from "@/lib/content-validation";

export const CHANNEL_ID = "UCmnZL4tFRl4sm-uJOxTLHmg";
const MAX_FEED_BYTES = 1_000_000;

export type LatestVideo = {
  id: number;
  videoId: string;
  title: string;
  /** ISO8601の公開日時。VideoObject構造化データのuploadDateに使う。 */
  publishedAt?: string;
};

/** AtomをXMLとして解析。壊れたフィード・DTDは受け入れない。 */
export function parseChannelVideos(xml: string, channelId?: string) {
  if (new TextEncoder().encode(xml).byteLength > MAX_FEED_BYTES ||
      /<!DOCTYPE/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error("invalid_video_feed");
  }
  const parsed = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false,
    trimValues: true,
    processEntities: true,
    isArray: (name) => name === "entry",
  }).parse(xml);
  if (!parsed?.feed || typeof parsed.feed !== "object") throw new Error("invalid_video_feed");
  if (channelId && parsed.feed.author?.uri !== `https://www.youtube.com/channel/${channelId}`) {
    throw new Error("wrong_video_channel");
  }
  const entries: unknown[] = parsed.feed.entry ?? [];
  if (!Array.isArray(entries)) throw new Error("invalid_video_feed");
  const seen = new Set<string>();
  const videos: { videoId: string; title: string; publishedAt: string; description: string }[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const fields = entry as Record<string, unknown>;
    if (channelId && fields["yt:channelId"] !== channelId) continue;
    const videoId = fields["yt:videoId"];
    const title = fields.title;
    const publishedAt = fields.published;
    if (typeof videoId !== "string" || !validVideoId(videoId) || seen.has(videoId) ||
        typeof title !== "string" || !title.trim() || typeof publishedAt !== "string" ||
        !publishedAt.includes("T") || !isPublishedBy(publishedAt)) continue;
    seen.add(videoId);
    const group = fields["media:group"] as Record<string, unknown> | undefined;
    const description = group?.["media:description"];
    videos.push({ videoId, title, publishedAt, description: typeof description === "string" ? description : "" });
  }
  return videos;
}

export function parseVideoFeed(xml: string, limit = 3): LatestVideo[] {
  return parseChannelVideos(xml)
    .slice(0, Number.isInteger(limit) ? Math.max(0, Math.min(limit, 15)) : 3)
    .map(({ videoId, title, publishedAt }, index) => ({ id: index + 1, videoId, title, publishedAt }));
}

/** 外部フィードはストリームを読みながら実バイト数を制限する。 */
export async function readFeedText(response: Response) {
  if (!response.ok || !response.body) throw new Error("request_failed");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_FEED_BYTES) {
        await reader.cancel();
        throw new Error("feed_too_large");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return text;
}

/** 公開RSSを取得。障害は安全に記録し、最新動画セクションを省略する。 */
export const fetchLatestVideos = cache(async (limit = 3): Promise<LatestVideo[] | null> => {
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    const xml = await readFeedText(response);
    return parseVideoFeed(xml, limit);
  } catch {
    console.warn("[content] YouTube RSS取得失敗", { reason: controller.signal.aborted ? "timeout" : "request_failed" });
    return null;
  } finally {
    clearTimeout(deadline);
  }
});
