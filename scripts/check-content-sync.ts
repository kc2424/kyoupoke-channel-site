import { syncContent } from "../src/lib/content-sync";

const report = await syncContent({ dryRun: true });
console.log(JSON.stringify(report, null, 2));
if (report.news.status !== "ok" || report.stats.status !== "ok") process.exitCode = 1;
