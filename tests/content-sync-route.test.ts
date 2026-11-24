import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/content-sync/route";
import { syncSucceeded } from "../src/lib/content-sync";

test("news-only runs succeed and a failure in any configured source is reported", () => {
  const news = { status: "ok" as const, created: 0, updated: 0, unchanged: 6, skipped: 0, failedSources: [] };
  assert.ok(syncSucceeded({ stats: { status: "not_configured" }, news }));
  assert.ok(!syncSucceeded({ stats: { status: "failed" }, news }));
  assert.ok(!syncSucceeded({ stats: { status: "not_configured" }, news: { ...news, status: "partial", failedSources: ["reject"] } }));
});

test("scheduled endpoint accepts work only in production with the configured bearer", async (t) => {
  const request = (authorization?: string) => new Request("https://example.test/api/content-sync", {
    method: "POST", headers: authorization ? { authorization } : {},
  });
  t.mock.method(globalThis, "fetch", () => { throw new Error("unexpected outbound request"); });
  const before = { VERCEL_ENV: process.env.VERCEL_ENV, CRON_SECRET: process.env.CRON_SECRET };
  t.after(() => {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  process.env.CRON_SECRET = "test-secret";
  process.env.VERCEL_ENV = "preview";
  assert.equal((await POST(request("Bearer test-secret"))).status, 404);
  process.env.VERCEL_ENV = "production";
  assert.equal((await POST(request())).status, 401);
  assert.equal((await POST(request("Bearer wrong"))).status, 401);
  delete process.env.CRON_SECRET;
  assert.equal((await POST(request("Bearer undefined"))).status, 401);
});
