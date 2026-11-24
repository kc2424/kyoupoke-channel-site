import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchOfficialNews } from "../src/lib/news-sources";

const group = "UCmnZL4tFRl4sm-uJOxTLHmg";
const tv = "UCDqvZvUgRq5RRmy_zZd5Yaw";
const host = "UCVpaaZ-p7GTTFEDR_NCnfNg";
const prFeed = "https://prtimes.jp/companyrdf.php?company_id=50979";
const release = (id: number, company = "000050979") => `https://prtimes.jp/main/html/rd/p/${String(id).padStart(9, "0")}.${company}.html`;
function pressItem(link: string, title: string, corp = "株式会社REJECT", about = link) {
  return `<item rdf:about="${about}"><title>${title}</title><link>${link}</link><dc:corp>${corp}</dc:corp><dc:date>2026-09-01T19:00:02+09:00</dc:date></item>`;
}
function pressFeed(items: string, channel = prFeed) {
  return `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel rdf:about="${channel}"><title>株式会社REJECT</title></channel>${items}</rdf:RDF>`;
}
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
    if (url.href === prFeed) return new Response(pressFeed([
      pressItem(release(1234), "今日ポケとのイベント開催"),
      pressItem(release(1235), "別チームのリーグ戦"),
      pressItem(release(1236, "000000001"), "今日ポケとの偽のイベント"),
      pressItem(release(1237), "今日ポケとの偽のイベント", "別の発表元"),
      pressItem(release(1238), "今日ポケとの偽のイベント", "株式会社REJECT", release(1239)),
    ].join("")));
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
  assert.equal(fresh.find(a => a.slug === "reject-prtimes-1234")?.link.href, release(1234));
  assert.ok(articles.some(a => a.initialOnly && a.date === "2026-09-26"));
});

test("誤ったチャンネルのXMLを読み込まずニュースの上書きを防ぐ", async t => {
  t.mock.method(globalThis, "fetch", async (input: string) => {
    if (new URL(input).href === prFeed) return new Response(pressFeed(pressItem(release(500), "別チーム"), "https://example.org/"));
    return new Response(feed("unrelated", []));
  });
  const { articles, failedSources } = await fetchOfficialNews();
  assert.equal(articles.every(a => a.initialOnly), true);
  assert.ok(failedSources.includes("youtube-kyoupoke"));
  assert.ok(failedSources.includes("reject"));
});

test("掲載済みのWCS発表は同じスラッグを保ち、訂正後の見出しを反映する", async t => {
  const corrected = "【訂正】今日ポケの世界大会出場に関するお知らせ";
  t.mock.method(globalThis, "fetch", async (input: string) => {
    if (input === prFeed) return new Response(pressFeed(pressItem(release(634), corrected)));
    return new Response("unavailable", { status: 503 });
  });
  const { articles, failedSources } = await fetchOfficialNews();
  const result = articles.filter(a => a.slug === "reject-11250");
  assert.equal(failedSources.includes("reject"), false);
  assert.equal(result.length, 1);
  assert.equal(result[0].title, corrected);
  assert.equal(result[0].link.href, release(634));
  assert.ok(!result[0].initialOnly);
});
