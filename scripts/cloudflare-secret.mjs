import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Only this site's CMS key is transferred. Never forward all Vercel env vars.
const token = process.env.NOTION_TOKEN;
if (!token || token === "[SENSITIVE]") {
  throw new Error(".env.local の NOTION_TOKEN に元のNotion接続キーを設定してください。");
}

const root = fileURLToPath(new URL("../", import.meta.url));
const config = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
if (config.name !== "kyoupoke-channel-site-preview") {
  throw new Error("このスクリプトは試験用Workerだけを対象にします。公開先を確認してください。");
}

const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url)),
    "secret", "put", "NOTION_TOKEN", "--config", "wrangler.jsonc",
  ],
  { cwd: root, input: `${token}\n`, stdio: ["pipe", "inherit", "inherit"] },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
