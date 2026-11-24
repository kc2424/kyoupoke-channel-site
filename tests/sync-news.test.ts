import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@notionhq/client";
import { syncNews, type NewsSourceArticle } from "../src/lib/sync-news";

const article: NewsSourceArticle = {
  slug: "channel-event", date: "2020-01-02", category: "イベント", title: "大会の告知",
  summary: "大会の概要", body: ["会場は東京です。"], link: { href: "https://www.youtube.com/watch?v=8BfcRA0mPfg", label: "公式動画" },
};

type MockProperty = {
  type: string; rich_text?: { plain_text: string }[]; checkbox?: boolean; url?: string;
};
function notionFixture() {
  const rows: { id: string; object: string; url: string; created_time: string; created_by: { id: string }; last_edited_by: { id: string }; properties: Record<string, MockProperty> }[] = [];
  let writes = 0;
  let failUpdate = false;
  const client = new Client({ logger: () => {}, retry: false, fetch: async (input, options) => {
    const path = new URL(input.toString()).pathname;
    if (path.endsWith("/users/me")) return Response.json({ id: "bot" });
    if (path.endsWith("/query")) return Response.json({ results: [...rows], next_cursor: null, has_more: false });
    assert.ok(path.startsWith("/v1/pages"));
    if (options?.method === "GET") return Response.json(rows.find((r) => r.id === path.split("/").at(-1)));
    if (failUpdate && options?.method === "PATCH") throw Error("interrupted");
    const { properties } = JSON.parse(options?.body as string);
    const saved = Object.fromEntries(Object.entries(properties).map(([name, prop]) => {
      const [type, value] = Object.entries(prop as object)[0];
      const content = type === "title" || type === "rich_text" ? value.map((v: {text:{content:string}}) => ({ plain_text: v.text.content })) : value;
      return [name, { type, [type]: content }];
    }));
    writes++;
    if (options?.method === "POST") {
      const id = String(rows.length + 1);
      const row = { object: "page", url: `https://example.com/${id}`, id, created_time: id, created_by: { id: "bot" }, last_edited_by: { id: "bot" }, properties: saved };
      rows.push(row);
      return Response.json(row);
    }
    const row = rows.find((r) => r.id === path.split("/").at(-1))!;
    Object.assign(row.properties, saved);
    return Response.json(row);
  } });
  return { client, rows, get writes() { return writes; }, failUpdates(value: boolean) { failUpdate = value; } };
}

test("dry-run, retry, same-link aliases and corrections are idempotent", async () => {
  const f = notionFixture();
  const run = (items: NewsSourceArticle[], dryRun = false) => syncNews(f.client, items, { dryRun });
  assert.equal((await run([article], true)).created, 1);
  assert.equal(f.writes, 0);
  f.failUpdates(true);
  await assert.rejects(() => run([article]));
  assert.equal(f.rows.length, 1);
  assert.equal(f.rows[0].properties["公開"].checkbox, false);
  f.failUpdates(false);
  assert.equal((await run([article])).created, 1);
  assert.equal(f.rows.length, 1);
  assert.equal((await run([article])).unchanged, 1);
  assert.equal((await run([{ ...article, summary: "日程を追記", initialOnly: true }])).unchanged, 1);
  assert.equal((await run([{ ...article, summary: "日程を追記" }])).updated, 1);
  assert.equal((await run([{ ...article, slug: "alias", link: { ...article.link, href: "https://youtu.be/8BfcRA0mPfg" } }])).skipped, 1);
  assert.equal(f.rows.length, 1);
  f.rows[0].last_edited_by.id = "human";
  assert.equal((await run([article])).skipped, 1);
  f.rows[0].last_edited_by.id = "bot";
  f.rows[0].properties["公開"].checkbox = false;
  assert.equal((await run([article])).skipped, 1);
  assert.equal(f.writes, 3);
});

test("concurrent jobs elect one public page and an existing manual draft suppresses future intake", async () => {
  const f = notionFixture();
  await Promise.all([syncNews(f.client, [article]), syncNews(f.client, [article])]);
  const published = f.rows.filter((r) => r.properties["公開"].checkbox);
  assert.equal(published.length, 1);
  published[0].created_by.id = "editor";
  published[0].properties["公開"].checkbox = false;
  published[0].properties["スラッグ"].rich_text = [{ plain_text: "editorial-slug" }];
  assert.equal((await syncNews(f.client, [article])).skipped, 1);
  assert.equal(f.rows.filter((r) => r.properties["公開"].checkbox).length, 0);
});

test("different sources reporting the same milestone elect one announcement and preserve its source", async () => {
  const other = { ...article, slug: "second-source", link: { label: "本人のX", href: "https://x.com/KYOUPOKEch/status/12345" } };
  const f = notionFixture();
  const first = await syncNews(f.client, [article, other]);
  assert.equal(first.created, 1);
  assert.equal(first.skipped, 1);
  assert.equal(f.rows.length, 1);

  const g = notionFixture();
  await Promise.all([syncNews(g.client, [article]), syncNews(g.client, [other])]);
  const published = g.rows.filter((r) => r.properties["公開"].checkbox);
  assert.equal(published.length, 1);
  const elected = published[0].properties;
  const slug = elected["スラッグ"].rich_text![0].plain_text;
  const source = slug === `auto-${article.slug}` ? article : other;
  assert.equal(elected["リンクURL"].url, source.link.href);
  assert.equal((await syncNews(g.client, [source])).unchanged, 1);
});

test("the public feed selects the oldest copy of an automated post and still excludes ambiguous manual slugs", async () => {
  const { fetchNews } = await import("../src/lib/notion");
  const f = notionFixture();
  await syncNews(f.client, [article]);
  const first = f.rows[0];
  const second = structuredClone(first);
  second.id = "2";
  second.created_time = "2";
  second.properties["要約"].rich_text = [{ plain_text: "後から作られた記事" }];
  const manual = [3, 4].map((id) => {
    const row = structuredClone(first);
    row.id = String(id);
    row.properties["スラッグ"].rich_text = [{ plain_text: "manual-slug" }];
    return row;
  });
  const previousFetch = globalThis.fetch;
  const token = process.env.NOTION_TOKEN;
  process.env.NOTION_TOKEN = "test-token";
  globalThis.fetch = async () => Response.json({ results: [second, ...manual, first], next_cursor: null, has_more: false });
  try {
    const published = await fetchNews();
    assert.deepEqual(published?.map((row) => [row.slug, row.summary]), [["auto-channel-event", article.summary]]);
  } finally {
    globalThis.fetch = previousFetch;
    if (token === undefined) delete process.env.NOTION_TOKEN;
    else process.env.NOTION_TOKEN = token;
  }
});
