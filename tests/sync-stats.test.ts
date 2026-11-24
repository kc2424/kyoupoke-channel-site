import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@notionhq/client";

import { saveChannelStats, syncChannelStats } from "../src/lib/sync-stats";
import { CHANNEL_ID } from "../src/lib/youtube";

function row(id: string, label: string, unit: string, previous: string | null = null) {
  return {
    object: "page", id, url: "https://www.notion.so/" + id,
    properties: {
      "ラベル": { type: "title", title: [{ plain_text: label }] },
      "小数桁": { type: "number", number: 1 },
      "接尾語": { type: "rich_text", rich_text: [{ plain_text: unit }] },
      "数値": { type: "number", number: 0 },
      "取得値": { type: "number", number: null },
      "確認日": { type: "date", date: previous ? { start: previous } : null },
    },
  };
}

function fakeNotion(rows = [row("sub", "チャンネル登録者数", "万人+"), row("views", "総再生回数", "億回+")]) {
  const writes: { id: string; properties: Record<string, object> }[] = [];
  const client = new Client({ logger: () => {}, fetch: async (input, init) => {
    if (init?.method === "PATCH") {
      writes.push({ id: String(input).split("/").at(-1)!, properties: JSON.parse(String(init.body)).properties });
      return Response.json({});
    }
    assert.match(String(input), /\/query$/);
    return Response.json({ results: rows, has_more: false });
  } });
  return { client, writes };
}

const sample = { subscribers: 713_000, views: 1_393_413_896, checkedOn: "2026-01-01" };

test("公式統計を既存の表示単位へ切り捨て、元の値・確認日と一緒に書き込む", async () => {
  const { client, writes } = fakeNotion();
  await saveChannelStats(client, sample, { dryRun: true });
  assert.deepEqual(writes, []);
  assert.deepEqual(await saveChannelStats(client, sample), { checkedOn: sample.checkedOn, updated: 2 });
  assert.deepEqual(writes, [
    { id: "sub", properties: { "数値": { number: 71.3 }, "取得値": { number: sample.subscribers }, "確認日": { date: { start: sample.checkedOn } } } },
    { id: "views", properties: { "数値": { number: 13.9 }, "取得値": { number: sample.views }, "確認日": { date: { start: sample.checkedOn } } } },
  ]);
});

test("片方の更新後に再試行しても、新しい観測を書き戻さず残りの行だけを更新する", async () => {
  for (const previous of [sample.checkedOn, "2026-01-02"]) {
    const { client, writes } = fakeNotion([
      row("sub", "チャンネル登録者数", "万人+", previous), row("views", "総再生回数", "億回+"),
    ]);
    assert.equal((await saveChannelStats(client, sample)).updated, 1);
    assert.deepEqual(writes.map((write) => write.id), ["views"]);
  }
});

test("重複ラベル・単位不一致・未来日・不完全な数値は書込前に拒否する", async () => {
  for (const second of [row("duplicate", "チャンネル登録者数", "万人+"), row("wrong", "総再生回数", "回")]) {
    const { client, writes } = fakeNotion([row("sub", "チャンネル登録者数", "万人+"), second]);
    await assert.rejects(saveChannelStats(client, sample), /stats_schema|stats_rows/);
    assert.equal(writes.length, 0);
  }
  const { client } = fakeNotion();
  await assert.rejects(saveChannelStats(client, { ...sample, checkedOn: "2999-01-01" }), /invalid_channel_observation/);
  await assert.rejects(saveChannelStats(client, { ...sample, views: 0 }), /invalid_channel_observation/);
});

test("YouTube APIのチャンネルID・公開状態・数値を検証し、不完全な応答は反映しない", async (t) => {
  const oldKey = process.env.YOUTUBE_API_KEY;
  t.after(() => {
    if (oldKey === undefined) delete process.env.YOUTUBE_API_KEY;
    else process.env.YOUTUBE_API_KEY = oldKey;
  });
  delete process.env.YOUTUBE_API_KEY;
  const { client, writes } = fakeNotion();
  await assert.rejects(syncChannelStats(client), /missing_youtube_api_key/);
  process.env.YOUTUBE_API_KEY = "test-key";
  const statistics = { hiddenSubscriberCount: false, viewCount: "1393413896", subscriberCount: "713000" };
  const fetchMock = t.mock.method(globalThis, "fetch");
  for (const item of [
    { id: "other", statistics },
    { id: CHANNEL_ID, statistics: { ...statistics, hiddenSubscriberCount: true } },
    { id: CHANNEL_ID, statistics: { ...statistics, viewCount: null } },
  ]) {
    fetchMock.mock.mockImplementation(async () => Response.json({ items: [item] }));
    await assert.rejects(syncChannelStats(client), /invalid_youtube_statistics/);
  }
  fetchMock.mock.mockImplementation(async () => new Response(null, { status: 403 }));
  await assert.rejects(syncChannelStats(client), /youtube_statistics_http_403/);
  assert.equal(writes.length, 0);
  fetchMock.mock.mockImplementation(async (input, init) => {
    assert.equal(new URL(String(input)).searchParams.get("id"), CHANNEL_ID);
    assert.equal(new Headers(init?.headers).get("X-Goog-Api-Key"), "test-key");
    return Response.json({ items: [{ id: CHANNEL_ID, statistics }] });
  });
  assert.equal((await syncChannelStats(client)).updated, 2);
});
