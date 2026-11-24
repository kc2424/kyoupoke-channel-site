import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchOfficialNews } from "../src/lib/news-sources";

const group = "UCmnZL4tFRl4sm-uJOxTLHmg";
const tv = "UCDqvZvUgRq5RRmy_zZd5Yaw";
const host = "UCVpaaZ-p7GTTFEDR_NCnfNg";
function feed(channel: string, entries: { id: string; title: string; description?: string; channel?: string }[]) {
  return `<feed xmlns:yt="yt" xmlns:media="media"><author><uri>https://www.youtube.com/channel/${channel}</uri></author>${entries.map(e =>
    `<entry><yt:channelId>${e.channel ?? channel}</yt:channelId><yt:videoId>${e.id}</yt:videoId><published>2026-09-01T18:00:00Z</published><title>${e.title}</title><media:group><media:description>${e.description ?? ""}</media:description></media:group></entry>`).join("")}</feed>`;
}

test("固定した発表元の新着を選別し、失敗した取得元だけを報告する", async t => {
  t.mock.method(globalThis, "fetch", async (input: string) => {
    const url = new URL(input);
    const id = url.searchParams.get("channel_id");
    if (id === group) return new Response(feed(group, [
      { id: "mk000000001", title: "普段のポケモン実況", description: "以前の大会でいろはが優勝" },
      { id: "mk000000002", title: "登録者80万人を突破するまで終われません" },
      { id: "mk000000003", title: "チャンネル登録者数80万人突破！" },
      { id: "mk000000004", title: "チャンネル登録者数90万人突破！", channel: tv },
    ]));
    if (id === tv) return new Response(feed(tv, [
      { id: "mk000000005", title: "いろは【タカトシぃぃeeeee】", description: "いろは先生と対戦！ポケモンチャンピオンズ第31弾" },
      { id: "mk000000007", title: "「ポケモン対戦のいろはを学ぶ」【タカトシぃぃeeeee】", description: "ポケモンチャンピオンズ第32弾" },
      { id: "mk000000006", title: "新作ゲームで勝負", description: "過去にいろはも出演" },
    ]));
    if (id === host) return new Response("unavailable", { status: 503 });
    if (url.hostname === "reject.jp") return Response.json([
      { id: 1234, date_gmt: "2026-09-01T00:00:00", link: "https://reject.jp/2026/09/01/event/", title: { rendered: "今日ポケとのイベント開催" } },
      { id: 1235, date_gmt: "2026-09-01T00:00:00", link: "https://reject.jp/2026/09/01/test/", title: { rendered: "別チームのリーグ戦" } },
    ]);
    throw new Error("unknown source");
  });
  const before = process.env.X_BEARER_TOKEN;
  delete process.env.X_BEARER_TOKEN;
  t.after(() => { if (before !== undefined) process.env.X_BEARER_TOKEN = before; });
  const { articles, failedSources } = await fetchOfficialNews();
  assert.deepEqual(failedSources, ["youtube-seidan"]);
  const fresh = articles.filter(a => !a.initialOnly);
  assert.equal(fresh.length, 3);
  assert.equal(fresh.find(a => a.title.includes("80万人"))?.date, "2026-09-02");
  assert.equal(fresh.find(a => a.title.includes("31弾"))?.link.href, "https://www.youtube.com/watch?v=mk000000005");
  assert.ok(fresh.some(a => a.slug === "reject-1234"));
  assert.ok(articles.some(a => a.initialOnly && a.date === "2026-09-26"));
});

test("誤ったチャンネルのXMLを読み込まずニュースの上書きを防ぐ", async t => {
  t.mock.method(globalThis, "fetch", async (input: string) => {
    if (new URL(input).hostname === "reject.jp") return Response.json([]);
    return new Response(feed("unrelated", []));
  });
  const { articles, failedSources } = await fetchOfficialNews();
  assert.equal(articles.every(a => a.initialOnly), true);
  assert.ok(failedSources.includes("youtube-kyoupoke"));
});
