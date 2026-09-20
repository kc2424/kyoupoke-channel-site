// JSON-LD構造化データを <script type="application/ld+json"> として埋め込む。
import { serializeJsonLd } from "@/lib/content-validation";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
