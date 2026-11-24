import { isFullPage, type Client, type PageObjectResponse } from "@notionhq/client";
import { isPublishedBy, safeExternalUrl, validSlug, validVideoId } from "./content-validation";
import { NEWS_DATA_SOURCE_ID, type NotionNewsArticle } from "./notion";

export type NewsSourceArticle = Omit<NotionNewsArticle, "link" | "updatedAt"> & {
  link: NonNullable<NotionNewsArticle["link"]>;
  initialOnly?: boolean;
};

type Page = PageObjectResponse;

function textValue(property: Page["properties"][string]) {
  const items = property?.type === "title" ? property.title : property?.type === "rich_text" ? property.rich_text : [];
  return items.map((item) => item.plain_text).join("");
}

function sourceKey(href: string) {
  const safe = safeExternalUrl(href);
  if (!safe) return "";
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
    const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") ?? /^\/(?:live|shorts|embed)\/([^/]+)$/.exec(url.pathname)?.[1];
    if (id && validVideoId(id)) return `youtube:${id}`;
  }
  if (host === "x.com" || host === "twitter.com") {
    const post = /\/status\/(\d+)/.exec(url.pathname);
    if (post) return `x:${post[1]}`;
  }
  url.hash = "";
  for (const key of Array.from(url.searchParams.keys())) {
    if (key.startsWith("utm_") || key === "fbclid") url.searchParams.delete(key);
  }
  return url.href.replace(/\/$/, "");
}

function propertiesFor(article: NewsSourceArticle) {
  const text = (content: string) => [{ type: "text" as const, text: { content } }];
  return {
    タイトル: { title: text(article.title) },
    要約: { rich_text: text(article.summary) },
    本文: { rich_text: text(article.body.join("\n\n")) },
    公開日: { date: { start: article.date } },
    カテゴリ: { select: { name: article.category } },
    リンクURL: { url: article.link.href },
    リンクラベル: { rich_text: text(article.link.label) },
  };
}

function unchanged(page: Page, article: NewsSourceArticle) {
  const p = page.properties;
  const date = p["公開日"];
  // Notion may return a datetime with a different offset from the submitted ISO string.
  const stored = date?.type === "date" ? date.date?.start : undefined;
  const sameDate = stored === article.date || Boolean(stored?.includes("T") && article.date.includes("T") && Date.parse(stored) === Date.parse(article.date));
  return sameDate && textValue(p["タイトル"]) === article.title && textValue(p["要約"]) === article.summary &&
    textValue(p["本文"]) === article.body.join("\n\n") && textValue(p["リンクラベル"]) === article.link.label &&
    p["リンクURL"]?.type === "url" && p["リンクURL"].url === article.link.href &&
    p["カテゴリ"]?.type === "select" && p["カテゴリ"].select?.name === article.category;
}

async function readPages(notion: Client) {
  const pages: Page[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const response = await notion.dataSources.query({ data_source_id: NEWS_DATA_SOURCE_ID, page_size: 100, result_type: "page", start_cursor: cursor });
    for (const row of response.results) {
      if (!isFullPage(row)) throw new Error("news_incomplete_page");
      pages.push(row);
    }
    if (!response.has_more && response.request_status?.type !== "incomplete") return pages;
    if (!response.next_cursor || cursors.has(response.next_cursor)) throw new Error("news_incomplete_index");
    cursor = response.next_cursor;
    cursors.add(cursor);
  } while (cursor);
  throw new Error("news_incomplete_index");
}

