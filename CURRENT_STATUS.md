# 今日ポケch. ファンサイト 現状確認

## サイト監査改善（2026-09-21、ローカル検証済み・公開処理中）

**現在はこの節を最優先し、下の2026-09-15以前の節は当時の履歴として参照する。**

- 作業ブランチは `codex/site-audit-remediation`。`main` は変更しておらず、既存Vercel本番 `https://kyoupoke-channel-site.vercel.app` とCloudflare試験版 `https://kyoupoke-channel-site-preview.kc2424.workers.dev` の公開内容も今回まだ変更していない。
- このブランチのNext.js / vinext両ビルド、実画面、公開結果は検証中。確認完了後に結果を追記する。
- 主要依存はNext.js 16.3.5、React / React DOM / React Server Components 19.2.8、vinext 1.0.0-beta.10、`@vinext/cloudflare` 1.0.0-beta.8、Cloudflare Vite plugin 1.54.9、Wrangler 4.131.2、Playwright 1.63.0。
- 画像原本を保持したまま、SharpでレスポンシブWebPを事前生成する構成へ変更。`public/optimized/` と `src/data/image-manifest.json` をVercel / Cloudflareで共通利用し、Cloudflare Imagesの有料最適化には依存しない。
- 日本語本文・見出しはシステムフォントを使用。Webフォントは英字ワードマーク用のModakだけに絞った。
- 品質ゲートを追加。`npm run check:quality` は依存監査、警告0件のlint、単体テスト、Next.js / vinext両ビルド、Wrangler dry-runを直列実行し、`npm run test:browser` は両環境の主要導線、dialog、画面幅、JavaScript無効時、検索除外ヘッダーを検証する。GitHub Actionsも同じ検証を行う。
- 問い合わせ先は環境変数 `CONTACT_EMAIL` で設定する。未設定またはプレースホルダー値ではフォームを表示せず「お問い合わせ窓口は現在準備中」と案内し、設定済みの場合だけ入力内容を含む `mailto:` を開く。
- 今回の監査では依存更新、入力データ検証、SEO / JSON-LD、エラー画面、アクセシビリティ、レスポンシブ表示、画像・フォント・演出負荷の改善を進めている。最終的な合否はビルド・実画面・独立Checkerの結果とともに追記する。

## 引き継ぎ整備・Cloudflare試験公開（2026-09-15）

**以降の初回調査より、この節を優先する。** ユーザーの依頼により、Macの環境復旧とCloudflareへの試験公開を実施。

- Git履歴と欠落した4ファイルを復元済み。作業ブランチは `chore/mac-handoff-cloudflare`、起点は `origin/main` の `600fe22`。mainへの変更・マージはしていない。
- Mac向けに依存パッケージを再インストール済み。Windows由来の旧node_modulesは `/private/tmp/kyoupoke-windows-node-modules-20260915` に一時退避。追跡ファイルの改行形式だけを正規化し、既存コンテンツに差分が出ないことを確認。
- Vercel CLIを既存プロジェクトへリンク済み。Cloudflare Wranglerのログインも完了。
- VercelのNOTION_TOKENはSensitiveで取り出せなかったため、ユーザー入力の元のキーを利用。`.env.local`、`.dev.vars`、Cloudflare Workerのシークレットを設定し、公開記事8件の取得を確認。秘密の値はGitに保存していない。
- Cloudflare試験URL: https://kyoupoke-channel-site-preview.kc2424.workers.dev
- 既存Vercel本番URLは維持。Cloudflare試験版は検索除外で、canonicalはVercelを指す。独自ドメイン購入、有料プランへの変更、本番URLの切替は未実施。
- vinextとWranglerの設定、型生成・ビルド・公開コマンドを追加。詳細は [CLOUDFLARE.md](CLOUDFLARE.md)。次回の入口は [README.md](README.md)。
- CloudflareのGitHub自動デプロイは未接続。更新時は `npm run deploy:cloudflare` を実行する。
- 引き続き未設定: 問い合わせフォームの宛先。事実情報・写真・ブランド素材・演出コードは変更していない。

