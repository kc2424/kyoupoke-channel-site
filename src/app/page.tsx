const members = [
  {
    name: "バンビー",
    role: "MC / バランサー",
    text: "1998年2月10日生まれ、埼玉県出身。番組全体の進行を担うMC的存在。第7世代（SM）で史上初の2期連続最終1位、第9世代（SV）シーズン1で歴代最高レートの最終1位を獲得した実力者。",
  },
  {
    name: "いろは",
    role: "構築デザイナー / ムードメーカー",
    text: "1996年4月28日生まれ、愛知県出身。独自のパーティ構築から「構築デザイナー」と呼ばれる。2025年にはポケモンジャパンチャンピオンシップス（PJCS2025）・世界大会（WCS2025）出場権を獲得。",
  },
  {
    name: "くろこ",
    role: "理論派 / 最年少",
    text: "1999年5月28日生まれ、神奈川県出身。通算最終1位10回以上を誇る圧倒的な対戦理論の持ち主でありながら、動画内では謙虚な後輩キャラを貫くギャップが魅力。",
  },
];

const videos = [1, 2, 3];

const links = [
  { label: "YouTubeチャンネル", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X（旧Twitter）", href: "https://x.com/KYOUPOKEch" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-brand">今日ポケ</span>
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold tracking-wide text-white">
            FAN SITE
          </span>
        </div>
        <a
          href="https://www.youtube.com/@KYOUPOKE"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white transition hover:opacity-80"
        >
          YouTubeを見る
        </a>
      </header>

      <section
        className="relative flex flex-col items-center justify-center gap-4 overflow-hidden px-6 py-20 text-center"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #f4ede4 0 40px, #eee4d6 40px 80px)",
        }}
      >
        <h1 className="font-display text-5xl text-brand drop-shadow-sm sm:text-7xl">
          今日ポケ
        </h1>
        <p className="text-sm text-neutral-500">（旧称：今日の○○ポケチャンネル）</p>
        <p className="max-w-xl text-neutral-700">
          世界トップクラスの対戦理論と、笑えるバラエティ企画を届けるポケモン対戦YouTuberグループ。
        </p>
      </section>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16">
        <section id="profile">
          <h2 className="font-display text-3xl text-neutral-900">プロフィール</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            About
          </p>
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <p className="leading-relaxed text-neutral-700">
              「今日ポケ」は2021年8月8日に活動を開始した、『ポケットモンスター』シリーズの対戦（対戦競技シーン）を専門とする3人組YouTuberグループです。
              バンビー・いろは・くろこの3名は、いずれも世界トップクラスの対戦実績を持つプレイヤーでありながら、専門的な対戦理論の解説から視聴者を飽きさせないバラエティ企画まで幅広く発信しています。
            </p>
            <p className="mt-4 leading-relaxed text-neutral-700">
              2022年にはチャンネル登録者数10万人を達成し、YouTube Creator Awardsの銀の盾を受賞。
              現在はチャンネル登録者数 約58万人、総再生回数は10億回を超える規模まで成長しています。
            </p>
          </div>
        </section>

        <section id="members">
          <h2 className="font-display text-3xl text-neutral-900">メンバー紹介</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Members
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
              >
                <h3 className="font-display text-xl text-brand">{m.name}</h3>
                <p className="mt-1 text-sm font-bold text-neutral-500">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="videos">
          <h2 className="font-display text-3xl text-neutral-900">おすすめ動画</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Videos
          </p>
          {/* TODO: 動画IDを実際のおすすめ動画のIDに差し替えてください */}
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {videos.map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200"
              >
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title={`おすすめ動画${n}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="p-3 text-sm text-neutral-500">
                  おすすめ動画{n}（TODO: タイトルを書き換えてください）
                </p>
              </div>
            ))}
          </div>
          <a
            href="https://www.youtube.com/@KYOUPOKE"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-80"
          >
            チャンネルの動画をもっと見る
          </a>
        </section>

        <section id="links">
          <h2 className="font-display text-3xl text-neutral-900">リンク</h2>
          <p className="mt-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Links
          </p>
          {/* TODO: Instagram・TikTokの正式なURLが分かったら差し替えてください */}
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-800 transition hover:border-brand hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white py-8 text-center text-sm text-neutral-500">
        <p>このページは非公式のファンサイトです。今日ポケの活動を応援しています。</p>
      </footer>
    </div>
  );
}
