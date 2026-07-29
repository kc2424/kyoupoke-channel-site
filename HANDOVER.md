# 今日ポケ ファンサイト 引き継ぎ書

最終更新: 2026-07-30

## 1. プロジェクト概要

今日ポケ（KYOUPOKE / @KYOUPOKE）の**非公式ファンサイト**。
本人・関係者による公式サイトではなく、ファンが個人的に制作したもの。

- ローカルパス: `C:\Users\0124o\バイブコーディング練習\kyoupoke-channel-site`
- GitHubリポジトリ: https://github.com/kc2424/kyoupoke-channel-site （**Private**）
- 本番URL: https://kyoupoke-channel-site.vercel.app
- **Vercel Authentication が有効**（Vercelアカウントでログインしていない人は閲覧不可。非公開状態を維持するための設定）

## 2. 技術スタック

- **Next.js 16**（App Router）+ TypeScript
- **Tailwind CSS v4**（`tailwind.config.js` は無く、`globals.css` 内の `@theme inline` でテーマ変数を管理）
- **shadcn/ui**（Button, Card, Badge コンポーネント。`src/components/ui/`）
- **motion（旧Framer Motion）**: スクロール連動フェードイン（`src/components/fade-in.tsx`）
- **GSAP + ScrollTrigger**: 巨大タイトルのスクロール連動拡大演出（`src/components/giant-title.tsx`）
- **Lenis**: 慣性のあるスムーズスクロール（`src/components/smooth-scroll.tsx`）
- **フォント**:
  - `Mochiy Pop One`（`--font-logo`）: 「今日ポケ」のロゴ・ワードマーク専用（丸文字・バブル調）
  - `Zen Kaku Gothic New`（`--font-display`, weight 900）: 見出し全般（太字グロテスク）
  - `Noto Sans JP`（`--font-body`）: 本文

## 3. デプロイ・運用まわり

- `git push` すると Vercel が自動ビルド・デプロイする
- **GitHub CLI (`gh`) をこのPCにインストール・認証済み**（アカウント: kc2424）。新しいターミナルでは `gh repo create` 等がそのまま使える
- Vercel の **Framework Preset は "Next.js" に設定済み**（最初、静的サイト時代の設定が残っていて "Other" のままだったため、Next.js移行直後のデプロイが1回失敗している。もし今後 "No Output Directory" エラーが出たら、Vercel Project Settings → Build and Deployment → Framework Preset を確認する）
- ローカル開発サーバー起動時の注意: `npm run dev` を複数回バックグラウンド起動すると**ポートが競合して古いプロセスがCSSを配信し続け、見た目が反映されない**という不具合が過去に発生した。挙動がおかしい時は `node.exe` プロセスを確認して重複起動がないか確認する

## 4. コンテンツの状態（TODO残あり）

`src/app/page.tsx` 内に `TODO` コメントがある箇所:

- **おすすめ動画**: 現在プレースホルダー（Rick Astley）のまま。実際のおすすめ動画URLに差し替え必要
- **SNSリンク**: YouTube・X（@KYOUPOKEch）・今日ポケSHOPのみ設置。Instagram・TikTokの正式URLが分かり次第追加

## 5. これまでの経緯（時系列）

1. **雛形作成**: プレーンHTML/CSSで単一ページを作成 → GitHub Private リポジトリ作成 → Vercelデプロイ（Vercel Authenticationで非公開化）
2. **コンテンツ実装**: ユーザーが今日ポケの詳細な調査レポートを提供 → プロフィール・メンバー紹介（バンビー・いろは・くろこ）・実績を反映
3. **技術スタック相談**: 「Claude Codeだけでは限界を感じる」との相談 → ターミナル完結のNext.js + Tailwind CSSへの移行を提案・実施
   - 移行直後、Vercelの設定（Framework Preset）が古いままでビルド失敗 → 設定修正で解決
4. **shadcn/ui + アニメーション追加**: ボタン/カード/バッジをshadcn/uiに統一、Framer Motionでスクロールフェードイン導入
5. **ヒーロー画像追加**: ユーザーがGemini生成のメンバーイメージ画像・実写を提供 → イラスト画像をヒーローバナーに採用（実写は使用せず`.gitignore`で除外）
6. **デザインの参考にしたい実在サイト（KUYA / hellokuya.co）が提示される**:
   - Lenis（スムーズスクロール）+ GSAP（巨大タイポグラフィのスクロール演出）を追加
   - KUYA風の巨大ワードマーク・縦書きラベル・「FEATURED」区切りレイアウトを実装
   - ロゴマーク（オレンジ丸+「今」）を追加し、本家チャンネルアイコンに寄せた
   - 実績・出演グリッド（YouTube Creator Awards、テレビ東京バトオフ出演等）を追加
   - 黒背景に多言語の「ありがとう」が散らばるフッターを追加
7. **AI生成の「技術設計書」の事実確認**: ユーザーが「KUYAの技術構成」を詳述したもっともらしい文書を提供 → 内容を鵜呑みにせず実際に`/info`ページやDevToolsのネットワークタブ・JSバンドルを直接調査
   - 判明した事実: KUYAは Next.js(Pages Router) + Vercel + **Lenis**（確認済み）。**Storyblok等のCMSは無し**、**Framer Motion/GSAPも検出されず**（文書の主張は誤り）
8. **本物のCSSソースを元にした技術の再実装**: ユーザーが実際にDevToolsで取得したKUYAのCSSを貼付 → コードを丸ごとコピーするのではなく、**技術・挙動だけを学んで今日ポケ独自のコードとして再実装**:
   - `WipeLink`（`src/components/wipe-link.tsx`）: ホバーで色がスライドして塗り替わるボタン
   - `MemberCard`（`src/components/member-card.tsx`）: クリックで詳細が開閉するアコーディオン式メンバーカード（矢印アイコンが回転）
   - `IntroLoader`（`src/components/intro-loader.tsx`）: 初回アクセス時にタイルが個別に弾けて消えるローディング演出（`prefers-reduced-motion` 対応済み）

## 6. 著作権・ライセンスに関する方針（重要）

- KUYAのCSS/HTML/JSやフォント（ABCFavorit、有料の商用フォント）は**そのままコピーして使用していない**
- 上記6の技術はすべて「挙動を見て学び、今日ポケ独自のコードとして書き直す」方針で実装
- ユーザー提供の実写画像（`image.png`）や参考スクリーンショット（`1.png`, `2.png`, `3.png`）はデザイン確認用の参考資料であり、`.gitignore` でリポジトリには含めていない

## 7. 今後やるとよいこと

- おすすめ動画の実URL差し替え
- Instagram・TikTokリンクの追加
- Notion をCMS化して自分で更新できるようにする（会話中に提案済み・未着手）
- 個別メンバー写真があれば、グループ写真のクロップ処理から差し替え可能