## 初回調査の記録（復旧・試験公開の前）

確認日: 2026-09-15（日本時間）。GitHub・Vercel・Notion・本番HTTP応答・Mac上のファイルを読み取り確認したスナップショット。アプリの変更、push、デプロイ、設定変更は行っていない。

## 現在の基準

- GitHub: https://github.com/kc2424/kyoupoke-channel-site
- 現在の可視性は **Public**。古い HANDOVER.md / README.md の Private・非公開という説明は現在と異なる。
- デフォルトブランチ: `main`
- 最新コミット: `600fe2244daf80c2ef072d13d2e5159e8d0d2301`（2026-08-23 13:46 JST、REJECT関連実績ブランチのマージ）。確認時点でこれより新しいmainの変更はない。
- 本番: https://kyoupoke-channel-site.vercel.app
- 本番トップ・`/news`・`/robots.txt`・`/sitemap.xml` は未認証のHTTP取得で200。robotsはAllow、検索インデックス許可設定。
- サイト表記は「今日ポケch. ファンサイト」。非公式の注記を維持。
- Obsidianの営業・制作実績メモとコミット記録に、公認ファンサイトとして公開許諾を得た経緯がある。有償契約・公式サイト運用には至っていないという記録。許諾原文そのものは今回確認していない。

## 利用サービスと実装

| 項目 | 確認内容 |
|---|---|
| フロントエンド | Next.js 16.2.12 / React 19.2.4 / TypeScript / Tailwind CSS v4 / shadcn |
| 演出 | GSAP・ScrollTrigger・Lenis・motion。実写写真、ブランド素材、スクロール・カーソル・登場演出 |
| Vercel | チームslug `kc2425`（表示名kc2424、Hobby）、プロジェクト `kyoupoke-channel-site`、Framework `nextjs`、Node `24.x` |
| Vercel project ID | `prj_dD5kJktVI5PTy2IwbB9gsdbi4VUG` |
| 最新本番デプロイ | `dpl_6WGehheSwmQzr1nQJTUe5fRg5htx`、2026-08-23 13:47 JST、READY、mainの最新SHAと一致 |
| デプロイ方式 | GitHub連携。直近20デプロイはすべてREADY。GitHubの最新コミットのVercelステータスもsuccess |
| ドメイン | Vercelが返した3ドメインはいずれもvercel.app。独自ドメインは返されていない |
| Notion CMS | メンバー・スタッフ、実績、統計、動画、リンク、サイト文言、お知らせを管理。コードには7つのデータソースIDがある |
| お知らせ | Notionを直接照会し全11件、公開8件・非公開3件。本番一覧の8件と一致。最新公開日は2026-08-20 |
| 自動更新 | Next.jsの再検証間隔300秒。YouTube公開RSSから最新動画を取得する実装（APIキー不要） |
| SEO | OGP / Twitter Card / JSON-LD / sitemap / robots / Search Console確認タグを実装。Search Console管理画面の登録・検索実績は未確認 |

Vercel詳細: https://vercel.com/kc2425/kyoupoke-channel-site/6WGehheSwmQzr1nQJTUe5fRg5htx

## これまでの流れ

- 7月末: 静的サイトからNext.jsへ移行。オレンジを基調とするブランド表現と各種アニメーションを継続改善。
- 8月1〜2日: Notion CMS化、メンバーとスタッフの分離、文字の可読性・余白・コントラスト調整。
- 8月4〜7日: スマートフォンのヒーロー・写真クロップ・文字重なり・横画面の修正。演出整理、lint修正。
- 8月8日: トップページを中心に、お知らせ一覧・記事詳細へつながる構成へ変更。Bento形式のリンク、お問い合わせ、SEO基盤追加。
- 8月11日: 日本時間で一般公開対応・Search Console確認タグ追加。お知らせもNotion管理へ移行、公開/非公開反映の再検証設定を修正。
- 8月12日: 日本時間でサイト名を現在の「今日ポケch. ファンサイト」に変更。
- 8月20日: REJECT杯の告知、提携発表、優勝結果のお知らせを追加（PR #7 / #8）。
- 8月23日: REJECT関連実績を2件追加、登録者数更新、写真追加、実績を新しい順に整理。本番反映済み。

