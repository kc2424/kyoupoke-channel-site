import { createHash, timingSafeEqual } from "node:crypto";
import { syncContent, syncSucceeded } from "@/lib/content-sync";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (process.env.VERCEL_ENV !== "production") return new Response(null, { status: 404 });
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!secret || !authorization || !timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`))) {
    return new Response(null, { status: 401 });
  }
  try {
    const report = await syncContent();
    const ok = syncSucceeded(report);
    if (!ok || report.stats.status === "not_configured") console.warn("[content-sync]", report);
    else console.info("[content-sync]", report);
    return Response.json(report, { status: ok ? 200 : 503 });
  } catch {
    console.error("[content-sync] configuration unavailable");
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
