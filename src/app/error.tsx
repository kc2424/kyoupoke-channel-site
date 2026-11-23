"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ui] ページ表示失敗", { digest: error.digest });
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center bg-white px-6 py-20 sm:px-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border-2 border-neutral-200 bg-neutral-100 p-8 sm:p-12">
        <p className="text-sm font-black tracking-widest text-brand-dark uppercase">Error</p>
        <h1 className="font-display mt-4 text-3xl leading-tight text-neutral-900 sm:text-5xl">
          ページを表示できませんでした
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-neutral-600">
          一時的な問題が発生しています。時間をおいて、もう一度お試しください。
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-brand-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
