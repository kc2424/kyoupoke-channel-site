import type { NewsArticle } from "../content/news";
import type { NotionAchievement } from "./notion";
import { isPublishedBy } from "./content-validation";

type AchievementCard = NotionAchievement & { source?: { href: string; label: string } };

function normalized(value: string) {
  return value.normalize("NFKC").replace(/[\s,，]/g, "");
}

function milestoneCount(text: string) {
  const match = /登録者(?:数)?[はが:]?(\d+(?:\.\d+)?)(万)?人/.exec(normalized(text));
  return match ? Math.round(Number(match[1]) * (match[2] ? 10_000 : 1)) : undefined;
}

function officialHref(article: NewsArticle) {
  try {
    const url = new URL(article.link?.href ?? "");
    return url.protocol === "https:" && !url.username && !url.password && !url.port ? url : undefined;
  } catch { return; }
}

function sameCup(text: string, article: NewsArticle, winner: string) {
  if (!text.includes("REJECT杯") || !text.includes("優勝")) return false;
  if (/いろは|くろこ|バンビー/.test(text) && !text.includes(winner)) return false;
  const edition = /第[0-9]+回/.exec(normalized(article.title))?.[0];
  const previousEdition = /第[0-9]+回/.exec(text)?.[0];
  if (edition && previousEdition) return edition === previousEdition;
  const date = /(\d{4})[年/\-](\d{1,2})(?:月|[/\-])(\d{1,2})?/.exec(text);
  if (date) {
    const [year, month, day] = article.date.slice(0, 10).split("-").map(Number);
    return Number(date[1]) === year && Number(date[2]) === month && (!date[3] || Number(date[3]) === day);
  }
  return text.includes(normalized(article.title));
}

/** 公開済みの確定ニュースからだけ生成する。非公開を含む手動カードとの重複は表示しない。 */
export function achievementCards(
  published: NotionAchievement[], reserved: NotionAchievement[], news: NewsArticle[],
): AchievementCard[] {
  const claimed = [...published, ...reserved].map(card => normalized(card.label + " " + card.sub));
  const generated: AchievementCard[] = [];
  for (const article of news) {
    const url = officialHref(article);
    if (!url || !isPublishedBy(article.date)) continue;
    const count = milestoneCount(article.title);
    const milestone = /^今日ポケch\.、登録者(\d+(?:\.\d+)?万人)を報告$/.exec(article.title);
    const source = { href: url.href, label: "公式発表を見る" };
    let label: string;
    if (milestone && count && article.slug === `auto-channel-subscribers-${count}` &&
        ((url.hostname === "x.com" && /^\/KYOUPOKEch\/status\/\d+$/i.test(url.pathname)) ||
         (url.hostname === "www.youtube.com" && url.pathname === "/watch" && /^[A-Za-z0-9_-]{11}$/.test(url.searchParams.get("v") ?? "")))) {
      if (claimed.some(text => milestoneCount(text) === count)) continue;
      label = `チャンネル登録者${milestone[1]}`;
    } else {
      // REJECT's own cup, an identified winner, and a completed victory.
      // Announcements, interviews with winners, predictions and placements stay as news.
      const winner = /(?:チーム)?(いろは|くろこ|バンビー)(?:選手|チーム)?[」』]?が(?:見事)?優勝(?:しました|を果たしました)?[!！。]*$/.exec(article.title);
      if (!winner || !article.title.includes("REJECT杯") || !/^auto-reject-\d+$/.test(article.slug) ||
          url.hostname !== "reject.jp" || !/^\/\d{4}\/\d{2}\/\d{2}\//.test(url.pathname)) continue;
      if (claimed.some(text => sameCup(text, article, winner[1]))) continue;
      label = article.title;
    }
    claimed.push(normalized(label + article.date));
    generated.push({ label, sub: `${article.date.slice(0, 10).replaceAll("-", "/")} 発表`, tone: "brand", source });
  }
  return [...generated, ...published];
}
