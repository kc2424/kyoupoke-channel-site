import { Client, type QueryDataSourceParameters } from "@notionhq/client";
import { cache } from "react";

import { isPublishedBy, publicationTimestamp, safeExternalUrl, safeImagePath, validSlug, validVideoId } from "@/lib/content-validation";

const MEMBERS_DATA_SOURCE_ID = "bae6dc6b-1a16-4dab-bc29-17e07e8dcdb2";
const ACHIEVEMENTS_DATA_SOURCE_ID = "e680e416-6833-4a4a-be31-800cb2f57208";
const STATS_DATA_SOURCE_ID = "777541f2-088b-460b-9bfe-9b8b8308e6aa";
const VIDEOS_DATA_SOURCE_ID = "70745038-6c0e-41bc-8307-e2c456676d02";
const LINKS_DATA_SOURCE_ID = "6b2c8532-e222-44b8-a5ac-bfba572411ee";
const SITE_TEXT_DATA_SOURCE_ID = "a816d703-edc6-42ab-a2fe-58a35d7c48b6";
const NEWS_DATA_SOURCE_ID = "de43ee17-f9cb-47a3-b6f0-47f4b0e86b22";

export type NotionMember = {
  name: string;
  role: string;
  tags: string[];
  text: string;
  photo?: string;
  milestones: { period: string; text: string }[];
};

export type NotionAchievement = {
  label: string;
  sub: string;
  tone: "brand" | "black";
};

export type NotionStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  /** CMS上でこの数値が最後に更新された日時。集計時点とは限らない。 */
  updatedAt?: string;
};

export type NotionVideo = {
  id: number;
  videoId: string;
  title: string;
};

export type NotionLinkIcon =
  | "YouTube"
  | "X"
  | "Instagram"
  | "TikTok"
  | "Shop"
  | "User";

export type NotionLink = {
  label: string;
  sub: string;
  href: string;
  icon: NotionLinkIcon;
};

export type NotionNewsCategory = "お知らせ" | "イベント" | "メディア" | "動画";

export type NotionNewsArticle = {
  slug: string;
  date: string;
  updatedAt?: string;
  category: NotionNewsCategory;
  title: string;
  summary: string;
  body: string[];
  link?: { label: string; href: string };
};

type Properties = Record<string, unknown>;

function record(value: unknown): Properties {
  return value !== null && typeof value === "object" ? value as Properties : {};
}

function textProperty(prop: unknown, kind: "rich_text" | "title"): string {
  const items = record(prop)[kind];
  return Array.isArray(items)
    ? items.map((item) => typeof record(item).plain_text === "string" ? record(item).plain_text : "").join("").trim()
    : "";
}

const richText = (prop: unknown) => textProperty(prop, "rich_text");
const title = (prop: unknown) => textProperty(prop, "title");
const select = (prop: unknown) => {
  const value = record(record(prop).select).name;
  return typeof value === "string" ? value : "";
};
const url = (prop: unknown) => {
  const value = record(prop).url;
  return typeof value === "string" ? value : "";
};
const dateStart = (prop: unknown) => {
  const value = record(record(prop).date).start;
  return typeof value === "string" ? value : "";
};
const number = (prop: unknown): number | undefined => {
  const value = record(prop).number;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};
const pageProperties = (page: unknown): Properties => record(record(page).properties);

function parseMilestones(raw: string): { period: string; text: string }[] {
  return raw.split("\n").map((line) => {
    const [period, ...rest] = line.split("|");
    return { period: period?.trim() ?? "", text: rest.join("|").trim() };
  }).filter((milestone) => milestone.period && milestone.text);
}

