import assert from "node:assert/strict";
import test from "node:test";

import { videoJsonLd, newsArticleJsonLd } from "../src/lib/seo";
import { parseVideoFeed } from "../src/lib/youtube";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <entry><yt:videoId>8BfcRA0mPfg</yt:videoId><title>動画 &amp; 解説</title><published>2026-09-20T12:00:00Z</published></entry>
  <entry><yt:videoId>8BfcRA0mPfg</yt:videoId><title>重複</title><published>2026-09-20T12:00:00Z</published></entry>
  <entry><yt:videoId>invalid</yt:videoId><title>不正</title><published>2026-09-20T12:00:00Z</published></entry>
</feed>`;

test("Atomフィードを検証し、動画IDを重複排除する", () => {
  assert.deepEqual(parseVideoFeed(feed), [{
    id: 1,
    videoId: "8BfcRA0mPfg",
    title: "動画 & 解説",
    publishedAt: "2026-09-20T12:00:00Z",
  }]);
  assert.deepEqual(parseVideoFeed(feed, 0), []);
});

test("DTD、壊れたXML、巨大フィードを拒否する", () => {
  assert.throws(() => parseVideoFeed("<!DOCTYPE feed><feed />"), /invalid_video_feed/);
  assert.throws(() => parseVideoFeed("<feed><entry></feed>"), /invalid_video_feed/);
  assert.throws(() => parseVideoFeed(`<feed>${" ".repeat(1_000_001)}</feed>`), /invalid_video_feed/);
  assert.throws(() => parseVideoFeed(`<feed>${"あ".repeat(400_000)}</feed>`), /invalid_video_feed/);
});

test("公開日時のない動画はVideoObject構造化データから除外する", () => {
  const result = videoJsonLd([
    { videoId: "8BfcRA0mPfg", title: "公開日時あり", publishedAt: "2026-09-20T12:00:00Z" },
    { videoId: "c31keuiRd7E", title: "公開日時なし" },
    { videoId: "8BfcRA0mPfg", title: "重複", publishedAt: "2026-09-20T12:00:00Z" },
  ]);
  assert.equal(result.itemListElement.length, 1);
  assert.equal(result.itemListElement[0]?.item.uploadDate, "2026-09-20T12:00:00Z");
});

test("記事の更新日時をdateModifiedへ反映する", () => {
  const result = newsArticleJsonLd({
    title: "お知らせ",
    description: "概要",
    date: "2026-09-20",
    updatedAt: "2026-09-21T09:00:00+09:00",
    path: "/news/example",
  });
  assert.equal(result.datePublished, "2026-09-20");
  assert.equal(result.dateModified, "2026-09-21T09:00:00+09:00");
});
