# STATE.md — 自動ブラッシュアップ・ループの状態管理

このファイルは、`site-brushup`ブランチを対象にした自動/半自動のブラッシュアップループ（クラウドルーティン「今日ポケ サイト ブラッシュアップ」、および手動でのClaude Codeセッション）が読み書きする**永続的な状態ファイル**です。

会話コンテキストやクラウドルーティンの実行間には状態が引き継がれないため（Context Rot対策）、「何を試したか」「何が起きたか」は必ずこのファイルに書き、会話やセッションの記憶に依存しないこと。

詳細な作業ログ・設計判断はObsidian Vault（`kyoupoke_site/セッションログ/`）に記録する運用だが、**クラウドルーティンの実行環境はVaultにアクセスできない**ため、ループの実行そのものに必要な状態はこのファイル（リポジトリ内）で完結させる。

## 運用ルール（Maker / Checker / Circuit Breaker）

- **Maker**（クラウドルーティン本体）: `site-brushup`ブランチで1回の実行につき1変更のみ行い、`npm run build`が通ることを確認してからpushする。実行前に必ずこのファイルの「引用済み受賞作品」「既知の問題」を読み、重複や既知の失敗を避ける。実行後は「引用済み受賞作品」に追記し、「直近の実行ログ」を更新する。
- **Checker**（別セッション・別権限で実行する検証役）: `Edit`/`Write`権限を持たず、`Bash`（git diff, npm run build, npm run lint）と`Read`/`Grep`のみで検証する。`.claude/agents/checker.md`のsubagent定義を参照。mainブランチへのマージ前、または別クラウドルーティン「今日ポケ ブラッシュアップ チェッカー」として使う。
- **Circuit Breaker（暴走防止）**:
  - 1回の実行で許される変更は1件のみ。ビルド修正の試行は最大2回まで。3回試してもビルドが通らない場合は変更を`git checkout .` / `git reset --hard`で取り消し、直近のpushしない状態で終了する（無限リトライ禁止）。
  - mainブランチには絶対に触れない。force pushは絶対にしない。
  - 既存のコンテンツ（メンバー紹介文・実績・リンクURLなど事実情報）は変更しない。
  - 受賞作品のコード・画像・文章を直接コピーしない。

## 引用済み受賞作品（重複防止リスト）

同じ作品を2回参考にしないよう、実行前に必ず確認すること。

1. Artem Shcherbakov Portfolio (Awwwards SOTD) — マグネティックボタン
2. Crazy About Eggs (Awwwards SOTD) — マスコットバナー視差スクロール
3. Bucks Sauce (Awwwards SOTD) — 実績グリッドのスナップリビール
4. Der Baukasten (Awwwards/FWA SOTD) — カスタムカーソル
5. Obys Experiment Space (Awwwards SOTD) — 3Dチルトカード
6. Hildén & Kaira (Awwwards SOTD) — 実績数字カウントアップ
7. Partizan (Awwwards SOTD) — 動画サムネイル グレースケール→カラー
8. Lacoste Polo Factory (Awwwards SOTD) — 実績カードのタップ火花演出
9. Spotify Wrapped Party (Awwwards SOTD) — 催眠的op-artリング装飾
10. MONOLOG (Awwwards SOTD) — 巨大タイポグラフィのエディトリアル帯
11. TRIONN (Awwwards/FWA SOTD) — タップ操作への音フィードバック
12. NORMAL IS BORING (Awwwards SOTD) — カスタムカーソルの文脈ラベル
13. Hiroto Sato (Awwwards SOTD) — プロフィール成長タイムライン
14. IZANAMI (Awwwards SOTD) — 全セクションの章立て番号表示
15. House of Honey (Awwwards SOTD) — セクション間の色ブレンド
16. Dragonfly Redux (Awwwards SOTD) — Meet the Membersバナーの折り目めくり演出
17. Lama Lama (Awwwards SOTD) — メンバー写真の常時回転グロウ枠
18. Glitch&Grit (Awwwards SOTD) — フルスクリーンナビのスクランブルテキスト
19. CoffeeTech (Awwwards SOTD) — おすすめ動画のモーダル再生化
20. Made With Gsap (Awwwards SOTD) — ヒーローのドラッグ可能ステッカー
21. RISK (Awwwards SOTD) — 動画モーダルのレターボックス演出
22. Mees Verberne (CSSDA/Awwwards/FWA) — ヘッダーロゴのアイドルウィグル演出
23. PP Neue Montreal (Awwwards SOTD) — ヘッダーナビの可変フォントホバー演出
24. Longbow (Awwwards SOTD) — メンバー写真/マスコットバナーの製図風コーナーマーク
25. Naiara Odriozola (CSS Design Awards) — 実績数字のスクロリーテリング演出
26. Motto (FWA SOTD) — 全ページの薄いグレインテクスチャ
27. Montfort (Awwwards/FWA/CSSDA同時SOTD) — ナビ移動時のオレンジのカーテン演出

※このリストは2026-08-06時点の`git log`から抽出した初期値。以降はループ実行のたびに末尾へ追記すること。

## 既知の問題・回避策

- **Turbopackビルド失敗（サンドボックス環境固有）**: クラウドルーティンの実行環境では`npm run build`（Turbopackデフォルト）がGoogle Fontsの取得に失敗して落ちることがある。変更前のベースコミットでも同じ理由で失敗する場合はサンドボックス固有の既知問題であり、今回の変更とは無関係。切り分けには`git stash`でベースコミットに戻して同じエラーが出るか確認するか、`next build --webpack`で代替確認する。
- **WebFetchの403**: `awwwards.com`等への`WebFetch`がサンドボックス環境で403を返すことが多い。その場合はWebSearchのスニペットから評価点を分析し、コミットメッセージにその旨を注記する。