/** 0件は正常な公開状態。未設定・失敗だけnullを返す。API本文や認証情報はログに含めない。 */
async function queryAllPages(params: QueryDataSourceParameters, section: string): Promise<unknown[] | null> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 12_000);
  const notion = new Client({
    auth: token,
    timeoutMs: 8_000,
    retry: { maxRetries: 1, maxRetryDelayMs: 1_000 },
    logger: () => {},
    fetch: (input, init) => fetch(input, { ...init, signal: controller.signal }),
  });
  const pages: unknown[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  try {
    do {
      const response = await notion.dataSources.query({ ...params, page_size: 100, start_cursor: cursor });
      if (!Array.isArray(response.results)) throw new Error("invalid_response");
      pages.push(...response.results);
      if (!response.has_more) {
        if (response.request_status?.type === "incomplete") throw new Error("incomplete_response");
        return pages;
      }
      const next = response.next_cursor;
      if (!next || cursors.has(next)) throw new Error("invalid_cursor");
      cursors.add(next);
      cursor = next;
    } while (!controller.signal.aborted);
    throw new Error("deadline_exceeded");
  } catch {
    console.error("[content] Notion取得失敗", { section, reason: controller.signal.aborted ? "timeout" : "request_failed" });
    return null;
  } finally {
    clearTimeout(deadline);
  }
}

function reportInvalid(section: string, count: number) {
  if (count > 0) console.warn("[content] 無効なCMS項目を除外", { section, count });
}

export const fetchPublishedMembers = cache(async (
  category: "メインメンバー" | "スタッフ"
): Promise<NotionMember[] | null> => {
  const pages = await queryAllPages({
    data_source_id: MEMBERS_DATA_SOURCE_ID,
    filter: { and: [
      { property: "ステータス", select: { equals: "公開中" } },
      { property: "区分", select: { equals: category } },
    ] },
    sorts: [{ property: "表示順", direction: "ascending" }],
  }, "members");
  if (pages === null) return null;
  const members = pages.map((page) => {
    const properties = pageProperties(page);
    return {
      name: title(properties["名前"]),
      role: richText(properties["キャッチコピー"]),
      tags: richText(properties["タグ"]).split(",").map((tag) => tag.trim()).filter(Boolean),
      text: richText(properties["プロフィール文"]),
      photo: safeImagePath(richText(properties["写真パス"])),
      milestones: parseMilestones(richText(properties["沿革"])),
    };
  }).filter((member) => member.name && member.text);
  reportInvalid("members", pages.length - members.length);
  return members;
});

export const fetchAchievements = cache(async (): Promise<NotionAchievement[] | null> => {
  const pages = await queryAllPages({
    data_source_id: ACHIEVEMENTS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  }, "achievements");
  if (pages === null) return null;
  const achievements: NotionAchievement[] = pages.map((page) => {
    const properties = pageProperties(page);
    return {
      label: title(properties["見出し"]),
      sub: richText(properties["補足"]),
      tone: select(properties["トーン"]) === "ブランド色" ? "brand" as const : "black" as const,
    };
  }).filter((achievement) => achievement.label);
  reportInvalid("achievements", pages.length - achievements.length);
  return achievements;
});

export const fetchStats = cache(async (): Promise<NotionStat[] | null> => {
  const pages = await queryAllPages({
    data_source_id: STATS_DATA_SOURCE_ID,
    sorts: [{ property: "表示順", direction: "ascending" }],
  }, "stats");
  if (pages === null) return null;
  const stats = pages.flatMap((page) => {
    const properties = pageProperties(page);
    const value = number(properties["数値"]);
    const decimals = number(properties["小数桁"]) ?? 0;
    const label = title(properties["ラベル"]);
    if (value === undefined || value < 0 || !Number.isInteger(decimals) || decimals < 0 || decimals > 6 || !label) return [];
    const edited = record(page).last_edited_time;
    const updatedAt = typeof edited === "string" && publicationTimestamp(edited) !== undefined
      ? edited
      : undefined;
    return [{ value, decimals, suffix: richText(properties["接尾語"]), label, updatedAt }];
  });
  reportInvalid("stats", pages.length - stats.length);
  return stats;
});

export const fetchVideos = cache(async (): Promise<NotionVideo[] | null> => {
  const pages = await queryAllPages({
    data_source_id: VIDEOS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  }, "videos");
  if (pages === null) return null;
  const videos = pages.map((page, index) => {
    const properties = pageProperties(page);
    return { id: index + 1, videoId: richText(properties["YouTube動画ID"]), title: title(properties["タイトル"]) };
  }).filter((video) => validVideoId(video.videoId) && video.title);
  reportInvalid("videos", pages.length - videos.length);
  return videos;
});

