import { spawnSync } from "node:child_process";

// Sequential builds share generated framework artifacts; do not run them in parallel.
const checks = [
  ["audit", "--audit-level=high"],
  ["run", "lint", "--", "--max-warnings=0"],
  ["test"],
  ["run", "build"],
  ["run", "build:vinext"],
  ["run", "cf:dry-run"],
];
for (const args of checks) {
  console.log(`\nQuality check: npm ${args.join(" ")}`);
  const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", args, { stdio: "inherit" });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("\nBuild checks passed. Run npm run test:browser before publication; browser checks also run in CI.");
