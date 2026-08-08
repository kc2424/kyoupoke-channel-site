import type { MetadataRoute } from "next";

import { SITE_INDEXABLE, SITE_URL } from "@/lib/seo";

// 非公開の間は全クローラーを拒否する。src/lib/seo.ts の SITE_INDEXABLE を
// true にすれば、そのまま全許可 + sitemap参照の robots.txt に切り替わる。
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
