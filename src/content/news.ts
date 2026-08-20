// お知らせ/ニュースのデータソース。
// NotionのDB(お知らせ)を優先して取得し、未接続または0件のときだけ
// このファイル内のfallbackArticlesを表示する。

import { fetchNews } from "@/lib/notion";

export type NewsCategory = "お知らせ" | "イベント" | "メディア" | "動画";

export type NewsArticle = {
  /** URLに使うスラッグ。半角英数とハイフンのみ。 */
  slug: string;
  /** 公開日。YYYY-MM-DD形式。並び順とSEOの日付表記に使う。 */
  date: string;
  category: NewsCategory;
  title: string;
  /** 一覧・OGPで使う1〜2文の要約。 */
  summary: string;
  /** 詳細ページの本文。1要素が1段落として描画される。 */
  body: string[];
  /** 任意の外部リンク（該当の動画やイベントページなど）。 */
  link?: { label: string; href: string };
};

const fallbackArticles: NewsArticle[] = [
  {
    slug: "kyoupoke-gym-2026",
    date: "2026-07-20",
    category: "イベント",
    title: "KYOUPOKE GYM 開催のお知らせ",
    summary:
      "今日ポケが主催する対戦イベント「KYOUPOKE GYM」の開催情報をまとめました。参加方法は公式X/YouTubeの告知をご確認ください。",
    body: [
      "今日ポケが主催する対戦イベント「KYOUPOKE GYM」に関する情報をまとめています。イベントの日程・会場・参加方法などの一次情報は、必ず今日ポケ公式のXアカウントおよびYouTubeチャンネルでの告知をご確認ください。",
      "本サイトは非公式のファンサイトのため、掲載内容は公式発表を後から追記したものです。最新の情報や変更については公式の告知が優先されます。",
    ],
    link: {
      label: "公式Xで最新情報を見る",
      href: "https://x.com/KYOUPOKEch",
    },
  },
  {
    slug: "wcs-2025-report",
    date: "2026-06-02",
    category: "メディア",
    title: "いろは選手のWCS出場を振り返る",
    summary:
      "いろは選手がポケモンジャパンチャンピオンシップス・世界大会の出場権を獲得した流れを、公開されている情報をもとに整理しました。",
    body: [
      "いろは選手はポケモンジャパンチャンピオンシップス（PJCS）を経て世界大会（WCS）の出場権を獲得しました。構築の考え方や当日の立ち回りについては、チャンネル内の振り返り動画で本人が詳しく解説しています。",
      "本ページはファンによるまとめです。試合結果や大会レギュレーションの正確な情報は、株式会社ポケモンの公式大会ページをご確認ください。",
    ],
    link: {
      label: "チャンネルで振り返り動画を見る",
      href: "https://www.youtube.com/@KYOUPOKE",
    },
  },
  {
    slug: "fansite-renewal",
    date: "2026-05-11",
    category: "お知らせ",
    title: "ファンサイトをリニューアルしました",
    summary:
      "セクションをカード単位で並べ直し、スマートフォンでの読みやすさとページの表示速度を改善しました。",
    body: [
      "トップページの構成を見直し、プロフィール・最新動画・SNS・お知らせをカード単位で並べるレイアウトに変更しました。スマートフォンでの縦スクロール時に情報の区切りが分かりやすくなっています。",
      "あわせて動画の埋め込みを遅延読み込みに変更し、初回表示時に読み込む量を減らしました。",
    ],
  },
  {
    slug: "silver-play-button",
    date: "2026-04-08",
    category: "お知らせ",
    title: "チャンネル登録者数に関する記録まとめ",
    summary:
      "銀の盾（登録者10万人）の受賞から現在までの、公開されている登録者数・再生回数の推移をまとめています。",
    body: [
      "今日ポケは2022年にチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞しました。その後も規模を伸ばし、現在は登録者数およそ67万人、総再生回数は12億回を超えています。",
      "数値はYouTube上の公開情報を参照しており、更新のタイミングによって実際の数値とずれる場合があります。",
    ],
  },
  {
    slug: "reject-cup-hajimari-no-oja-2026",
    date: "2026-08-20",
    category: "イベント",
    title: "「はじまりの王者決定戦 REJECT杯」本日18:30開幕",
    summary:
      "REJECT主催のPokémon Champions大会「はじまりの王者決定戦 REJECT杯」が本日18:30より開幕。4チーム・総勢12名のトレーナーが「はじまりの王者」の座を争います。",
    body: [
      "REJECT公式Xより、Pokémon Champions大会「はじまりの王者決定戦 REJECT杯」の開幕告知がありました。本日18:30より開幕予定で、4チーム・総勢12名のトレーナーが参加し、「はじまりの王者」の座を争う大会です。",
      "公式の本配信はREJECTのYouTubeチャンネルで行われ、投稿ツリーにはトーナメント表とルールが掲載されています。詳細な組み合わせやルールなど最新の一次情報は、必ず公式Xの投稿をご確認ください。",
      "本サイトは非公式のファンサイトのため、掲載内容は公式発表を要約したものです。最新情報や変更点については公式の告知が優先されます。",
    ],
    link: {
      label: "REJECT公式Xで詳細を見る",
      href: "https://x.com/rc_reject/status/2090272619471806523",
    },
  },
  {
    slug: "reject-cup-kyoupoke-shichou-annai-2026",
    date: "2026-08-20",
    category: "動画",
    title: "REJECT杯、バンビー視点・くろこ視点の視聴案内",
    summary:
      "「はじまりの王者決定戦 REJECT杯」開幕にあわせ、今日ポケよりバンビー視点・くろこ視点のYouTubeライブ視聴案内が届きました。公式本配信とあわせてお楽しみください。",
    body: [
      "「はじまりの王者決定戦 REJECT杯」の開幕にあわせて、今日ポケ公式Xよりバンビー視点・くろこ視点それぞれのYouTubeライブ視聴案内が投稿されました。公式の本配信とは別に、両者の個人視点で大会の様子を視聴できます。",
      "各配信の詳細やURLは、今日ポケ公式X・YouTubeチャンネルの投稿をご確認ください。",
      "本サイトは非公式のファンサイトのため、掲載内容は公式発表を要約したものです。最新情報や変更点については公式の告知が優先されます。",
    ],
    link: {
      label: "今日ポケ公式Xで詳細を見る",
      href: "https://x.com/kyoupokech/status/2090372070018605480",
    },
  },
];

/** 新しい順に並べたお知らせ一覧を返す。Notion未接続/0件時はfallbackArticlesを使う。 */
export async function getAllNews(): Promise<NewsArticle[]> {
  const notionNews = await fetchNews();
  const articles = notionNews && notionNews.length > 0 ? notionNews : fallbackArticles;
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

/** トップページのお知らせ抜粋で使う、先頭 limit 件。 */
export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  return (await getAllNews()).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  return (await getAllNews()).find((a) => a.slug === slug);
}

/** 「2026年7月20日」のような日本語表記に整形する。 */
export function formatNewsDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}