const LINK_ICONS: NotionLinkIcon[] = ["YouTube", "X", "Instagram", "TikTok", "Shop", "User"];
export const fetchLinks = cache(async (): Promise<{ mainLinks: NotionLink[]; memberLinks: NotionLink[] } | null> => {
  const pages = await queryAllPages({
    data_source_id: LINKS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  }, "links");
  if (pages === null) return null;
  const links = pages.flatMap((page) => {
    const properties = pageProperties(page);
    const href = safeExternalUrl(url(properties["URL"]));
    const label = title(properties["ラベル"]);
    const kind = select(properties["種別"]);
    if (!href || !label || !["メインリンク", "メンバーチャンネル"].includes(kind)) return [];
    const iconName = select(properties["アイコン"]) as NotionLinkIcon;
    return [{ kind, label, sub: richText(properties["補足"]), href, icon: LINK_ICONS.includes(iconName) ? iconName : "User" as const }];
  });
  reportInvalid("links", pages.length - links.length);
  return {
    mainLinks: links.filter((link) => link.kind === "メインリンク"),
    memberLinks: links.filter((link) => link.kind === "メンバーチャンネル"),
  };
});

const NEWS_CATEGORIES: NotionNewsCategory[] = ["お知らせ", "イベント", "メディア", "動画"];
export const fetchNews = cache(async (): Promise<NotionNewsArticle[] | null> => {
  const pages = await queryAllPages({
    data_source_id: NEWS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "公開日", direction: "descending" }],
  }, "news");
  if (pages === null) return null;
  const now = Date.now();
  let invalid = 0;
  const articles = pages.flatMap((page): NotionNewsArticle[] => {
    const properties = pageProperties(page);
    const slug = richText(properties["スラッグ"]);
    const date = dateStart(properties["公開日"]);
    const heading = title(properties["タイトル"]);
    const summary = richText(properties["要約"]);
    const body = richText(properties["本文"]).split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
    if (!validSlug(slug) || publicationTimestamp(date) === undefined || !heading || !summary || body.length === 0) {
      invalid += 1;
      return [];
    }
    if (!isPublishedBy(date, now)) return [];
    const category = select(properties["カテゴリ"]) as NotionNewsCategory;
    const edited = record(page).last_edited_time;
    const updatedAt = typeof edited === "string" && publicationTimestamp(edited) !== undefined && publicationTimestamp(edited)! >= publicationTimestamp(date)!
      ? edited : undefined;
    const linkLabel = richText(properties["リンクラベル"]);
    const linkHref = safeExternalUrl(url(properties["リンクURL"]));
    return [{
      slug, date, updatedAt,
      category: NEWS_CATEGORIES.includes(category) ? category : "お知らせ",
      title: heading, summary, body,
      link: linkLabel && linkHref ? { label: linkLabel, href: linkHref } : undefined,
    }];
  });
  const counts = new Map<string, number>();
  for (const article of articles) counts.set(article.slug, (counts.get(article.slug) ?? 0) + 1);
  const unique = articles.filter((article) => counts.get(article.slug) === 1);
  reportInvalid("news", invalid + articles.length - unique.length);
  return unique;
});

export const fetchSiteTexts = cache(async (): Promise<Record<string, string> | null> => {
  const pages = await queryAllPages({ data_source_id: SITE_TEXT_DATA_SOURCE_ID }, "site_texts");
  if (pages === null) return null;
  const entries = pages.flatMap((page) => {
    const properties = pageProperties(page);
    const key = title(properties["キー"]);
    const value = richText(properties["内容"]);
    return /^[a-z][a-z0-9_]*$/.test(key) && value ? [[key, value]] : [];
  });
  reportInvalid("site_texts", pages.length - entries.length);
  return Object.fromEntries(entries);
});