## 直近の実行ログ（Checker結果を含む、新しいものが上）

### 2026-09-21（ユーザー依頼: サイト監査の一括改善）

- 自動ループとは別の明示依頼。作業ブランチは `codex/site-audit-remediation`、起点は `8cf4eec`。並列担当はユーザー指定の GPT-5.6 Sol / high。main・事実情報・公式リンク・非公式表記を維持。
- 画像を102件のレスポンシブWebP＋1200×630 OGPへ派生生成。hero-members.jpgは画素を変えず私的メタデータを除去。日本語フォント先読みを廃止し、Modakのみ1件。初回ローダーと常時演出を整理、JavaScript無効時にも本文を表示。
- メニュー/動画をnative dialogへ変更し、Tab巡回・Escape・スクロールロック・フォーカス復帰を修正。ヘッダー、アコーディオン、リンク、コントラスト、本文スキップを改善。動画・ニュースを前方へ移動。
- CMS/RSSの入力検証・失敗と空データの区別、統計数値の共通化、更新日時、JSON-LD、sitemap、404/エラーを修正。CONTACT_EMAIL未設定時は準備中、設定時はmailto。noJSでも本文がGET queryへ漏れないPOST mailtoフォールバック。
- 検証: npm audit 0件、lint warning 0、unit 12/12、Next.js build/vinext build/Cloudflare dry-run成功。両環境のトップ・一覧・8記事・404・103画像・canonical/OGP/JSON-LDをHTTP検証。配信成果物660ファイルにNotionトークン混入なし。実画面で390px/1024px/1280px/横844px、メニュー、動画、ニュース、noJSを確認。
- 独立Checker `/root/sol_checker`: PASS。紹介文/ブランド画素、秘密情報、データ境界、CI・テストを確認。発見したフォーカス、不可視CTA、文字色、noJSフォームの問題を修正後に再確認。
- 公開処理・GitHub CIはこの時点では進行中。完了時のIDと結果はCURRENT_STATUSへ追記。問い合わせ宛先、実ユーザー計測の方針、長期負荷試験は引き続き未設定/未実施。

### 2026-09-15（ユーザー依頼: Mac引き継ぎとCloudflare試験公開）

- 自動ブラッシュアップループとは別の、ユーザーが依頼した環境復旧・移行試験。
- `origin/main` の `600fe22` を基点に `chore/mac-handoff-cloudflare` を作成。欠落したGit履歴・隠しファイルを復元し、Mac用の依存関係を再導入。main自体の変更・マージ・force pushなし。
- Cloudflare Workersへvinext版を試験公開。Vercel本番を維持し、試験版のみ検索除外。Notionの公開記事8件・記事詳細・非公開記事404・画像を検証。
- 最終デプロイversion: `521c5c17-90c3-42ad-af88-5fddb69c9d80`。URL・手順はCLOUDFLARE.md、再開時の入口はREADME.md / CURRENT_STATUS.md。
- 検証: Next.js build / vinext build / Wrangler dry-run成功。lintは0 errors・既知のimg警告1件。PC/モバイルのブラウザ表示・横はみ出し・実行エラーを確認。
- 独立Checker `/root/checker`: PASS（試験公開・Mac引継ぎの範囲）。lint / npm ls / diff --checkを独立実行し、ビルド・デプロイは保存ログで確認。src/publicの差分なし、main維持、秘密情報のGit除外、型・lintの生成物除外の妥当性を確認。
- 未実施: 本番URL切替、Vercel停止、Cloudflare GitHub自動デプロイ、負荷試験。問い合わせ先は引き続き仮アドレス。

<!-- 各実行が1行〜数行で追記していく。例:
### 2026-08-06 (Maker実行)
- 対象: Awwwards SOTD「XXX」
- 変更: src/components/xxx.tsx を追加、YYYセクションに適用
- ビルド: npm run build 成功
- コミット: <hash>

### 2026-08-06 (Checker実行)
- 対象コミット: <hash>
- git diff スコープ: OK（コンテンツ事実変更なし、mainへの変更なし）
- npm run build: 成功 / npm run lint: 成功
- 判定: PASS
-->

（2026-09-15以前の実装履歴はHANDOVER.md / MAKER_STATE.md / Git履歴を参照。）

### 2026-09-15（ユーザー承認: Cloudflareサブドメイン変更）

- アカウント共通のサブドメインを `kc2424-buzz.workers.dev` から `kc2424.workers.dev` に変更。既存3 Workersすべてへの影響と旧URL停止を説明し、ユーザー承認後に確定。
- 新しい今日ポケ試験URL: https://kyoupoke-channel-site-preview.kc2424.workers.dev
- `buzz-style` と `buzz-style-poll` も新サブドメインへ移動。各Worker名・コードは変更していない。
- Cloudflare管理画面で3 Workersの新URLとアカウント設定反映を確認。引き継ぎ資料のリンクを更新。

### 2026-09-15（ユーザー依頼: Cloudflare MCP接続）

- CodexにCloudflare公式MCPを登録し、ユーザーによるOAuth認可後、MCP経由のWorkers一覧・サブドメイン取得が成功。
- 登録名 `cloudflare-api`、認証状態 `o_auth`、有効化済み。現在の会話でMCPツールが利用可能になった。
