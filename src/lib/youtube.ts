const CHANNEL_ID = "UCmnZL4tFRl4sm-uJOxTLHmg";

export type LatestVideo = {
  id: number;
  videoId: string;
  title: string;
  /** ISO8601の公開日時。VideoObject構造化データのuploadDateに使う。 */
  publishedAt?: string;
};

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// YouTubeの公開RSSフィードから最新動画を取得する（APIキー不要）。
// 取得に失敗した場合は null を返し、呼び出し側でセクションごと非表示にする。
export async function fetchLatestVideos(limit = 3): Promise<LatestVideo[] | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;

    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, limit);

    const videos = entries.map((match, index) => {
      const block = match[1];
      const videoId = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
      const rawTitle = block.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const publishedAt = block.match(/<published>(.*?)<\/published>/)?.[1];
      return {
        id: index + 1,
        videoId,
        title: decodeXmlEntities(rawTitle),
        publishedAt,
      };
    });

    return videos.filter((v) => v.videoId) as LatestVideo[];
  } catch {
    return null;
  }
}
