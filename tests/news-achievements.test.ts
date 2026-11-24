import assert from "node:assert/strict";
import test from "node:test";
import type { NewsArticle } from "../src/content/news";
import { achievementCards } from "../src/lib/news-achievements";

const milestone: NewsArticle = {
  date: "2026-09-30", slug: "auto-channel-subscribers-700000", category: "お知らせ",
  title: "今日ポケch.、登録者70万人を報告", summary: "", body: [],
  link: { label: "公式発表", href: "https://x.com/KYOUPOKEch/status/2105273704456630280" },
};
test("登録者の実績に公式出典を添え、非公開や表示中の手動カードを優先する", () => {
  const card = { label: "登録者数700,000人", sub: "70万人到達", tone: "black" as const };
  assert.equal(achievementCards([], [], [milestone])[0].source?.href, milestone.link?.href);
  assert.deepEqual(achievementCards([card], [], [milestone]), [card]);
  assert.deepEqual(achievementCards([], [card], [milestone]), []);
  assert.deepEqual(achievementCards([], [], [{ ...milestone, link: { label: "", href: "https://x.com/other/status/1" } }]), []);
});
test("主催REJECTの杯で明記された本人の優勝だけを実績にする", () => {
  const win = { ...milestone, title: "REJECT杯でチームくろこが優勝", slug: "auto-reject-100",
    link: { label: "結果", href: "https://reject.jp/2026/09/30/result/" } };
  assert.equal(achievementCards([], [], [win])[0].label, win.title);
  const earlierWin = { label: "REJECT杯 優勝", sub: "チームくろこ優勝（2026年8月）", tone: "brand" as const };
  assert.equal(achievementCards([earlierWin], [], [win]).length, 2);
  assert.equal(achievementCards([], [], [win, { ...win, date: "2026-08-20", slug: "auto-reject-50" }]).length, 2);
  assert.deepEqual(achievementCards([earlierWin], [], [{ ...win, date: "2026-08-20" }]), [earlierWin]);
  for (const title of ["REJECT杯でチームくろこが優勝なるか", "いろはがWCSに出場", "REJECT杯でトシが優勝", "REJECT杯でいろはが準優勝"]) {
    assert.deepEqual(achievementCards([], [], [{ ...win, title }]), []);
  }
});
