import Link from "next/link";
import type { Metadata } from "next";

import { FadeIn } from "@/components/fade-in";
import { JsonLd } from "@/components/json-ld";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatNewsDate, getAllNews } from "@/content/news";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const CONTAINER = "mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16";

// Notion側の公開/非公開切り替えを反映するため、トップページと同じ間隔で再取得する。
export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "お知らせ",
  description:
    "今日ポケ ファンサイトのお知らせ一覧。イベント・メディア出演・サイト更新などの情報をまとめています。",
  path: "/news",
});

export default async function NewsIndexPage() {
  const news = await getAllNews();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "お知らせ", path: "/news" },
        ])}
      />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 pt-28 pb-20 sm:pt-36 lg:pt-44">
        <div className={CONTAINER}>
          <nav aria-label="パンくずリスト" className="text-xs text-neutral-500 lg:text-sm">
            <Link href="/" className="transition-colors hover:text-brand-dark">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-800">お知らせ</span>
          </nav>

          <p className="mt-6 text-xs font-bold tracking-widest text-neutral-600 uppercase lg:text-sm">
            News
          </p>
          <h1 className="font-display mt-2 text-3xl text-neutral-900 sm:text-4xl lg:text-5xl">
            お知らせ
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 lg:text-base">
            ファンサイトからのお知らせと、公開情報をもとにまとめた今日ポケの動きを掲載しています。
            一次情報は必ず公式のSNS・YouTubeチャンネルをご確認ください。
          </p>

          {news.length === 0 && (
            <p className="mt-12 rounded-2xl bg-neutral-100 p-6 text-sm leading-relaxed text-neutral-700">
              現在、公開中のお知らせはありません。
            </p>
          )}
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((article, i) => (
              <li key={article.slug} className="h-full">
                <FadeIn delay={i * 0.08} className="h-full">
                  <Link
                    href={`/news/${article.slug}`}
                    data-cursor-label="READ"
                    className={cn(
                      "group flex h-full flex-col rounded-2xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 ease-out",
                      "hover:-translate-y-1.5 hover:border-brand hover:shadow-lg focus-visible:-translate-y-1.5 focus-visible:border-brand focus-visible:outline-none"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-brand-dark px-3 py-1 text-[11px] font-bold text-white lg:text-xs">
                        {article.category}
                      </span>
                      <time
                        dateTime={article.date}
                        className="text-xs font-bold text-neutral-500 lg:text-sm"
                      >
                        {formatNewsDate(article.date)}
                      </time>
                    </div>
                    <h2 className="font-display mt-4 text-lg leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-brand-dark lg:text-xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                      {article.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                      詳しく見る
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
