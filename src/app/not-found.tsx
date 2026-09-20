import Link from "next/link";
import type { Metadata } from "next";

import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex flex-1 items-center px-6 pt-28 pb-20 sm:px-10 sm:pt-36">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-neutral-200 bg-neutral-100 p-8 sm:p-12">
          <p className="text-sm font-black tracking-widest text-brand-dark uppercase">404 / Not Found</p>
          <h1 className="font-display mt-4 text-3xl leading-tight text-neutral-900 sm:text-5xl">
            ページが見つかりません
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-neutral-600">
            URLが変更されたか、ページが公開されていない可能性があります。
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            トップページへ戻る
          </Link>
        </div>
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </div>
  );
}
