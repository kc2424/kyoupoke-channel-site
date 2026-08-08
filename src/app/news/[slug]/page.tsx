import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WipeLink } from "@/components/wipe-link";
import { formatNewsDate, getAllNews, getNewsBySlug } from "@/content/news";
import { breadcrumbJsonLd, buildMetadata, newsArticleJsonLd } from "@/lib/seo";

const CONTAINER = "mx-auto w-full max-w-[900px] px-6 sm:px-10";

type Params = { slug: string };

// 記事はビルド時に全て静的生成する。
export function generateStaticParams(): Params[] {
  return getAllNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return buildMetadata({ title: "お知らせ" });

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const others = getAllNews()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <JsonLd
        data={newsArticleJsonLd({
          title: article.title,
          description: article.summary,
          date: article.date,
          path: `/news/${article.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "お知らせ", path: "/news" },
          { name: article.title, path: `/news/${article.slug}` },
        ])}
      />
      <SiteHeader />

      <main className="flex-1 pt-28 pb-20 sm:pt-36 lg:pt-44">
        <article className={CONTAINER}>
          <nav aria-label="パンくずリスト" className="text-xs text-neutral-500 lg:text-sm">
            <Link href="/" className="transition-colors hover:text-brand">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <Link href="/news" className="transition-colors hover:text-brand">
              お知らせ
            </Link>
          </nav>

          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white lg:text-xs">
              {article.category}
            </span>
            <time
              dateTime={article.date}
              className="text-xs font-bold text-neutral-500 lg:text-sm"
            >
              {formatNewsDate(article.date)}
            </time>
          </div>

          <h1 className="font-display mt-4 text-2xl leading-snug text-neutral-900 sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>

          <div className="mt-10 flex flex-col gap-6 border-t border-neutral-200 pt-10">
            {article.body.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-neutral-700 lg:text-lg lg:leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {article.link && (
            <WipeLink
              href={article.link.href}
              cursorLabel="OPEN"
              className="mt-10 lg:px-8 lg:py-4 lg:text-base"
            >
              {article.link.label}
            </WipeLink>
          )}

          <p className="mt-12 rounded-2xl bg-neutral-100 p-5 text-xs leading-relaxed text-neutral-600 lg:text-sm">
            本記事は非公式ファンサイトによるまとめです。日程・内容などの一次情報は
            今日ポケ公式のSNSおよびYouTubeチャンネルでの告知が優先されます。
          </p>

          {others.length > 0 && (
            <section className="mt-16 border-t border-neutral-200 pt-10">
              <h2 className="font-display text-xl text-neutral-900 lg:text-2xl">
                ほかのお知らせ
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/news/${other.slug}`}
                      className="group flex flex-col gap-1 rounded-xl border-2 border-neutral-200 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand hover:shadow-md sm:flex-row sm:items-center sm:gap-4"
                    >
                      <time
                        dateTime={other.date}
                        className="shrink-0 text-xs font-bold text-neutral-500"
                      >
                        {formatNewsDate(other.date)}
                      </time>
                      <span className="text-sm font-bold text-neutral-800 transition-colors duration-300 group-hover:text-brand lg:text-base">
                        {other.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            href="/news"
            className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
          >
            <span>←</span>
            お知らせ一覧に戻る
          </Link>
        </article>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
