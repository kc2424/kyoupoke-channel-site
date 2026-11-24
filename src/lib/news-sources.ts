import { isPublishedBy } from "./content-validation";
import type { NewsSourceArticle } from "./sync-news";
import { CHANNEL_ID, parseChannelVideos, readFeedText } from "./youtube";

const TV_CHANNEL = "UCDqvZvUgRq5RRmy_zZd5Yaw"; // 有吉ぃぃeeeee！【公式】
const TOURNAMENT_CHANNEL = "UCVpaaZ-p7GTTFEDR_NCnfNg"; // 成人男性三人組 Official
const FIRST_DAY = "2026-08-21"; // 8月20日までのお知らせは編集部が掲載済み。
const feedUrl = (id: string) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
const videoLink = (id: string) => ({ label: "公式YouTubeで見る", href: `https://www.youtube.com/watch?v=${id}` });
// Slugs must be lowercase. Keep case-sensitive YouTube IDs distinct.
const videoSlug = (id: string) => "youtube-" + Array.from(id, c => c.charCodeAt(0).toString(16)).join("");
function namedMember(text: string) {
  if (/今日ポケ|KYOUPOKE/i.test(text)) return "今日ポケ";
  const winningTeam = /チーム(くろこ|バンビー|いろは)[」』]?が(?:見事)?優勝/.exec(text);
  if (winningTeam) return winningTeam[1];
  if (/バンビー(?:さん|選手|先生|構築|が|と|の)|@bannbee__/i.test(text)) return "バンビー";
  if (/くろこ(?:さん|選手|先生|構築)|@shar_poke/i.test(text)) return "くろこ";
  if (/いろは(?:さん|選手|先生|構築)|@ir_poke\b/i.test(text)) return "いろは";
}
const milestoneSlug = (amount: string) => `channel-subscribers-${Math.round(parseFloat(amount) * 10_000)}`;

