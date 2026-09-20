# Cloudflare試験公開・引き継ぎ

更新日: 2026-09-21 JST。

## 監査改善ブランチの状況（2026-09-21、公開済み）

作業ブランチ `codex/site-audit-remediation` の改善を両公開先へ反映済み。Cloudflare versionは `13aeb2cb-282a-4ca1-9430-967966fc66c3`。検索除外とVercel canonicalを維持。Vercel本番deploymentは `dpl_7QuJ3Uefd9ZJV66GzyyfDht5DEbh`。

単体テスト12件、両ビルド、Wrangler dry-run、両環境のブラウザ回帰テスト24件、独立CheckerがPASS。[CI結果](https://github.com/kc2424/kyoupoke-channel-site/actions/runs/35544119290)。公開URLのトップ・一覧・記事・画像も確認済み。`main` は未変更で、VercelはCLIから直接公開しています。

- Next.js 16.3.5、React / React DOM / React Server Components 19.2.8、vinext 1.0.0-beta.10、`@vinext/cloudflare` 1.0.0-beta.8、Cloudflare Vite plugin 1.54.9、Wrangler 4.131.2を使用。
- 画像はSharpでレスポンシブWebPを事前生成し、`src/data/image-manifest.json` を通じてVercelとCloudflareの双方から同じファイルを配信する。Cloudflare Imagesへの依存はない。原本のブランド素材は保持する。
- 日本語はシステムフォント、英字ワードマークだけModakを使用する。
- `npm run check:quality` が依存監査、lint、単体テスト、Next.js / vinext両ビルド、Wrangler dry-runを直列実行する。PlaywrightはNext.jsとCloudflareの両サーバーを対象にし、GitHub Actionsでも同じ検証を行う。
- `CONTACT_EMAIL` が未設定またはプレースホルダー値なら問い合わせ窓口は準備中表示となる。設定時のみ、入力内容を含む `mailto:` を開く。

## 構成と公開先

- 本番Vercelを稼働させたまま、同じアプリをCloudflare Workersへ試験公開。
- URL: https://kyoupoke-channel-site-preview.kc2424.workers.dev
- Cloudflare account: `6a1c26f4f8db3df8d5647d6e4f1ccf00`
- Worker: `kyoupoke-channel-site-preview`
- [Cloudflare管理画面](https://dash.cloudflare.com/6a1c26f4f8db3df8d5647d6e4f1ccf00/workers/services/view/kyoupoke-channel-site-preview/production)
- KV namespace: `kyoupoke-channel-site-preview-cache` / `299ad1a1b1da424ba7b184862fa8811b`
- 初回公開version: `76d31392-8f4e-4171-9bfa-4560398c5756`
- 検索除外の修正反映後version: `521c5c17-90c3-42ad-af88-5fddb69c9d80`
- ドメイン購入・有料プランへの切替は行っていない。

Cloudflare公式ガイドに従い、vinext + Cloudflare Vite pluginでApp RouterをWorkers向けにビルドする構成。
Notionから取得する記事やプロフィール、YouTube RSS、300秒のISRを引き継ぐ。
元の `npm run dev` / `npm run build` はNext.js用として残している。

## 今のURLと本番切替

`kyoupoke-channel-site.vercel.app` はVercel所有ドメインのサブドメインで、こちらでDNSをCloudflareへ移管できない。
現在はVercelを継続し、Cloudflare無料サブドメインを試験用に使う。
今後Cloudflare本番へ切り替える際は以下を別途決める。

1. workers.devを正式URLにするか、独自ドメインを取得する。
2. NEXT_PUBLIC_SITE_URLとcanonical・sitemapを新しいURLへ合わせる。
3. 試験用の検索除外ヘッダーを外す。
4. 旧Vercel URLを残すか、新しいURLへのリダイレクトにするか決める。
5. Search Console・外部掲載リンクを確認する。

現時点では正式URLの切替・旧URLのリダイレクト・Vercelの停止は行っていない。

## ローカル実行とデプロイ

```sh
npm ci
npx wrangler login
npm run cf:typegen
npm run build:vinext
npm run start:vinext
# http://localhost:8787
```

```sh
npm run lint
npm run build                  # Vercel向けも壊れていないことを確認
npm run build:vinext
npm run cf:dry-run             # 配信サイズ・設定を確認
npm run deploy:vinext -- --skip-build
```

公開前の一括検証は以下を使う。

```sh
npm run check:quality
npm run test:browser
```

日常のCloudflare更新は `npm run deploy:cloudflare` で再ビルドとデプロイを実行できる。
`deploy:vinext -- --skip-build` は既存成果物を公開するため、必ずその前にビルドと検証を済ませる。
CloudflareのGitHub自動ビルドはまだ設定していない。VercelのGitHub連携は従来通り。

## Notionキー

- Next.jsローカル用: `.env.local` のNOTION_TOKEN
- Cloudflareローカル用: `.dev.vars` のNOTION_TOKEN
- Cloudflare実環境用: WorkerのシークレットNOTION_TOKEN
- このMacではすべて設定済み。秘密ファイルはGit管理外。

元のVercel ProductionのキーはSensitive指定で、env pullでは `[SENSITIVE]` しか取得できなかった。
今回はユーザーがNotionの元の接続キーを入力し、接続成功を確認して引き継いだ。
別PCでもキーをチャット・GitHub・wrangler.jsoncに貼らず、Notionインテグレーションの管理画面から設定する。
既存Vercelのキーを再発行して無効化すると本番に影響するため、再発行する場合は更新先を揃えること。

キーを変更したとき:

```sh
# .env.local と .dev.vars のNOTION_TOKENを更新してから実行
npm run cf:secret
```

このスクリプトはNOTION_TOKENだけをstdin経由で登録する。値をコマンド引数やログへ出さず、他のVercel環境変数を転送しない。

## 互換性・運用上の注意

- vinext 1.0.0-beta.10 / @vinext/cloudflare 1.0.0-beta.8を固定。ベータ版なので依存更新時はブラウザを含め再検証する。
- Next.jsは16.3.5、React / React DOM / RSCは19.2.8に統一。
- @vitejs/plugin-reactは5.2.0を指定。自動選択の6系では既存shadcn周辺のBabel 7と依存競合したため。
- 日本語はシステムフォント、英字ワードマークはModakを使用。画像は事前生成したWebPを両環境で共通配信し、Cloudflare Imagesの有料最適化は使用しない。
- キャッシュはWorkers Cache + KV。Notion公開チェックや編集反映は300秒のISRによる再検証で更新される。
- compatibility_dateは2026-09-14。作業日はJSTで9月15日だったが、実行時のUTCは9月14日で、9月15日はランタイムから未来日として拒否されたため。
- vite.config.tsからCloudflare試験向けのビルド対象を選び、Next.js共通設定をvinextにも読み込ませて試験版だけに `X-Robots-Tag: noindex, nofollow` を追加。
- dist / .wrangler / .vinext / worker-configuration.d.tsは生成物としてGit・lintの対象外。
- 無料枠での長期的なCPU時間・アクセス数・KV使用量の収まりまでは負荷試験していない。管理画面のMetrics/Logsで確認する。

## 検証結果（2026-09-15）

- Next.js本番ビルド・vinextビルド・Wrangler dry-run成功。
- lintはエラー0、既存のmobile-hero-carouselのimg警告1件。
- 本番と同じNotion公開記事8件を取得。Cloudflare実URLのトップ・一覧・記事詳細・画像・robots・sitemapが200、非公開テスト記事は404。
- ブラウザでPC 1280px / モバイル390pxを確認。画像読み込み成功、横はみ出しなし、ブラウザ実行エラーなし。お知らせへ遷移して8件を確認。
- 配信JS等のクライアント成果物にNOTION_TOKENの混入がないことを検査。
- 初回の `/:path*` 指定だけではトップに検索除外が付かなかったため、`/` を明示して再デプロイ。
- Vercel向け型チェックでNextConfigの広い型とvinextの型の不一致を検出。next.config.tsをsatisfies形式に変更して実際の設定形状を保持し、再ビルド成功。

## 公式資料

- [Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Workers料金・制限](https://developers.cloudflare.com/workers/platform/pricing/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Workersシークレット](https://developers.cloudflare.com/workers/configuration/secrets/)

## Codex MCP接続（2026-09-15）

- このMacのCodexに `cloudflare-api`（https://mcp.cloudflare.com/mcp）を登録し、OAuth認可完了。Wranglerの認証とは別。
- この会話からMCP経由でWorkers一覧3件とサブドメイン `kc2424` を取得し、いずれもHTTP 200を確認。
- 接続設定・認証情報はCodexのユーザー環境で管理し、リポジトリには保存しない。別PCではそのPCのCodexで接続・認可が必要。
