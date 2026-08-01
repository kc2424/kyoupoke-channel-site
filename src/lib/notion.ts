import { Client } from "@notionhq/client";

const MEMBERS_DATA_SOURCE_ID = "bae6dc6b-1a16-4dab-bc29-17e07e8dcdb2";
const ACHIEVEMENTS_DATA_SOURCE_ID = "e680e416-6833-4a4a-be31-800cb2f57208";
const STATS_DATA_SOURCE_ID = "777541f2-088b-460b-9bfe-9b8b8308e6aa";
const VIDEOS_DATA_SOURCE_ID = "70745038-6c0e-41bc-8307-e2c456676d02";
const LINKS_DATA_SOURCE_ID = "6b2c8532-e222-44b8-a5ac-bfba572411ee";
const SITE_TEXT_DATA_SOURCE_ID = "a816d703-edc6-42ab-a2fe-58a35d7c48b6";

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

type Properties = Record<string, unknown>;

function richText(prop: unknown): string {
  const p = prop as { rich_text?: { plain_text: string }[] } | undefined;
  return p?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

function title(prop: unknown): string {
  const p = prop as { title?: { plain_text: string }[] } | undefined;
  return p?.title?.map((t) => t.plain_text).join("") ?? "";
}

function number(prop: unknown): number {
  const p = prop as { number?: number | null } | undefined;
  return p?.number ?? 0;
}

function checkbox(prop: unknown): boolean {
  const p = prop as { checkbox?: boolean } | undefined;
  return p?.checkbox ?? false;
}

function select(prop: unknown): string {
  const p = prop as { select?: { name: string } | null } | undefined;
  return p?.select?.name ?? "";
}

function url(prop: unknown): string {
  const p = prop as { url?: string | null } | undefined;
  return p?.url ?? "";
}

function pageProperties(page: unknown): Properties {
  return (page as { properties: Properties }).properties;
}

function parseMilestones(raw: string): { period: string; text: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [period, ...rest] = line.split("|");
      return { period: period?.trim() ?? "", text: rest.join("|").trim() };
    })
    .filter((m) => m.period && m.text);
}

function getClient(): Client | null {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
}

// ステータスが「公開中」のメンバーのみ、サイト表示用の形式で返す。
// Notion未接続（トークン未設定）の場合は null を返し、呼び出し側でフォールバックさせる。
export async function fetchPublishedMembers(): Promise<NotionMember[] | null> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: MEMBERS_DATA_SOURCE_ID,
    filter: {
      property: "ステータス",
      select: { equals: "公開中" },
    },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const properties = pageProperties(page);
    const tagsRaw = richText(properties["タグ"]);
    const photoPath = richText(properties["写真パス"]);
    return {
      name: title(properties["名前"]),
      role: richText(properties["キャッチコピー"]),
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      text: richText(properties["プロフィール文"]),
      photo: photoPath || undefined,
      milestones: parseMilestones(richText(properties["沿革"])),
    };
  });
}

export async function fetchAchievements(): Promise<NotionAchievement[] | null> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: ACHIEVEMENTS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const properties = pageProperties(page);
    return {
      label: title(properties["見出し"]),
      sub: richText(properties["補足"]),
      tone: select(properties["トーン"]) === "ブランド色" ? "brand" : "black",
    };
  });
}

export async function fetchStats(): Promise<NotionStat[] | null> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: STATS_DATA_SOURCE_ID,
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const properties = pageProperties(page);
    return {
      value: number(properties["数値"]),
      decimals: number(properties["小数桁"]),
      suffix: richText(properties["接尾語"]),
      label: title(properties["ラベル"]),
    };
  });
}

export async function fetchVideos(): Promise<NotionVideo[] | null> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: VIDEOS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  return response.results.map((page, index) => {
    const properties = pageProperties(page);
    return {
      id: index + 1,
      videoId: richText(properties["YouTube動画ID"]),
      title: title(properties["タイトル"]),
    };
  });
}

export async function fetchLinks(): Promise<
  { mainLinks: NotionLink[]; memberLinks: NotionLink[] } | null
> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: LINKS_DATA_SOURCE_ID,
    filter: { property: "公開", checkbox: { equals: true } },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  const links = response.results.map((page) => {
    const properties = pageProperties(page);
    return {
      kind: select(properties["種別"]),
      label: title(properties["ラベル"]),
      sub: richText(properties["補足"]),
      href: url(properties["URL"]),
      icon: (select(properties["アイコン"]) || "User") as NotionLinkIcon,
    };
  });

  return {
    mainLinks: links.filter((l) => l.kind === "メインリンク"),
    memberLinks: links.filter((l) => l.kind === "メンバーチャンネル"),
  };
}

// キー・値形式の単発テキスト（ヒーローのキャッチコピーなど）をまとめて取得する。
export async function fetchSiteTexts(): Promise<Record<string, string> | null> {
  const notion = getClient();
  if (!notion) return null;

  const response = await notion.dataSources.query({
    data_source_id: SITE_TEXT_DATA_SOURCE_ID,
  });

  const entries = response.results.map((page) => {
    const properties = pageProperties(page);
    return [title(properties["キー"]), richText(properties["内容"])] as const;
  });

  return Object.fromEntries(entries);
}