function japanDay(iso: string) {
  return new Date(Date.parse(iso) + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// These reports predate the sync. Feed windows are short, so fill missing articles
// once from the verified original reports. Existing pages take priority on later runs.
const historical: NewsSourceArticle[] = [
  {
    slug: "reject-11250", date: "2026-08-28", category: "イベント",
    title: "いろは、ポケモンWCS2026に2年連続で出場",
    summary: "REJECTが、いろはの世界大会出場を発表しました。出場部門は「Pokémon Champions」です。",
    body: ["ポケモンワールドチャンピオンシップス2026は、現地時間8月28日から30日にサンフランシスコで開催。REJECTは、いろはが6月の日本大会で出場権を獲得し、2025年に続く世界大会出場を決めた経緯を紹介しています。"],
    link: { label: "REJECTの発表を読む", href: "https://prtimes.jp/main/html/rd/p/000000634.000050979.html" },
  },
  {
    slug: videoSlug("nBRTyGwEZ2w"), date: "2026-09-26", category: "イベント",
    title: "いろはとビエラ、第4回「SEIDΔNTHEM.」の実況・解説を担当",
    summary: "成人男性三人組が主催する「Pokémon Champions」のシングル大会で、いろはとビエラが本選の実況・解説を担当しました。",
    body: ["本選の模様は成人男性三人組の公式YouTubeで配信されました。対戦と実況・解説は主催者のアーカイブで視聴できます。"],
    link: videoLink("nBRTyGwEZ2w"),
  },
  {
    slug: milestoneSlug("70万人"), date: "2026-09-30", category: "お知らせ",
    title: "今日ポケch.、登録者70万人を報告",
    summary: "今日ポケが公式Xでチャンネル登録者70万人を報告し、視聴者に感謝を伝えました。",
    body: ["9月30日、今日ポケはYouTubeチャンネルの登録者数が70万人に達したことを公式Xでファンに報告しました。"],
    link: { label: "今日ポケ公式Xの投稿を見る", href: "https://x.com/KYOUPOKEch/status/2105273704456630280" },
  },
  {
    slug: videoSlug("BraIOg7l2R0"), date: "2026-10-29", category: "メディア",
    title: "今日ポケの3人が宮城県蔵王町を訪問",
    summary: "今日ポケが「なんもしない合宿」の動画を公開。宮城県蔵王町で3人が食や体験を楽しむPR企画です。",
    body: ["今日ポケの公式YouTubeに蔵王町を訪ねた動画が公開されました。概要欄では町の公式サイトとガイドブックも紹介されています。"],
    link: videoLink("BraIOg7l2R0"),
  },
  {
    slug: videoSlug("HozUF2gTvXc"), date: "2026-11-16", category: "メディア",
    title: "「タカトシぃぃeeeee！」でトシがいろはのルカリオ・カイリュー構築に挑戦",
    summary: "番組公式YouTubeが「ポケモンチャンピオンズ」企画の第21弾を公開しました。",
    body: ["第21弾ではトシが、いろはのルカリオとカイリューを軸にしたチームと対戦。試合の模様は、番組公式YouTubeで視聴できます。"],
    link: videoLink("HozUF2gTvXc"),
  },
];

// Keep the verified Japanese copy while the corresponding publisher metadata
// still supports it. A corrected title is taken from the ongoing feed.
function verifiedCopy(slug: string, title: string, intro = "") {
  const checks: Record<string, boolean> = {
    "reject-11250": title.includes("いろは") && title.includes("ワールドチャンピオンシップス2026") && title.includes("部門に出場"),
    [videoSlug("nBRTyGwEZ2w")]: title.includes("SEIDΔNTHEM") && intro.includes("いろは") && intro.includes("ビエラ"),
    [videoSlug("BraIOg7l2R0")]: title.includes("なんもしない合宿") && intro.includes("蔵王町") && /#PR/i.test(intro),
    [videoSlug("HozUF2gTvXc")]: title.includes("ルカリオ×カイリュー") && title.includes("いろは構築") && intro.includes("第21弾"),
  };
  return checks[slug] ? historical.find(article => article.slug === slug) : undefined;
}

function subscriberMilestone(text: string) {
  // Only completed milestones for this channel; questions, targets and
  // countdowns belong in the ordinary video/social feed.
  const line = text.normalize("NFKC").trim().split("\n")[0];
  if (/[?？]|目標|目指|目前|したい|間近|するまで|したら|してない|していない/.test(line)) return;
  return /^(?:【[^】]{1,12}】\s*)?(?:今日ポケ(?:ch\.?)?[の、はが\s]*)?(?:チャンネル)?登録者(?:数)?[がは:\s]*(\d{1,4}(?:\.\d)?万人)[を\s]*(?:突破|達成|到達)(?:しました|しましたよ|したよ)?(?=$|[!！。、🎉\s])/u.exec(line)?.[1];
}

function videoArticle(id: string, entry: ReturnType<typeof parseChannelVideos>[number]): NewsSourceArticle | undefined {
  const { videoId, title, description, publishedAt } = entry;
  const date = japanDay(publishedAt);
  if (date < FIRST_DAY) return;
  const common = { slug: videoSlug(videoId), date, link: videoLink(videoId) };
  // A description often contains the full channel biography, old tournament results,
  // and merch links. Select on the episode title and its own short introduction.
  const intro = description.split(/^-{4,}|^🛒|^過去の|^出演者：/m)[0].slice(0, 500);
  const verified = verifiedCopy(common.slug, title, intro);
  if (verified) return { ...verified, ...common };
  if (id === CHANNEL_ID) {
    const milestone = subscriberMilestone(title);
    if (milestone) return {
      ...common, slug: milestoneSlug(milestone), category: "お知らせ", title: `今日ポケch.、登録者${milestone}を報告`,
      summary: `今日ポケが公式動画でチャンネル登録者${milestone}を報告しました。`,
      body: [`チャンネルからの報告は「${title}」で視聴できます。`],
    };
    if (!/(?:^|[\s　])(?:[#＃]PR(?:$|[\s　])|提供[：:]\s*\S)/im.test(intro)) return;
    return { ...common, category: "メディア", title, summary: "今日ポケが公式YouTubeでPR企画を公開しました。", body: [`今日ポケのPR企画「${title}」が公開されました。企画の映像や提供情報は公式動画で確認できます。`] };
  }
  if (id === TV_CHANNEL) {
    if (!title.includes("タカトシぃぃ") || !/ポケモンチャンピオンズ|Pokémon Champions/i.test(title + intro) || !namedMember(title + "\n" + intro)) return;
    const episode = /第[0-9０-９]+弾/.exec(intro)?.[0] ?? "";
    const subject = namedMember(title + "\n" + intro);
    return { ...common, category: "メディア", title: episode ? `${subject}を取り上げた「タカトシぃぃeeeee！」ポケモン対戦企画${episode}` : title,
      summary: `番組公式YouTubeが、${subject}を取り上げた「ポケモンチャンピオンズ」の対戦企画を公開しました。`,
      body: [`公開された動画は「${title}」。試合の模様は番組公式YouTubeで視聴できます。`] };

  }
  if (!/SEID[ΔA]NTHEM/i.test(title) || !/ポケモン|Pokémon/i.test(title + intro) || !namedMember(title + "\n" + intro)) return;
  return { ...common, category: "イベント", title, summary: "成人男性三人組が、今日ポケのメンバーに関連する大会配信を公式チャンネルで公開しました。", body: [`主催者の公式チャンネルで「${title}」が配信されています。対戦の模様は公式配信で確認できます。`] };
}

async function requestText(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000), cache: "no-store", redirect: "error" });
  return readFeedText(res);
}

async function getVideos(id: string) {
  const entries = parseChannelVideos(await requestText(feedUrl(id)), id);
  return entries.flatMap(entry => videoArticle(id, entry) ?? []);
}

async function getReject(): Promise<NewsSourceArticle[]> {
  const url = new URL("https://reject.jp/wp-json/wp/v2/posts");
  url.search = new URLSearchParams({ search: "今日ポケ", after: FIRST_DAY + "T00:00:00", per_page: "100", _fields: "id,date_gmt,link,title" }).toString();
  const posts: unknown = JSON.parse(await requestText(url.href));
  if (!Array.isArray(posts)) throw new Error("invalid_reject_feed");
  return posts.flatMap((post): NewsSourceArticle[] => {
    const title = post?.title?.rendered;
    const iso = `${post?.date_gmt}Z`;
    if (!Number.isSafeInteger(post?.id) || post.id <= 0 || typeof title !== "string" || !title.trim() || !isPublishedBy(iso) ||
        !namedMember(title) || !/今日ポケ|KYOUPOKE|ポケモン|Pokémon|REJECT杯/i.test(title) ||
        typeof post.link !== "string" || !/^https:\/\/reject\.jp\/\d{4}\/\d{2}\/\d{2}\//.test(post.link)) return [];
    if (japanDay(iso) < FIRST_DAY) return [];
    const verified = verifiedCopy(`reject-${post.id}`, title);
    if (verified) return [{ ...verified, date: japanDay(iso), link: { ...verified.link, href: post.link } }];
    return [{
      slug: `reject-${post.id}`, date: japanDay(iso), category: /大会|選手権|チャンピオンシップス/.test(title) ? "イベント" : "お知らせ",
      title, summary: "REJECTが今日ポケに関する情報を公式サイトで発表しました。",
      body: [`REJECTによる発表の見出しは「${title}」です。詳細はREJECTの公式記事で確認できます。`],
      link: { label: "REJECTの発表を読む", href: post.link },
    }];
  });
}

async function getMilestonePosts(token: string): Promise<NewsSourceArticle[]> {
  const headers = { Authorization: `Bearer ${token}` };
  const account = JSON.parse(await requestText("https://api.x.com/2/users/by/username/KYOUPOKEch", headers)).data;
  if (typeof account?.id !== "string" || !/^\d+$/.test(account.id) || account.username?.toLowerCase() !== "kyoupokech") throw new Error("invalid_x_user");
  const json = JSON.parse(await requestText(`https://api.x.com/2/users/${account.id}/tweets?exclude=retweets,replies&max_results=25&tweet.fields=created_at,author_id`, headers));
  if (json.meta?.result_count === 0) return [];
  if (!Array.isArray(json.data)) throw new Error("invalid_x_timeline");
  return json.data.flatMap((post: { id: string; text: string; created_at: string; author_id: string }): NewsSourceArticle[] => {
    if (post.author_id !== account.id || typeof post.text !== "string" || !/^\d+$/.test(post.id) || !isPublishedBy(post.created_at)) return [];
    const milestone = subscriberMilestone(post.text);
    if (!milestone || japanDay(post.created_at) < FIRST_DAY) return [];
    return [{
      slug: milestoneSlug(milestone), date: japanDay(post.created_at), category: "お知らせ",
      title: `今日ポケch.、登録者${milestone}を報告`, summary: `今日ポケが公式Xでチャンネル登録者${milestone}を報告しました。`,
      body: [`登録者${milestone}についての発表は、今日ポケの公式Xで確認できます。`],
      link: { label: "今日ポケ公式Xの投稿を見る", href: `https://x.com/KYOUPOKEch/status/${post.id}` },
    }];
  });
}

export async function fetchOfficialNews(): Promise<{ articles: NewsSourceArticle[]; failedSources: string[] }> {
  const sources = [
    { name: "youtube-kyoupoke", run: () => getVideos(CHANNEL_ID) },
    { name: "youtube-tv-tokyo", run: () => getVideos(TV_CHANNEL) },
    { name: "youtube-seidan", run: () => getVideos(TOURNAMENT_CHANNEL) },
    { name: "reject", run: getReject },
  ];
  const token = process.env.X_BEARER_TOKEN;
  if (token) sources.push({ name: "x-kyoupoke", run: () => getMilestonePosts(token) });
  const results = await Promise.allSettled(sources.map(source => source.run()));
  const articles = new Map<string, NewsSourceArticle>();
  for (const article of historical) {
    if (isPublishedBy(article.date)) articles.set(article.slug, { ...article, initialOnly: true });
  }
  const failedSources: string[] = [];
  for (const [i, result] of results.entries()) {
    if (result.status === "rejected") { failedSources.push(sources[i].name); continue; }
    for (const article of result.value) {
      const existing = articles.get(article.slug);
      if (article.slug.startsWith("channel-subscribers-") && existing && existing.date < article.date) continue;
      articles.set(article.slug, article);
    }
  }
  return { articles: [...articles.values()].sort((a, b) => b.date.localeCompare(a.date)), failedSources };
}
