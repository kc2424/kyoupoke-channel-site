import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import nextConfig from "./next.config";

export default defineConfig({
  plugins: [
    vinext({
      // This deployment is a trial; the Vercel URL remains canonical.
      nextConfig: {
        ...nextConfig,
        headers: async () => [
          {
            source: "/",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          },
          {
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          },
        ],
      },
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
