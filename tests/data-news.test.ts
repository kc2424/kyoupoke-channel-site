import assert from "node:assert/strict";
import test from "node:test";

import { getAllNews } from "../src/content/news";
import { publicationTimestamp, validSlug } from "../src/lib/content-validation";

test("Notion未設定時の記事は有効なslugで公開日の降順になる", async () => {
  const previous = process.env.NOTION_TOKEN;
  Reflect.deleteProperty(process.env, "NOTION_TOKEN");
  try {
    const news = await getAllNews();
    assert.ok(news.length > 0);
    assert.equal(new Set(news.map((article) => article.slug)).size, news.length);
    assert.equal(news.every((article) => validSlug(article.slug)), true);
    for (let index = 1; index < news.length; index += 1) {
      assert.ok(publicationTimestamp(news[index - 1]!.date)! >= publicationTimestamp(news[index]!.date)!);
    }
  } finally {
    if (previous === undefined) Reflect.deleteProperty(process.env, "NOTION_TOKEN");
    else process.env.NOTION_TOKEN = previous;
  }
});
