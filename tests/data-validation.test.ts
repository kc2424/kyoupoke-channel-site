import assert from "node:assert/strict";
import test from "node:test";

import {
  formatPublicationDate,
  isPublishedBy,
  publicationTimestamp,
  safeExternalUrl,
  safeImagePath,
  serializeJsonLd,
  validSlug,
  validVideoId,
} from "../src/lib/content-validation";

test("slugとYouTube IDを厳格に検証する", () => {
  assert.equal(validSlug("reject-cup-2026"), true);
  assert.equal(validSlug("Reject-Cup"), false);
  assert.equal(validSlug("../news"), false);
  assert.equal(validSlug(`a${"b".repeat(160)}`), false);
  assert.equal(validVideoId("8BfcRA0mPfg"), true);
  assert.equal(validVideoId("8BfcRA0mPfg?autoplay=1"), false);
});

test("外部URLは認証情報のないHTTPSだけを許可する", () => {
  assert.equal(safeExternalUrl("https://example.com/news?q=1"), "https://example.com/news?q=1");
  assert.equal(safeExternalUrl("http://example.com"), undefined);
  assert.equal(safeExternalUrl("https://user:pass@example.com"), undefined);
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
});

test("画像は安全なローカルパスか既知のYouTubeサムネイルだけを許可する", () => {
  assert.equal(safeImagePath("/members/banbee.png"), "/members/banbee.png");
  assert.equal(safeImagePath("/../secret.png"), undefined);
  assert.equal(safeImagePath("//example.com/image.png"), undefined);
  assert.equal(
    safeImagePath("https://img.youtube.com/vi/8BfcRA0mPfg/hqdefault.jpg"),
    "https://img.youtube.com/vi/8BfcRA0mPfg/hqdefault.jpg",
  );
  assert.equal(safeImagePath("https://example.com/image.jpg"), undefined);
});

test("日付のみはJSTの午前0時として扱い、実在しない日付を拒否する", () => {
  assert.equal(publicationTimestamp("2026-09-21"), Date.parse("2026-09-21T00:00:00+09:00"));
  assert.equal(publicationTimestamp("2026-02-30"), undefined);
  assert.equal(publicationTimestamp("2026-09-21T12:34:56"), undefined);
  assert.equal(formatPublicationDate("2026-09-21"), "2026年9月21日");
  assert.equal(isPublishedBy("2026-09-22", Date.parse("2026-09-21T15:00:00Z") - 1), false);
  assert.equal(isPublishedBy("2026-09-22", Date.parse("2026-09-21T15:00:00Z")), true);
});

test("JSON-LDをscript要素から脱出できない文字列へ変換する", () => {
  const serialized = serializeJsonLd({ text: "</script><script>&\u2028\u2029" });
  assert.equal(serialized.includes("</script>"), false);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes(">"), false);
  assert.equal(serialized.includes("&"), false);
  assert.deepEqual(JSON.parse(serialized), { text: "</script><script>&\u2028\u2029" });
});
