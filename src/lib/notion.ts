import { Client } from "@notionhq/client";

const MEMBERS_DATA_SOURCE_ID = "bae6dc6b-1a16-4dab-bc29-17e07e8dcdb2";

export type NotionMember = {
  name: string;
  role: string;
  tags: string[];
  text: string;
  photo?: string;
  milestones: { period: string; text: string }[];
};

function richText(prop: unknown): string {
  const p = prop as { rich_text?: { plain_text: string }[] } | undefined;
  return p?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

function title(prop: unknown): string {
  const p = prop as { title?: { plain_text: string }[] } | undefined;
  return p?.title?.map((t) => t.plain_text).join("") ?? "";
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

// ステータスが「公開中」のメンバーのみ、サイト表示用の形式で返す。
// Notion未接続（トークン未設定）の場合は null を返し、呼び出し側でフォールバックさせる。
export async function fetchPublishedMembers(): Promise<NotionMember[] | null> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;

  const notion = new Client({ auth: token });

  const response = await notion.dataSources.query({
    data_source_id: MEMBERS_DATA_SOURCE_ID,
    filter: {
      property: "ステータス",
      select: { equals: "公開中" },
    },
    sorts: [{ property: "表示順", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const properties = (page as { properties: Record<string, unknown> }).properties;
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
