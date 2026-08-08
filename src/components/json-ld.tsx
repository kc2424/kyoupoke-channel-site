// JSON-LD構造化データを <script type="application/ld+json"> として埋め込む。
// dataはこちらで生成したオブジェクトのみを渡す前提（外部入力を直接渡さない）。
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