function findArticle(pages: Page[], article: NewsSourceArticle, botId: string) {
  const slug = `auto-${article.slug}`;
  const pending = `pending-${slug}`;
  const source = sourceKey(article.link.href);
  const candidates: Page[] = [];
  for (const page of pages) {
    const p = page.properties;
    const existingSlug = textValue(p["スラッグ"]);
    const url = p["リンクURL"];
    const sameLink = url?.type === "url" && !!url.url && sourceKey(url.url) === source;
    if (existingSlug !== slug && existingSlug !== pending && existingSlug !== article.slug && !sameLink && textValue(p["タイトル"]) !== article.title) continue;
    const published = p["公開"];
    // Any human-owned, deliberately hidden or manually edited copy takes precedence.
    if (page.in_trash || page.created_by.id !== botId || page.last_edited_by.id !== botId || published?.type !== "checkbox" ||
      !((existingSlug.startsWith("pending-auto-") && !published.checkbox) || (existingSlug.startsWith("auto-") && published.checkbox))) return { kind: "protected" } as const;
    candidates.push(page);
  }
  if (!candidates.length) return { kind: "new" } as const;
  const published = candidates.filter((p) => textValue(p.properties["スラッグ"]).startsWith("auto-"));
  const winners = published.length ? published : candidates;
  winners.sort((a, b) => a.created_time.localeCompare(b.created_time) || a.id.localeCompare(b.id));
  const winner = winners[0];
  if (published.length && textValue(winner.properties["スラッグ"]) !== slug) return { kind: "protected" } as const;
  return { kind: published.length ? "published" as const : "pending" as const, page: winner };
}

function usable(article: NewsSourceArticle) {
  return validSlug(`pending-auto-${article.slug}`) && isPublishedBy(article.date) && Boolean(sourceKey(article.link.href)) &&
    [article.title, article.summary, article.body.join("\n\n"), article.link.label].every((s) => s.trim() && s.length <= 2000) &&
    article.link.href.length <= 2000;
}

/** Stage privately, then re-read competing claims before publishing one canonical row. */
export async function syncNews(notion: Client, articles: NewsSourceArticle[], options: { dryRun?: boolean } = {}) {
  const counts = { created: 0, updated: 0, unchanged: 0, skipped: 0 };
  if (!articles.length) return counts;
  const [bot, active] = await Promise.all([notion.users.me({}), readPages(notion)]);
  let pages = active;
  const sources = new Set<string>();
  const slugs = new Set<string>();
  const titles = new Set<string>();
  const candidates: NewsSourceArticle[] = [];
  let staged = false;
  for (const article of articles) {
    const source = sourceKey(article.link.href);
    if (!usable(article) || sources.has(source) || slugs.has(article.slug) || titles.has(article.title)) { counts.skipped++; continue; }
    sources.add(source);
    slugs.add(article.slug);
    titles.add(article.title);
    candidates.push(article);
    if (options.dryRun || findArticle(pages, article, bot.id).kind !== "new") continue;
    await notion.pages.create({ parent: { data_source_id: NEWS_DATA_SOURCE_ID }, properties: {
      ...propertiesFor(article), 公開: { checkbox: false }, スラッグ: { rich_text: [{ text: { content: `pending-auto-${article.slug}` } }] },
    } });
    staged = true;
  }
  if (staged) pages = await readPages(notion);
  for (const article of candidates) {
    let match = findArticle(pages, article, bot.id);
    if (match.kind === "protected") { counts.skipped++; continue; }
    if (match.kind === "new") {
      if (!options.dryRun) throw new Error("news_staged_page_not_visible");
      counts.created++;
      continue;
    }
    if (match.kind === "published" && (article.initialOnly || unchanged(match.page, article))) { counts.unchanged++; continue; }
    if (!options.dryRun) {
      // Another run or an editor may have changed the row since the initial listing.
      const current = await notion.pages.retrieve({ page_id: match.page.id });
      if (!isFullPage(current)) throw new Error("news_incomplete_page");
      match = findArticle([current], article, bot.id);
      if (match.kind === "protected" || match.kind === "new") { counts.skipped++; continue; }
      if (match.kind === "published" && (article.initialOnly || unchanged(match.page, article))) { counts.unchanged++; continue; }
    }
    const publish = match.kind === "pending";
    if (!options.dryRun) {
      const slug = textValue(match.page.properties["スラッグ"]).replace(/^pending-/, "");
      // Different feeds can stage the same announcement. Preserve the elected page's source and wording.
      const content = slug === `auto-${article.slug}` ? propertiesFor(article) : {};
      await notion.pages.update({ page_id: match.page.id, properties: {
        ...content, ...(publish ? { スラッグ: { rich_text: [{ text: { content: slug } }] }, 公開: { checkbox: true } } : {}),
      } });
    }
    if (publish) counts.created++; else counts.updated++;
  }
  return counts;
}