## GitHubのブランチ・作業残り

- 開いているPR・Issueは0件。PR #1〜#8はすべてマージ済み。
- `site-brushup` は `dc5ba2f`（8月8日）のまま。mainはこの先17コミット進んでおり、site-brushup側の未取り込みコミットは0。
- `feat/achievements-reject-2026`、`claude/pokemon-reject-cup-announcement-mskaxv` が残存。
- `antigravity/seo-ogp` はmainと分岐（そのブランチを基準にmainが84 ahead / 64 behind）。再利用する場合は目的と差分確認が必要。
- GitHub Actionsの実行履歴は0件。今回確認できたデプロイ検証はVercel。
- 自動ブラッシュアップループはAGENTS.mdでは無効化中と記載。クラウドルーティン管理画面の現在のON/OFFは未確認。過去のMaker/Checker設計は運用記録として扱う。

## このMacの状態

- 作業フォルダ: `/Users/0124o/Projects/Training/vivecording_training/kyoupoke-channel-site`
- `.git` がなく、git statusは「not a git repository」。現在のフォルダ自体にブランチ情報はない。
- GitHub最新mainの全104追跡ファイルをblob SHAで比較。23ファイルが完全一致、77ファイルがCRLF→LF正規化で一致、内容差分0。
- 残る4ファイルが欠落: `.gitignore`、`.env.example`、`.claude/agents/checker.md`、`.claude/launch.json`。
- `.env.local`、`.vercel/project.json` も作業フォルダにはない。CMS接続用のローカル設定は揃っていない。
- Node `v24.20.0`、npm `11.19.0`、GitHub CLIが利用可能。GitHub CLIの認証済み読み取りも成功。
- `node_modules` は存在するが `.bin` がなく、Next.jsのネイティブ依存はWindows用 `@next/swc-win32-x64-msvc` を確認。Windowsからのコピー由来と考えられる。
- `npm run lint` は `eslint: command not found` で起動前に失敗。コードにlint違反があると判定したものではない。ローカルビルド・ブラウザでの操作テストは今回未実施。
- 開発再開には、Git管理情報と欠落ファイルを復元し、Mac向けに依存関係を入れ直す必要がある。既存コピーを上書きする前に比較結果を確認すること。

## 残る具体的な注意点

- 問い合わせフォーム `src/components/contact-form.tsx:11` の宛先が `example@example.com`。メールソフトを開くmailto方式で、送信バックエンドはない。フォームはトップに実装済みだが宛先は未設定。
- `HANDOVER.md` の「未確定TODOなし」「非公開」「作業ブランチ」等は古い。最新コード・実サービスを優先する。
- Notion未設定・空配列時のフォールバックは実装されているが、Notion API例外全般を捕捉しているわけではない。「Notionが落ちても絶対に壊れない」という古い説明は保証できない。
- AGENTS.mdが参照する専用Obsidian資料 `kyoupoke_site/MOC.md` と専用セッションログは、現在開かれているVaultでは見つからなかった。別の保管先の有無までは断定していない。

## Macに見つかった関連資料

- `/Users/0124o/macbook/20_Projects/portfolio/works.md`（公認取得の経緯・実績の表現方針）
- `/Users/0124o/macbook/20_Projects/X発信_Web制作営業.md`（運営への連絡・公開許可・X投稿の記録）
- `/Users/0124o/macbook/20_Projects/AI×Web制作_マネタイズ作戦.md`（公認ファンサイトとしての位置づけ）
- `/Users/0124o/macbook/40_Resources/claude_code_loop.md`（Maker/Checkerとループの設計思想）
- プロジェクト内の `HANDOVER.md` / `STATE.md` / `MAKER_STATE.md`（過去資料。最新状態との齟齬あり）
