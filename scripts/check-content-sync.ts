import { syncContent, syncSucceeded } from "../src/lib/content-sync";

const report = await syncContent({ dryRun: true });
console.log(JSON.stringify(report, null, 2));
if (!syncSucceeded(report)) process.exitCode = 1;
