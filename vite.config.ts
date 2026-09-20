import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

// vinext loads next.config.ts itself; this selects preview-only response headers.
process.env.KYOUPOKE_DEPLOY_TARGET = "cloudflare-preview";

export default defineConfig({
  plugins: [
    vinext({
      cache: { data: kvDataAdapter(), cdn: cdnAdapter() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
