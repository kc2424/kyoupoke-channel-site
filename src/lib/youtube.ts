import { XMLParser, XMLValidator } from "fast-xml-parser";
import { cache } from "react";
import { isPublishedBy, validVideoId } from "@/lib/content-validation";

const CHANNEL_ID = "UCmnZL4tFRl4sm-uJOxTLHmg";
const MAX_FEED_BYTES = 1_000_000;

export type LatestVideo = {
  id: number;
  videoId: string;
  title: string;
  /** ISO8601の公開日時。VideoObject構造化データのuploadDateに使う。 */
  publishedAt?: string;
};

/** AtomをXMLとして解析。壊れたフィード・DTDは受け入れない。 */
export function parseVideoFeed(xml: string, limit = 3): LatestVideo[] {
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
  const entries: unknown[] = parsed.feed.entry ?? [];
  if (!Array.isArray(entries)) throw new Error("invalid_video_feed");
  const seen = new Set<string>();
  const videos: LatestVideo[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const fields = entry as Record<string, unknown>;
    const videoId = fields["yt:videoId"];
    const title = fields.title;
    const publishedAt = fields.published;
    if (typeof videoId !== "string" || !validVideoId(videoId) || seen.has(videoId) ||
        typeof title !== "string" || !title.trim() || typeof publishedAt !== "string" ||
        !publishedAt.includes("T") || !isPublishedBy(publishedAt)) continue;
    seen.add(videoId);
    videos.push({ id: videos.length + 1, videoId, title, publishedAt });
  }
  return videos.slice(0, Number.isInteger(limit) ? Math.max(0, Math.min(limit, 15)) : 3);
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
    if (!response.ok || !response.body) throw new Error("request_failed");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let xml = "";
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
        xml += decoder.decode(value, { stream: true });
      }
      xml += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    return parseVideoFeed(xml, limit);
  } catch {
    console.warn("[content] YouTube RSS取得失敗", { reason: controller.signal.aborted ? "timeout" : "request_failed" });
    return null;
  } finally {
    clearTimeout(deadline);
  }
});
