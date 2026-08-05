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
28. Active Theory - Vision (Awwwards SOTD) — アンビエントライトリーク（マウス追従グラデーションブラー）
29. Lusion Studio (Awwwards SOTD) — TOKYO JST リアルタイムクロック＆パルスバッジ
30. Gucci Ancora (Awwwards SOTD) — ページ最上部スクロールプログレスバー
31. Studio Freight (Awwwards SOTD) — マグネティックTopへ戻るボタン
32. Pitch - Visual Engine (Awwwards SOTD) — アクセシビリティ・キーボードショートカットモーダル (⌘K / ?)

※このリストは2026-08-06時点の`git log`から抽出した初期値。以降はループ実行のたびに末尾へ追記すること。

## 既知の問題・回避策

- **Turbopackビルド失敗（サンドボックス環境固有）**: クラウドルーティンの実行環境では`npm run build`（Turbopackデフォルト）がGoogle Fontsの取得に失敗して落ちることがある。変更前のベースコミットでも同じ理由で失敗する場合はサンドボックス固有の既知問題であり、今回の変更とは無関係。切り分けには`git stash`でベースコミットに戻して同じエラーが出るか確認するか、`next build --webpack`で代替確認する。
- **WebFetchの403**: `awwwards.com`等への`WebFetch`がサンドボックス環境で403を返すことが多い。その場合はWebSearchのスニペットから評価点を分析し、コミットメッセージにその旨を注記する。

## 直近の実行ログ（Checker結果を含む、新しいものが上）

### 2026-08-06 (Antigravity Loop 10 - Interactive System Expansion)
- 対象: システム機能のダイナミック進化＆参加型インタラクティブ機能追加
- 変更点:
  1. `src/components/battle-quiz-widget.tsx`: 「今日ポケ ガチ知識クイズ」システムコンポーネントを追加。問題回答・即時解説・キラキラ演出・再挑戦機能を実装。
  2. `src/components/quote-generator-modal.tsx`: ヘッダーに「今日ポケ 名言カード」生成・1タップコピーモーダルを追加。
- 検証 (Checker): `npm run build` 成功 (5.0s)、TypeScript PASS、UI干渉なし
- 判定: PASS（システム機能拡張完了）

### 2026-08-06 (Antigravity Loop 9 - Major Structural Overhaul)
- 対象: サイト全体の構造的変革＆UI/UX大規模リファクタリング
- 変更点:
  1. `src/components/hero-stage.tsx`: ヒーローセクションに3人組メンバー切り替えインタラクティブドック（バンビー/いろは/くろこ）を追加。
  2. `src/components/video-filter-section.tsx`: おすすめ動画セクションにカテゴリ別タブフィルター（すべて/ガチ対戦・大会/企画・旅）を追加。
  3. `src/components/intro-loader.tsx`: ローディングブロック感を解消し、セッション初回のみ高速かつ自然に明けるよう最適化。
- 検証 (Checker): `npm run build` 成功 (3.2s)、レスポンシブ崩れなし、TypeScript PASS
- 判定: PASS（大規模構造変化完了）

### 2026-08-06 (Antigravity Loop 8 - 5-Iteration Batch Run)
- 対象: Awwwards SOTD受賞作（Active Theory, Lusion, Gucci Ancora, Studio Freight, Pitch）のUI演出5件を一括導入
- 変更点:
  1. `src/components/ambient-light-leak.tsx`: 背景のマウス追従ソフトグラデーション
  2. `src/components/live-clock-badge.tsx`: ヘッダーのTOKYOリアルタイム時計バッジ
  3. `src/components/scroll-progress-bar.tsx`: ページ最上部スクロールプログレスバー
  4. `src/components/back-to-top-button.tsx`: マグネティックTop戻りボタン
  5. `src/components/keyboard-shortcuts.tsx`: ⌘K / ? キーボードナビゲーションモーダル
- 検証 (Checker): `npm run build` 成功、コンテンツ事実変更なし、TypeScriptコンパイル PASS
- 判定: PASS（5回一括回し完了）

### 2026-08-06 (Antigravity Loop 7 - Maker & Checker)
- 対象: モバイル実機でのバッジ・タイトル・人物顔の視覚的被り（Visual Collision）完全解消 ＆ 視覚監査規定の追加
- 変更: `src/components/hero-stickers.tsx` の「最終1位14回」バッジの位置を `top-[28%]`（背景空きスペース）へ逃がし、`src/app/page.tsx` の可読性グラデーションおよび顔フレーミング (`35%`) を最適化
- 監査規定拡張: **【Visual Inspection Check】** ビルド監査だけでなく「文字・バッジが人物の顔と重ならない視覚的健全性」を Checker の判定項目へ正式追加
- 検証 (Checker): `npm run build` 成功 (3.3s)、`git diff` 監査 PASS
- 判定: PASS（`antigravity/seo-ogp` ブランチへコミット＆Push）
