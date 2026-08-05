# CLAUDE.md — プロジェクト運用ルール（Loop Engineering）

今日ポケ（KYOUPOKE）非公式ファンサイト。詳細な背景・技術スタック・作業ログはObsidian Vault（`kyoupoke_site/MOC.md`）を参照。このファイルはClaude Codeが自動/半自動でこのリポジトリを触るときの安全ルールを定義する。

## 自動ブラッシュアップループについて

`site-brushup`ブランチは、クラウドルーティン「今日ポケ サイト ブラッシュアップ」が1時間おきにWebデザイン賞受賞作品を参考にした改善を1件ずつ実装・pushする仕組み（現在は無効化中。有効化はclaude.aiのルーティン管理画面から）。このループは以下の3原則で運用する。詳細な設計思想は Obsidian Vault の `claude_code_loop.md` を参照。

### 1. Maker / Checker分離
- **Maker**（実装役）: `site-brushup`ブランチ上で1回1変更を実装し、`npm run build`が通ることを確認してpushする。自分の実装を自分で「良し」と最終判断させない。
  - **ボールド変革方針（ユーザー承認済み）**: 微細なCSS調整にとどまらず、構造的なレイアウト変革、不適切な要素・ノイズの削除、3D/インタラクティブコンポーネントの導入など、ユーザー体験を飛躍させる大胆な刷新を推奨。
- **Checker**（検証役）: `.claude/agents/checker.md`のsubagent定義を使う。`Edit`/`Write`を持たず、`Bash`(git diff/build/lint)と`Read`/`Grep`だけで検証する、別セッション・別権限の役割。mainへのマージ前に必ずこのCheckerでdiffを検証してからマージすること。

### 2. サーキットブレーカー（暴走防止）
- 1回の実行につき変更は1件のみ。ビルド修正の試行は最大2回まで（3回失敗したら変更を取り消して終了、無限リトライしない）。
- ローカルでheadless実行（`claude -p`等）を使う場合は必ず`--max-turns`と`--max-budget-usd`を指定する。
- カスタムStop hookを追加する場合は、入力JSONの`stop_hook_active`フラグを必ず確認し、trueなら即`exit 0`する（無限ブロックループ防止）。クライアント側のデフォルト上限は8回連続ブロックだが、`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`環境変数で調整可能。

<negative_constraints>
- mainブランチには絶対に触れない。作業は必ず`site-brushup`ブランチ上で行うこと。
- force pushは絶対にしない。
</negative_constraints>

### 3. State Discipline（状態はセッション外に）
- ループの状態（引用済み受賞作品の重複防止リスト、既知の問題、直近の実行ログ）は会話コンテキストではなく**リポジトリ直下の`STATE.md`**に記録する。クラウドルーティンの実行環境はObsidian Vaultにアクセスできないため、ループ運用に必要な状態はVaultではなく`STATE.md`で完結させること。
- 各実行の開始時に`STATE.md`を読み、終了時に更新してから終了する。
- 人間向けの詳細な作業ログ・設計判断はこれまで通りObsidian Vault (`kyoupoke_site/セッションログ/`) に記録する（このファイルとは役割が異なる: `STATE.md`=ループの機械可読な状態、Vault=人間向けの詳細ログ）。

## プロジェクト固有の安全ルール（既存）

- ブランドカラーはオレンジ(`--brand: #d9552e`)+黒+白の3色ルール

<negative_constraints>
- `public/icon.png`・`public/hero-mascots.png`など実物のブランド素材を差し替えない
- Lenis + GSAP ScrollTriggerの連携（`src/components/smooth-scroll.tsx`）を壊さない
- メンバー紹介文・実績・リンクURLなど事実情報は変更しない
- 「非公式ファンサイトです」の注記は削除しない、公式を名乗る文言を追加しない
- 受賞作品のコード・画像・文章を直接コピーしない（考え方だけを抽出して独自実装する）
</negative_constraints>
