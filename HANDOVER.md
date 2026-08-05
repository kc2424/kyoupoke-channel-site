# 今日ポケ ファンサイト 引き継ぎ書

最終更新: 2026-08-02（レイアウトの読みやすさ仕上げ。§10 を参照）

## 1. プロジェクト概要

今日ポケ（KYOUPOKE / @KYOUPOKE）の**非公式ファンサイト**。
本人・関係者による公式サイトではなく、ファンが個人的に制作したもの。

- ローカルパス: `C:\Users\0124o\バイブコーディング練習\kyoupoke-channel-site`
- GitHubリポジトリ: https://github.com/kc2424/kyoupoke-channel-site （**Private**）
- 本番URL: https://kyoupoke-channel-site.vercel.app
- **Vercel Authentication が有効**（Vercelアカウントでログインしていない人は閲覧不可。非公開状態を維持するための設定）
- **作業ブランチ: `site-brushup`**（`main` とは別）。2026-07-30時点、見た目まわりの作業はすべてこのブランチで進行中。`main` にマージするかは未定（ユーザー確認待ち）

## 2. 技術スタック

- **作業ブランチ（2026-08-02時点）: `landing-glassmorphism-refresh`**。`site-brushup` は `main` にマージ済みで役目を終えている（`git log main..site-brushup` が空）。`main` には PR #1 のマージまでが入っており、Notion CMS化以降の変更はこのブランチに積まれている
- **Next.js 16**（App Router）+ TypeScript
- **Tailwind CSS v4**（`tailwind.config.js` は無く、`globals.css` 内の `@theme inline` でテーマ変数を管理）
- **shadcn/ui**（Button, Card, Badge コンポーネント。`src/components/ui/`）
- **motion（旧Framer Motion）**: スクロール連動フェードイン（`src/components/fade-in.tsx`）
- **GSAP + ScrollTrigger**: 巨大タイトルのスクロール連動拡大演出（`src/components/giant-title.tsx`）
- **Lenis**: 慣性のあるスムーズスクロール（`src/components/smooth-scroll.tsx`）
- **フォント**:
  - `Titan One`（`--font-wordmark`）: 「KYOU POKE」ロゴタイプ専用（実際のチャンネルブランド= public/3.png 相当のぷっくりしたステッカー体に寄せた）。巨大タイトル（`GiantTitle`）とヘッダー・フッターのロゴ表記で使用
  - `Mochiy Pop One`（`--font-logo`）: header内の小さい「今日ポケ」和文表記など、丸文字が欲しい箇所に限定使用
  - `Zen Kaku Gothic New`（`--font-display`, weight 900）: 見出し全般（太字グロテスク）
  - `Noto Sans JP`（`--font-body`）: 本文

## 3. デプロイ・運用まわり

- `git push` すると Vercel が自動ビルド・デプロイする
- **GitHub CLI (`gh`) をこのPCにインストール・認証済み**（アカウント: kc2424）。新しいターミナルでは `gh repo create` 等がそのまま使える
- Vercel の **Framework Preset は "Next.js" に設定済み**（最初、静的サイト時代の設定が残っていて "Other" のままだったため、Next.js移行直後のデプロイが1回失敗している。もし今後 "No Output Directory" エラーが出たら、Vercel Project Settings → Build and Deployment → Framework Preset を確認する）
- ローカル開発サーバー起動時の注意: `npm run dev` を複数回バックグラウンド起動すると**ポートが競合して古いプロセスがCSSを配信し続け、見た目が反映されない**という不具合が過去に発生した。挙動がおかしい時は `node.exe` プロセスを確認して重複起動がないか確認する

## 3.5. 本物のブランド素材（重要・差し替え禁止）

- `public/icon.png`: 実際のYouTubeチャンネルアイコンをスクリーンショット（ユーザー提供の `1.png`）から切り抜いた本物の画像。`LogoMark`コンポーネント（`src/components/logo-mark.tsx`）が使用。以前は独自SVG再現だったが、ユーザーから「ちゃんと写真見たか」と指摘され本物画像に差し替えた経緯あり
- `public/hero-mascots.png`: 実際のブランドイラスト（くろこ・いろは・バンビーのマスコットキャラがソファでゲームしている絵、「KYOU POKE」ロゴ入り）。ユーザーがチャット添付→ダウンロードフォルダから発見して取り込んだもの。`MemberCard`（個人写真）と「Meet the Members」バナーの両方で使用。**メンバーとの対応: 画像内は左から くろこ・いろは・バンビー**（`focal`座標で位置調整、`src/app/page.tsx`の`members`配列参照）
- これらは絶対に元のプレースホルダー（Gemini生成の3D風イラスト`hero.png`や自作SVGアイコン）に戻さないこと

## 4. コンテンツの状態（TODO残あり）

`src/app/page.tsx` 内に `TODO` コメントがある箇所:

- **裏方メンバー（あしゅ・ふらとら・サイヨーマ）の自己紹介文**: `staffMembers`（`src/app/page.tsx:111`付近）が「詳しいプロフィールは準備中です」のプレースホルダーのまま。役割・詳細が分かり次第、正式な内容に差し替え必要

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

- 裏方メンバー（あしゅ・ふらとら・サイヨーマ）の自己紹介文の正式差し替え（§4参照）

## 8. 2026-07-30 セッション: KUYA参考の大幅ブラッシュアップ

前回までのKUYA調査を踏まえ、動き・レイアウト・ブランド統一を大幅に強化した。

### 8.1 実施内容
- **ブランド統一**: ロゴを本物画像化（3.5節参照）、巨大タイトルを日本語「今日ポケ」からユーザー提供の実際のロゴ表記「KYOU POKE」（ローマ字・Titan One）に変更。ヘッダー/フッターの表記もKYOU POKEに統一
- **KUYA由来のマイクロインタラクション**（`src/components/`に追加）:
  - `reveal-text.tsx`: 見出しがスクロールで下から浮き上がって出現（文字ごとにoverflow-hiddenでマスク）
  - `underline-link.tsx`: ホバーでアンダーバーがscaleXで伸びる（Tailwind v4は`transform`でなく`scale`プロパティを使う点に注意。`getComputedStyle().transform`では検出できないので要注意）
  - `giant-title.tsx`: マウス位置に応じて文字がふにゃっと伸縮するホバーエフェクト（GSAP `quickTo` + elastic ease）。**スクロール連動で文字が収縮するpin付きエフェクトは一度実装したがLenisとの相性が悪く不自然な挙動になったため削除済み**。同様の「凝った独自スクロール演出」を足す前に、Lenis+ScrollTrigagerの連携（8.2節）を必ず確認すること
  - `sticker-badge.tsx`: 星形（スターバースト）のCSS `clip-path` バッジ。フッターに設置
  - `fullscreen-menu.tsx`: ヘッダーの「Menu」ボタンから開くフルスクリーンナビ（KUYAのHome/Work/Info風）
  - `member-card.tsx`: 写真ホバーで手描き風の丸+チェックマークがSVG `stroke-dashoffset` アニメで描画される
- **セクション単位の背景色ブロック**: 白（プロフィール/メンバー）→黒（実績）→白（動画）→ブランドオレンジ（リンク）→黒（フッター）と、KUYAのように背景色をセクションごと丸ごと切り替える構成に変更
- **デスクトップ表示の拡大**: コンテナを`max-w-5xl`→`max-w-[1600px]`に拡大、見出し・カード・ロゴなど主要要素に`lg:`ブレークポイントで大きめサイズを追加（ユーザーから「パソコンで見ると小さい」との指摘への対応）

### 8.2 Lenis + GSAP ScrollTrigger の正式連携（重要）
以前は`Lenis`が`autoRaf: true`で単独動作し、GSAP ScrollTriggerと同期していなかった。これが原因でpin付きスクロール演出が不自然な挙動になった。`src/components/smooth-scroll.tsx`で以下の公式パターンに修正済み:
```
const lenis = new Lenis({ autoRaf: false });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
また、ページ内アンカーリンク（`#profile`等）のクリックはネイティブジャンプではなく`src/lib/lenis.ts`の`scrollToHash()`経由でLenisのスムーズスクロールを使うように統一した（`UnderlineLink`・`FullscreenMenu`が使用）。**今後アンカーリンクを追加する場合は必ず`scrollToHash`を使うこと。**

### 8.3 夜間の自動ブラッシュアップ（クラウドルーティン）
ユーザーの希望で、Claude Codeのクラウドルーティン機能を使い、`site-brushup`ブランチに対して**1時間おきに自動でブラッシュアップし続けるタスク**を設定した。
- ルーティン名: 「今日ポケ サイト ブラッシュアップ」
- 管理画面: https://claude.ai/code/routines/trig_01HTrsstYCoKjfTjS5vfXQTj
- 内容: 毎回1つだけ改善（①Awwwards等のWebデザイン賞受賞作品をWeb検索→5つの評価ポイントを分析→②その中で今日ポケのブランドに合うものを1つ今日ポケ独自のコードとして実装→③`npm run build`確認→④分析内容と変更理由を書いたコミットメッセージでpush）
- **セットアップの詰まりどころ**: クラウドエージェントがPrivateリポジトリにアクセスするには、claude.aiの「Connectors」設定ではなく、**GitHub側で「Claude」という名前のGitHub Appを明示的にインストールする必要がある**（`github.com/settings/installations`の「Installed GitHub Apps」タブ。「Authorized GitHub Apps」タブのOAuth認証だけでは不十分）
- PCの電源・スリープとは無関係にクラウド側で動くので、**このPCを閉じても翌朝には`site-brushup`ブランチに複数コミットが積まれているはず**。朝一で差分を確認し、良い変更だけ`main`にマージする運用を想定
- 安全策としてルーティンのプロンプトに「mainブランチに触れない」「破壊的変更をしない」「受賞作品のコードは直接コピーしない」「1回の実行で1変更のみ」を明記済み

### 8.3.1 自動ブラッシュアップ実行ログ
- **2026-07-29夜**: 「全体的に文字が小さい」への対応（キャプション・タグ・ボタンにlg:サイズ追加）
- **2026-07-30**: Awwwards SOTD「Artem Shcherbakov Portfolio」を参考に、`src/components/magnetic.tsx`（マグネティックボタン。GSAP `quickTo`でカーソル追従→離れると弾性で戻る）を追加し、動画セクションの「もっと見る」ボタンとLinksセクションのSNSボタンに適用。詳細はgit logのコミットメッセージ参照
- **2026-07-30（2回目）**: Awwwards SOTD「Crazy About Eggs」（Tubik / Superhero Cheesecake制作、卵ブランドサイト）を参考に、`src/components/parallax-image.tsx`（GSAP ScrollTrigger + scrubでスクロール量に応じて画像だけがゆっくり上下する視差効果。`prefers-reduced-motion`対応）を追加し、「Meet the Members」のマスコットイラストバナーに適用。詳細はgit logのコミットメッセージ参照
- **2026-07-30（3回目）**: Awwwards SOTD「Bucks Sauce」（Buzzworthy制作、BBQソースブランドサイト）を参考に、`src/components/snap-reveal.tsx`（GSAP ScrollTrigger.batchで要素をわずかに傾けた状態から`back.out`イージングでスナップイン、stagger付き。`prefers-reduced-motion`対応）を追加し、「実績・出演」グリッドに適用。詳細はgit logのコミットメッセージ参照
- **2026-07-30（4回目）**: Awwwards/FWA Site of the Day「Der Baukasten」（Tubik制作、モジュール式トイのコンセプトサイト）を参考に、`src/components/custom-cursor.tsx`（ドット+リングの2層カスタムカーソル。GSAP `quickTo`でカーソル追従、リンク/ボタンにホバーすると拡大。`prefers-reduced-motion`・タッチデバイスでは無効化）を追加し、`src/app/layout.tsx`でグローバル適用。詳細はgit logのコミットメッセージ参照
- **2026-07-30（5回目）**: Awwwards Site of the Day「Obys® Experiment Space」（Obys制作、実験的インタラクションのアーカイブサイト。Design 8.03/Usability 7.44/Creativity 8.02/Content 7.83でSOTD受賞）を参考に、`src/components/tilt-card.tsx`（マウス位置に応じてカードがCSS perspective + GSAP `quickTo`でrotateX/rotateYに傾き、中央からグレアが追従する軽量3Dチルトカード。Three.js/WebGLは使わず翻訳。`prefers-reduced-motion`・タッチデバイスでは無効化）を追加し、おすすめ動画グリッドに適用。詳細はgit logのコミットメッセージ参照
- **2026-07-30（6回目）**: Awwwards Site of the Day「Hildén & Kaira」（Studio Debuut制作、Figma+Webflow、GSAP+ScrollTrigger。No-code Honors 2026年5月、SOTD 2026年7月5日）を参考に、`src/components/stat-counter.tsx`（スクロールで画面内に入ると0から目標値まで`power2.out`でカウントアップする数字コンポーネント。`prefers-reduced-motion`時は即座に最終値を表示）を追加し、実績セクションに「チャンネル登録者数58万人+」「総再生回数10億回+」「銀の盾10万人（2022年）」のスタッツ帯を新設。**注記: 今回はWebFetchツールがこの実行環境で全面的に403を返す不具合があり（example.comですら取得不可）、実サイトの直接確認はできず、WebSearchのスニペット（Communication Arts等の紹介記事）から評価点を分析した**。Hildén & Kairaの「クロム×イエローの緊張感のある配色」「ロゴのマテリアル統一」は今日ポケのオレンジ/黒/白3色ルールに合わないため採用せず、「実績の数字を主役に据えるエディトリアルな見せ方」と「GSAP+ScrollTriggerのスクロール連動」のみを抽出して独自実装した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（7回目）**: Awwwards Site of the Day「Partizan」（Beaucoup制作、映像プロダクション会社のサイト。スコア7.18でSOTD、Developer Award受賞。WebGL/GSAP/Three.js使用）を参考に、`src/components/mono-reveal.tsx`（既定はグレースケールで沈め、カードホバー時だけ色を解禁するCSSフィルター切り替えコンポーネント）を追加し、「おすすめ動画」グリッドのサムネイルに適用。**注記: 今回もWebFetch（awwwards.com、landing.love、partizanproduction.com）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。Partizanの核心は「UIを白黒2色に絞り、コンテンツ自体の色だけを主役にする」ミニマルな配色哲学（映像プロダクション会社なので、リールの映像だけが色を持つ）。今日ポケのブランドカラー（オレンジ/黒/白）とは配色そのものを合わせるのではなく、その哲学だけを抽出し「サムネイルは既定でグレースケールに沈め、ホバーで一気に色が戻る」インタラクションとして翻訳・実装した。WebGL/Three.jsは今回は見送り（CSS filterのみで十分な効果が出るため）。詳細はgit logのコミットメッセージ参照
- **2026-07-30（8回目）**: Awwwards Site of the Day「Lacoste — Polo Factory」（Merci-Michel制作、Three.js製ポロシャツカスタマイザー。スコア7.49、Design 7.56/Usability 7.09/Creativity 8.13/Content 7.13）を参考に、`src/components/spark-tap.tsx`（タップ/クリック位置からブランドカラーの小さな火花がGSAPで弾けて消える演出。キーボード操作・prefers-reduced-motion対応）を新規作成し、「実績・出演」グリッドの各カードに適用。**注記: 今回もWebFetch（awwwards.com、lemensandpartners.com）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。Lacosteの核心である「本格3Dカスタマイズ」そのもの（Three.js/WebGL、配色#A4E7FE等）は今日ポケの3色ルール・技術スコープに合わないため採用せず、「操作した瞬間に嬉しい視覚的フィードバックが返ってくる」という本質だけを抽出し、CSS+GSAPの軽量な火花演出として翻訳・実装した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（9回目）**: Awwwards Site of the Day「Spotify Wrapped Party」（Active Theory制作、スコア7.31。最大10人でリアルタイムに2025年の視聴傾向を比較できるマルチプレイヤー版Wrapped）を参考に、`src/components/op-art-rings.tsx`（同心円をブランドオレンジの太さ違いストロークで重ねた「催眠的なリング」演出。GSAPでゆっくり自転しつつ、ScrollTriggerのscrubでスクロール量に応じて呼吸するように拡大縮小。prefers-reduced-motion対応）を新規作成し、「実績・出演」セクションの黒背景の右側に装飾として配置。**注記: 今回もWebFetch（awwwards.com）は403で直接確認できず、WebSearchのスニペット（X/Twitterの紹介ポスト等）から評価点を分析した**。核心となる「チャンキーな重なり合う大文字タイポグラフィ」「Wrappedグリーン一色に統一した強いブランドカラー」「10人同時参加のマルチプレイヤー機能」はそれぞれ、既存のGiantTitleとの重複・3色ルールとの色の競合・リアルタイムバックエンドが必要という理由で見送り、「催眠的な同心円の op-art モチーフ」だけを抽出してCSS+SVG+GSAPの軽量な背景装飾として翻訳・実装した（pointer-events-noneでカード操作を妨げない）。詳細はgit logのコミットメッセージ参照
- **2026-07-30（10回目）**: Awwwards Site of the Day「MONOLOG」（Huy率いるブランド/Webデザインスタジオbymonolog.comのポートフォリオ。2026年7月7日SOTD受賞、6月にTypography Honors受賞。KH Teka/Suisseの巨大タイポグラフィ、ダーク/ライトのみの最小限2色パレット、GSAP+Three.jsのアニメーションが特徴）を参考に分析。**注記: 今回もWebFetch（awwwards.com、bymonolog.com）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝超大型の書体そのものをレイアウトの主役に据える、②配色＝ダーク/ライト2色に絞り込んだ潔い制限、③余白設計＝巨大な文字の周りに贅沢な余白を取ることで緊張感を作る、④モーション＝GSAP+Three.jsの控えめだが上質なトランジション、⑤コンテンツ＝「founder-led brandsのために」という一文でスタジオの立ち位置を明確に言語化するメッセージ性。過去9回のブラッシュアップは一貫してマイクロインタラクション（カーソル・チルト・マグネティック等）に寄っていたため、今回は①③（巨大タイポグラフィ×余白設計）を今日ポケに翻訳することにした。新規コンポーネントは作らず、`src/app/page.tsx`のヒーロー直後・「Meet the Members」バナー手前に、既存の`RevealText`を使って各メンバーの既存キャッチコピー（バンビー＝絶対的エース／いろは＝論理の体現者／くろこ＝悟りの天才、いずれも`members`配列に既存の事実）を`font-display text-8xl`級の巨大文字で1行ずつ左・中央・右にずらして配置する「エディトリアル・ステートメント」帯を追加。ダーク/ライトの2色制限にならい、色は黒地に白背景＋中央行だけブランドオレンジの1色差し色に留め、新しい色は増やしていない。②GSAP+Three.jsの本格3D演出、④コンテンツのメッセージング刷新は、今日ポケの内容を変更しない方針・技術スコープの都合で見送った。詳細はgit logのコミットメッセージ参照
- **2026-07-30（11回目）**: Awwwards/FWA Site of the Day「TRIONN」（インド・Rajkot拠点のAIパワード独立クリエイティブスタジオTrionnによるスタジオサイト。2026年7月28日SOTD受賞、Awwwards評価7.42、FWA of the Day同時受賞。GSAP＋ScrollTrigger＋Lenis＋Three.js＋Web Audioを1つの統一システムとして協調させたアーキテクチャがCodropsで特集された）を参考に分析。**注記: 今回もWebFetch（awwwards.com、trionn.design、tympanus.net/codrops）は全て403またはDNS解決不可で直接確認できず、WebSearchのスニペット（Codrops記事タイトル・Muzli・Orpetron等の紹介）から評価点を分析した**。5つの評価ポイント: ①モーション設計＝各セクションが専用の演出システムを持ちながら全体が破綻なく協調する統一感、②インタラクション＝GSAP `quickTo`等によるカーソル追従・スクロール連動の滑らかさ、③音によるフィードバック＝Web Audioでタップ操作に短い効果音を added し「触った感」を強化する多感覚設計、④3D/WebGLの節度＝Three.jsを"必要な箇所にだけ"使いスタジオの個性を殺さない抑制、⑤ブランド一貫性＝小規模スタジオでもグローバル水準の質感を保つ統一感。今日ポケのオレンジ/黒/白ルールに合わない本格Three.js/WebGL演出（②④相当）は見送り、③「音によるインタラクションフィードバック」を抽出して独自実装した。既存の`SparkTap`（実績カードのタップ演出）はこれまで視覚のみだったため、`src/lib/sound.ts`（外部音源ファイルは使わずWeb Audio APIで「ポップ」音をその場合成。オシレーターの周波数を880Hz→220Hzへ指数的に落とすシンプルな実装）と`src/components/sound-toggle.tsx`（ヘッダーに設置するオン/オフの丸ボタン。既定はオフ＝ミュートで、ユーザーが明示的にオンにした操作がブラウザの自動再生ポリシーを満たすユーザージェスチャーにもなる。localStorageで設定を記憶）を新規作成し、`SparkTap`のタップ時に効果音を鳴らすよう連携した。**注記: `npm run build`（Turbopackデフォルト）はこのサンドボックス環境ではGoogle Fontsの取得に失敗し変更前のベースコミットでも同じ理由で失敗することを`git stash`で確認済み（環境固有の既知の問題で今回の変更とは無関係）。かわりに`next build --webpack`でビルド成功・型チェック通過・静的ページ生成まで確認した**
- **2026-07-30（12回目）**: Awwwards Site of the Day「NORMAL IS BORING」（2026年7月24日SOTD受賞、PRO/DEV Award。高級不動産ブランドのための、あえて型を外した前衛的なブランディング＆デジタル体験。スコア: Design 7.27/Usability 7/Creativity 7.19/Content 7.25。WordPress+GSAP+CSSトランジション）を参考に分析。**注記: 今回もWebFetch（awwwards.comの当該ページ、raww.io）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝「普通は退屈」という強いコンセプトを、不動産業界の型どおりのお行儀の良さを崩す大胆な書体表現で体現、②モーション/トランジション＝GSAP駆動のページ内トランジションが単発の飾りでなく体験全体を貫く一本の糸になっている、③配色・グラフィック＝クリーンな配色に絞ることでタイポグラフィとモーションを主役として立たせる引き算のデザイン、④余白設計＝クリーンなレイアウトが大胆な文字要素の周りに呼吸する余白を確保、⑤コンセプトの体現＝「NORMAL IS BORING」という一言のブランドメッセージが表面的なタグラインで終わらず、細部の挙動まで一貫して貫かれている。今日ポケのオレンジ/黒/白ルールに合わない不動産特有の重厚な配色・大規模ページトランジション（②③相当のフルスケール実装）は見送り、⑤「コンセプトを細部の挙動に一貫して行き渡らせる」発想を抽出し、`src/components/custom-cursor.tsx`のドット+リング型カスタムカーソルに、ホバー中の要素の意図をその場で言語化する太字タイポグラフィのラベル（`OPEN`/`見る`/`MORE`/`CLOSE`）を追従表示する機能を追加した。対象は各`WipeLink`（YouTube・SNS・SHOPへの外部リンクボタン、`cursorLabel`propで指定）、おすすめ動画カード（`見る`）、メンバーカード（開閉状態に応じて`MORE`/`CLOSE`）。`data-cursor-label`属性を持つ最も近い要素をマウス直下から`closest()`で検出する軽量な実装で、新規の状態管理ライブラリは追加していない。詳細はgit logのコミットメッセージ参照
- **2026-07-30（14回目）**: Awwwards Site of the Day「IZANAMI」（baqemono.inc.制作、Tomoyuki Nakata。2026年7月18日SOTD受賞、PRO Winner・Developer Award獲得。スコア7.19。WebGL＋GSAP＋Figma、近黒`#0A0801`と生成り`#D9D7D4`の2色だけに絞った潔い配色、Art & Illustration/Business & Corporateカテゴリで、スクロール・タイポグラフィ・ストーリーテリング・コピーデザインが評価要素として挙げられていた）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/izanami）は403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝装飾を削ぎ落とした書体そのものを主役に据える構成、②配色＝2色だけに絞った緊張感のあるミニマリズム、③ストーリーテリング＝サイト名自体が日本神話の創造神イザナミを想起させ、コンテンツ全体を「物語」として体験させる構成思想、④スクロール設計＝GSAPによる場面転換的なスクロール演出、⑤3D/WebGLの活用＝没入感を出すための節度ある3D表現。今日ポケの技術スコープに合わないWebGL本格実装（⑤）や、ブランドの3色ルール（オレンジ/黒/白）に反する2色制限（②）は見送り、③「サイト全体を章立ての物語として体験させる」発想を抽出した。`src/components/chapter-mark.tsx`（GSAP ScrollTriggerでセクション見出しの左に「01/05」のような章番号をスライドインさせる軽量コンポーネント。`prefers-reduced-motion`では即座に表示。背景色に応じてlight/dark/brandの3トーンに対応）を新規作成し、プロフィール(01)→メンバー紹介(02)→実績・出演(03)→おすすめ動画(04)→リンク(05)の全5セクションの見出しに適用し、既存の各セクションを「今日ポケというグループの物語の5つの章」として読める構成にした。既存の事実・コピーは変更していない。詳細はgit logのコミットメッセージ参照
- **2026-07-30（15回目）**: Awwwards Site of the Day「House of Honey」（houseofhoney.com、カリフォルニア拠点のインテリアデザインスタジオのサイト。2026年7月15日SOTD受賞、Developer Award獲得。Next.js + Sanity + Tailwind CSS + Lenis + Muxという、今日ポケと近い技術構成。warm bone/creamの抑制されたパレット、Neue Haas Grotesk×Noeの書体ペアリング、"slow, deliberate transitions"と評される丁寧なトランジションが特徴）を参考に分析。**注記: 今回もWebFetch（awwwards.com、raww.io）は全て403で直接確認できず、WebSearchのスニペット（Communication Arts、A1 Gallery、Muzli等の紹介記事）から評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝サンセリフとセリフを組み合わせたエディトリアルな書体ペアリング、②配色＝warm bone/creamに絞った抑制の効いた最小限のパレット、③モーション・演出＝ゆっくりと丁寧な"slow, deliberate transitions"、④レイアウト・余白設計＝ページに呼吸の余地を持たせる"editorial restraint"、⑤コンテンツ体験＝会話の前にスタジオの人柄を視覚だけで感じさせる構成。①②は今日ポケのオレンジ/黒/白3色ルール・既存ブランドフォント指定に反するため見送り、④⑤は過去のMONOLOG回（巨大タイポグラフィ×余白設計）で既に一部対応済みのため対象外とし、③「slow, deliberate transitions」を、現在のセクション単位の色ブロック構成（白→黒→白→オレンジ→黒）に翻訳した。`src/components/section-blend.tsx`（GSAP ScrollTrigger のscrubでbackgroundColorを前後セクションの色にスクロール連動で補間する薄い帯。`prefers-reduced-motion`では最終色を即座に表示）を新規作成し、各セクション境界（プロフィール/メンバー→実績、実績→動画、動画→リンク、リンク→フッター）に配置。従来Tailwindの1pxボーダーによる硬いカットだった境目を、色そのものが溶け合う柔らかい移行に変更した（フッターの`border-t`は不要になったため削除）。詳細はgit logのコミットメッセージ参照
- **2026-07-30（16回目）**: Awwwards Site of the Day「Dragonfly Redux」（Studio Freight制作、暗号資産投資会社Dragonfly Capitalのブランド刷新サイト。2026年7月22日SOTD受賞、スコア7.39。Design 7.55/Usability 7.29/Creativity 7.49/Content 6.84。配色はブランドオレンジ`#FA4C14`と黒の2色のみ、書体はNon Natural Grotesk×Mondwestのペアリング、独自開発のブラウザ内ASCIIアート生成ツールが識別システムの核。Studio FreightはLenis（本サイトが採用しているスムーズスクロールライブラリ）の開発元でもある）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/dragonfly-redux）は403で直接確認できず、WebSearchのスニペット（Awwwardsのケーススタディページ、X/Twitterの制作解説ポスト）から評価点を分析した**。5つの評価ポイント: ①配色＝ブランドオレンジと黒の2色だけに絞り込み、セカンダリカラーを黒背景に置くことでCTAや強調箇所を際立たせる潔さ、②タイポグラフィ＝技術的な雰囲気を持つ書体ペアリングでブランドの専門性を体現、③モーション・演出＝スクロールに応じてclip-pathで「折り目(fold)」効果を作り、新しいセクションが現れる瞬間を演劇的に見せる、④インタラクション＝独自のASCIIアート生成ツールという、ブランド固有のビジュアルモチーフをそのままインタラクティブな核に据える一貫性、⑤技術基盤＝自社製Lenisでネイティブスクロールのlerp値をGSAP ScrollTriggerに渡し、WebGLとDOM・`position: sticky`を破綻なく同期させるアーキテクチャ。今日ポケは元々オレンジ/黒/白のブランドカラーのため①はそのまま合致するが新規に採り入れる要素ではなく、④のASCII生成ツールはブランド内容と技術スコープに合わないため見送り、③「スクロールで新しいセクションが演劇的に折り目を開いて現れる」演出を抽出した。`src/components/curtain-reveal.tsx`（GSAP ScrollTriggerのscrubで、白いフラップ(flap)要素がCSS 3D transform(`rotateX`+`perspective`)により上端を軸に手前へ折れて開き、裏にあるコンテンツが現れる演出。clip-pathではなく`rotateX`+`backfaceVisibility: hidden`で実装したが、「めくれて中身が現れる」という核心の体験は同じ。`prefers-reduced-motion`では即座にフラップを非表示にするフォールバックあり）を新規作成し、「Meet the Members」セクションのマスコットイラストバナー（`ParallaxImage`）を包む形で適用した。既存のセクション背景色ブレンド（`SectionBlend`、House of Honey回）とは別レイヤーの演出で、こちらは個別コンテンツブロックの初回登場を演劇的に見せるためのもの。詳細はgit logのコミットメッセージ参照
- **2026-07-30（13回目）**: Awwwards Site of the Day「Hiroto Sato」（2026年7月17日SOTD受賞。日本拠点のクリエイティブデベロッパーの個人ポートフォリオ。Three.js/GSAP/Blenderを使った3D・モーションが特徴。代表作「TRACK」は、ランナーの前進をスクロールホイールに紐づけ、ストップウォッチと走行距離のカウンターが進み、各区間で名言が浮かび上がる体験で、コンテンツの表示タイミングをビューポート位置ではなく「走行距離」という積算メーターの進み具合に合わせてペース配分している点がCodrops/WebGPU.com等で紹介されていた）を参考に分析。**注記: 今回もWebFetch（hirotos.com、awwwards.com/sites/hiroto-sato）は全て403で直接確認できず、WebSearchのスニペット（Kite Metric・WebGPU.comの紹介記事）から評価点を分析した**。5つの評価ポイント: ①3D/WebGLの物語的活用＝Three.jsを単なる飾りでなく「距離を走る」という体験の核に据える、②スクロール設計＝コンテンツの出現をビューポート通過ではなく積算メーター（距離・タイム）の進行に同期させるペース配分、③タイポグラフィ＝走行中に名言が浮かび上がる、意味のあるタイミングでのテキスト表示、④モーション＝GSAPによる滑らかな数値カウントアップとの協調、⑤ブランド一貫性＝クリエイティブデベロッパー自身の技術力をポートフォリオの体験そのもので証明する構成。今日ポケの技術スコープに合わないThree.js/WebGL本格実装（①）は見送り、②「コンテンツの出現をビューポート位置ではなく積算する進行度に紐づける」設計思想だけを抽出した。`src/components/growth-timeline.tsx`（GSAP ScrollTriggerのscrub付き進捗バー。プロフィールセクションを実際にスクロールする間だけ進捗が0→100%に伸び、バーが各マイルストーンの位置を通過した瞬間にそのドットとラベルがブランドオレンジに変わる。pin不使用でLenisとの相性問題を回避し、`prefers-reduced-motion`では即座に全て到達済み表示にするフォールバックあり）を新規作成し、プロフィールセクションに「2021.08.08 活動開始」→「2022 登録者10万人・銀の盾」→「NOW 登録者58万人+ / 再生10億回+」という、既存のプロフィール文中の事実のみを使った成長タイムラインとして設置した。新しい実績や数値は追加していない。詳細はgit logのコミットメッセージ参照
- **2026-07-30（17回目）**: Awwwards Site of the Day「Lama Lama」（アムステルダム拠点のクリエイティブデジタルエージェンシーLama Lamaの自社サイト。2026年7月20日SOTD受賞、Developer Award獲得。WebGL+GSAP+JavaScript構成、動画主体のハイエナジーなヒーロー、"goes all in or not at all"というタグライン、ジュリースコアはDesign/Usability/Creativity/Content平均7.4〜7.6程度）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/lama-lama-2、landing.love）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①モーション・演出＝動画主体のハイエナジーなヒーローで開始数秒の第一印象を強く作る、②コンテンツの見せ方＝実績（ケーススタディ）を静的な羅列ではなく「生きているように感じる」インタラクティブな見せ方にしている、③ブランドパーソナリティの一貫性＝"all in or not at all"という強気なタグラインをダークで大胆なビジュアルトーンとして全体に貫く、④技術と体験の融合＝strategy・design・codeを一体として扱う思想（演出だけでなく速度・導線設計まで含めた総合品質）、⑤ユーザビリティ＝派手な演出とスコア全体の高さ（usability含む）を両立。①のWebGL動画ヒーローは本物の動画素材が無く技術スコープにも合わないため見送り、④の総合的な速度最適化は既存のNext.js構成で対応済みのため対象外とし、②「静的なコンテンツをずっと生きているように見せる」発想だけを抽出した。これまでの演出（チルト・マグネティック・火花・タップ等）は全てホバーまたはスクロールをトリガーとする一過性の反応だったため、今回は「何もしなくても常時ゆっくり動き続けるライブ感」という新しい切り口を採用。`src/components/live-glow-frame.tsx`（CSSの`conic-gradient`＋`mask-composite: exclude`で写真フレームの縁だけに細いグロウのリングを作り、`@keyframes glow-spin`（`globals.css`）で7秒かけてゆっくり回転させ続ける。`prefers-reduced-motion`では回転を停止するメディアクエリ付き）を新規作成し、`member-card.tsx`の各メンバー写真フレームに適用した。既存のホバー時チェックマーク描画（SVG stroke-dashoffset）とは独立したレイヤーで、ホバー機能はそのまま維持されることを確認済み。詳細はgit logのコミットメッセージ参照
- **2026-07-30（18回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（前回セッションの`c700422`コミットで対応済み）したため、通常のブラッシュアップステップへ。Awwwards Site of the Day「Glitch&Grit」（クリエイティブディレクターKelly Bernard率いるスタジオの自社サイト。ブランディング/デジタル/映像制作を手掛け、OpenAI・Puma・ESPN等をクライアントに持つ。2026年7月20日SOTD受賞、スコア7.17。配色は白`#FFFBF7`と黒`#000000`の2色のみ、Webflow+Figma製、Awwwardsのタグはtypography/video transitions/footer design）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/glitch-grit、glitchandgrit.com、details.so）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝スタジオ名「Glitch & Grit」自体が体現する、デジタルなノイズ（glitch）と手触りのある粗さ（grit）を対比させる書体表現、②配色＝白と黒の2色だけに絞った高コントラストなミニマリズム、③モーション・演出＝Awwwardsが「video transitions」を特徴タグとして挙げるほど作り込まれた画面転換、④レイアウト＝ポートフォリオ・タイポグラフィを主役に据えたグリッド構成、⑤細部への配慮＝通常見落とされがちな「footer design」までAwwwardsの評価タグに挙がるほど作り込まれている。①のグランジ/ノイズ的な視覚表現そのものは今日ポケのポップで元気なブランドに合わない（荒れた質感は今日ポケの世界観と逆）ため見送り、③の本格的な映像トランジションは実写映像素材が無く技術スコープにも合わないため見送った。かわりに①の核心である「文字が一瞬崩れてから正しい形に収束する」という体験だけを、グランジではなくポップで元気な今日ポケらしい表現に翻訳した。`src/components/scramble-text.tsx`（ホバー中、カタカナ・数字・記号のランダムな文字列で数フレーム明滅させたのち、本来のラベルへスルスルと収束するテキストスクランブル演出。GSAPは使わず軽量な`setTimeout`ベースで実装。`prefers-reduced-motion`では即座に本来のテキストを表示）を新規作成し、`fullscreen-menu.tsx`のフルスクリーンナビ（プロフィール/メンバー/実績/動画/リンクの5項目）のホバー時に適用した。既存のホバー時矢印フェードイン演出とは独立したレイヤーで、クリック・アンカー遷移（`scrollToHash`）の挙動は変更していない。`next build --webpack`でビルド成功・型チェック通過・静的ページ生成まで確認した（デフォルトのTurbopackビルドはこのサンドボックス環境固有のGoogle Fonts取得失敗により従来通り失敗するが、変更前のベースコミットでも同じ理由で失敗するため今回の変更とは無関係）。詳細はgit logのコミットメッセージ参照
- **2026-07-30（19回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。Awwwards Site of the Day「CoffeeTech®」（デザイナーOr Halevi制作、Webflow+Javascript+GSAP。2026年7月17日SOTD受賞、スコア7.18。配色はラスト系オレンジ`#C8603D`と近黒`#0D0E13`の2色のみ、Hero/Gallery/About/Productsなど各セクションで動画を使い、プロダクト詳細をモーダル/ポップアップのトランジションで見せる構成が特徴）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/coffeetech-r、raww.io）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①配色＝ラストオレンジ×近黒の2色に絞った引き締まったミニマリズム、②タイポグラフィ／レイアウト＝Hero・Gallery・About・Productsの各セクションを一貫したグリッドで整理するクリーンな構成、③モーション・トランジション＝GSAP駆動でセクション間・要素間の動きに一貫性を持たせる、④インタラクション＝プロダクトを360度回転させる立体的な見せ方で「触れる」感覚を演出、⑤詳細表示＝クリックすると内容がモーダル/ポップアップでふわっと展開し、詳細情報だけに没入させる導線設計。①は今日ポケの既存オレンジ/黒/白ルールと配色そのものが近いため新規に採り入れる要素ではなく、④の360度プロダクト回転は実在の物理プロダクトが無く技術スコープにも合わないため見送り、⑤「クリックした要素がモーダルでふわっと拡大表示され、詳細（ここでは動画本編）だけに没入させる」導線を抽出した。従来「おすすめ動画」グリッドは3本のYouTube iframeを常時ページ読み込み時から埋め込んでおり、パフォーマンス上も無駄が大きかった。`src/components/video-modal.tsx`（サムネイル画像をクリックすると、背景がブラー＋暗転しつつパネルがscale 0.92→1でふわっと拡大するモーダルを開き、その時点で初めてYouTube iframeを`autoplay=1`付きでマウントする。Escapeキー・背景クリック・Closeボタンで閉じる。閉じている間はiframe自体をDOMに存在させないことで初期読み込みコストを削減）を新規作成し、`src/app/page.tsx`のおすすめ動画グリッドを「常時再生iframe」から「YouTubeサムネイル（`img.youtube.com`、next/image使用のため`next.config.ts`に`images.remotePatterns`を追加）+ 中央の再生ボタンアイコン」のカード表示に変更、クリックでモーダル再生する構成にした。既存の`TiltCard`（3Dチルト）・`MonoReveal`（ホバーでグレースケール→カラー）・カスタムカーソルの`data-cursor-label="見る"`はサムネイルカードにそのまま引き継いでいる。`next build --webpack`でビルド成功・型チェック通過・静的ページ生成まで確認した（Turbopackビルドの失敗は既知のサンドボックス環境固有の問題で今回の変更とは無関係）。詳細はgit logのコミットメッセージ参照
- **2026-07-30（20回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。Awwwards Site of the Day「Made With Gsap」（クリエイティブデベロッパーMichaël Garciaとデザイナー Florent Roux-Durraffourtによる、GSAPだけで作られた50種類のJavaScriptエフェクト集。2026年7月30日SOTD受賞、Developer Award獲得。両者合計27回のAwwwards SOTD受賞歴を持つ）を参考に分析。**注記: 今回もWebFetch（madewithgsap.com、awwwards.com/sites/made-with-gsap）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①インタラクションの多様性＝スクロール・マウス追従・ドラッグ・無限ループなど、コレクション全体でジャンルの異なる操作感を幅広く揃えている、②技術的節度＝Canvas/WebGLを一切使わず、3D/パースペクティブ表現までも軽量なJavaScript+GSAPだけで実現、③再利用性への設計＝画像やテキストを増減してもレイアウトが自動で追従し、デスクトップ・モバイル・タッチ操作すべてに対応、④教える構成＝各エフェクトにステップバイステップのチュートリアルとダウンロード可能なソースコードが付属し、見せるだけでなく学ばせる情報設計、⑤実績の体現＝制作者自身がAwwwards SOTD合計27回という実績を持ち、サイト自体が「作れる技術力の証明」として機能している。④の詳細チュートリアル配布・⑤の実績訴求は今日ポケのコンテンツ内容（実在の対戦実績）に合わないため見送り、②「Canvas/WebGLなしの軽量JSでも触感のあるインタラクションが作れる」という技術的節度を踏まえつつ、①「これまで未着手だったドラッグという操作ジャンルを加える」ことにした。`src/components/sticker-drag.tsx`（GSAP `Draggable`+`InertiaPlugin`で、指を離した後も慣性で少し滑ってから止まる「コラージュ風ステッカー」のドラッグ操作。`bounds`は親コンテナのCSSセレクタを`el.closest()`で解決する方式にし、Reactのref経由で親→子に渡すと初回マウント時にタイミング次第で`ref.current`がまだ`null`のまま子のエフェクトが走ってしまう不具合をPlaywrightでの実機ドラッグ検証で発見・回避した。`prefers-reduced-motion`ではドラッグ自体を無効化するフォールバックあり）を新規作成し、`src/components/hero-stickers.tsx`でヒーローセクションに「登録者58万人+」「総再生10億回+」という既存の実績数値（Recognitionセクションと重複する事実のみ、新しい数値は追加していない）をブランドカラーのステッカーバッジとして配置、`lg`以上のデスクトップ表示でのみドラッグして遊べるようにした（`aria-hidden`で装飾扱い、同じ情報はページ本文でアクセシブルに提供済み）。実装後、`npx playwright`でヘッドレスChromiumから実際にマウスダウン→移動→アップの操作をシミュレートし、慣性付きでステッカーが動くことを目視確認した。`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（21回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。Awwwards Site of the Day「RISK」（フランスのエージェンシーFLOT NOIR制作、映像ポストプロダクションスタジオのブランドサイト。2026年7月16日SOTD受賞・Developer Award獲得。Webflow+GSAP+Unicorn Studio、黒`#000000`とベージュ`#e4d5be`の2色のみの配色、Awwwardsのタグはfullscreen layout/infinite scroll/transitions/filters and effects/WebGL）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/risk、risk.film、raww.io）は全て403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①配色＝黒×ベージュの2色だけに絞った引き締まったミニマリズム、②レイアウト＝フルスクリーンの連続性を持たせたインフィニットスクロール構成、③モーション・演出＝WebGL/Unicorn Studioによるセクション間のトランジション・フィルターエフェクト、④ポストプロダクションらしい「素材に効果をかけて仕上げる」職能の体現、⑤技術基盤＝Webflow+GSAPという軽量な構成でも作り込まれた質感を出す設計。①②はそれぞれ今日ポケの3色ルール・既存の章立てセクション構成に合わないため見送り、④「素材（映像）に仕上げの効果をかける」という映像ポストプロダクションの本質を、GSAPの軽量な演出として翻訳することにした。`src/components/letterbox-reveal.tsx`（動画モーダルを開いた瞬間、黒帯が画面全体を覆った状態からGSAPでシネマスコープ画角の薄い帯へ収縮し、「上映が始まる」ような儀式感を演出するコンポーネント。`prefers-reduced-motion`では即座に薄い帯の状態を表示）を新規作成し、`video-modal.tsx`の動画パネルに適用した。既存の`MonoReveal`（グレースケール→カラーのフィルター演出、Partizan回）とは別レイヤーで、あちらは「色を戻す」フィルター、こちらは「画角を変える」トランジションという住み分け。**実装中に発見した既存不具合も合わせて修正**: `VideoModal`の全画面オーバーレイ（`fixed inset-0`）が、`おすすめ動画`グリッドを包む`TiltCard`の`[perspective:1200px]`ラッパーによってCSSの新しい包含ブロックにされてしまい、実際には画面全体ではなくカード1枚分の領域にしか広がっていなかった（`position: fixed`は`transform`/`perspective`等を持つ祖先があるとその祖先基準になるというCSS仕様上の挙動）。Playwrightで実際にモーダルを開いて初めて発覧し、`react-dom`の`createPortal`で`document.body`へ直接描画する形に修正し、正しく画面全体を覆うことを確認した。この不具合は今回追加したレターボックス演出の前提（画面いっぱいの黒帯）が成立するために必須の修正だったため、同一コミットに含めた。`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認し、Playwrightのヘッドレスブラウザで実際にモーダルを開閉してオーバーレイが画面全体を覆うこと・レターボックス帯が収縮すること・Escapeキーで閉じられることを目視確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（22回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。node_modulesが未インストールだったため`npm install`を実施してから着手。CSS Design Awards Site of the Day「Mees Verberne — Creative Developer」（クリエイティブデベロッパー本人のポートフォリオサイト。Awwwards SOTD・CSSDA WOTD・FWA of the Day・CSS Winner・GSAPショーケースと複数の賞を同時受賞。ページ内には常時マウスに反応するピクセル化背景、電話番号をバーコード風アニメーションで表示する仕掛け、クイックな存在感のアニメーション付き鳥ロゴなど、待機中でも「生きている」ような遊び心のある演出が特徴）を参考に分析。**注記: 今回もWebFetch（cssdesignawards.com、meesverberne.com、tympanus.net/codrops）は全て403で直接確認できず、WebSearchのスニペット（Really Good Designs等の紹介記事）から評価点を分析した**。5つの評価ポイント: ①ブランドキャラクターの常時演出＝ロゴ/マスコットにユーザー操作を待たない固有の存在感アニメーションを持たせている、②情報を遊びに変換する工夫＝電話番号という無機質なデータをバーコード風アニメーションという体験に変えている、③マウス反応の背景演出＝ページ全体を触れる遊び場にするインタラクティブなピクセル背景、④動きの一貫性＝スムーズスクロールで各プロジェクトを繋ぐモーション、⑤複数賞同時受賞が示す完成度＝Design/Usability/Creativity/Content等、異なる審査基準を横断して評価される技術・デザインの一貫性。③のマウス反応ピクセル背景（WebGL/シェーダー相当）は技術スコープと既存のカスタムカーソル演出との重複を考慮し見送り、②のバーコード演出も今日ポケの実データに自然に対応する要素が無いため見送った。①「ブランドマーク自体に、操作を待たない固有の生命感を持たせる」発想だけを抽出し、`src/components/logo-mark.tsx`に`animated`propを追加（既存propsを拡張、新規ファイルは作成せず）。`src/app/globals.css`に`@keyframes logo-wiggle`（6秒周期のうち最後の約1秒だけロゴがrotate+scaleで小さく弾む「しゃっくり」のような間欠アニメーション。`prefers-reduced-motion`では`.animate-glow-spin`と同じパターンでアニメーション無効化）を追加し、ヘッダーの`LogoMark`（常時表示・スクロールしても見え続ける唯一のロゴ）にのみ`animated`を適用した。ヒーロー・フッター・メンバーカード内のロゴは演出過多を避けるため対象外とした。`npm install`後、`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（23回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。node_modulesが未インストールだったため`npm install`を実施してから着手。Awwwards Site of the Day「PP Neue Montreal」（フォント制作会社Pangram Pangram制作、書体「Neue Montreal」の特設サイト。2026年7月14日SOTD受賞・Developer Award獲得、スコア7.41。Figma+Framer製、制作はDemande Spéciale。Expo '67のグラフィックデザインに着想を得たトラベルガイド風の構成で、メニュー項目にマウスを重ねると書体のウェイト（可変軸）がその場でアニメーションする仕掛けが評価点として挙げられていた）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/pp-neue-montreal、neuemontreal.com）は全て403で直接確認できず、WebSearchのスニペット（Fonts In Use、Communication Arts等の紹介記事）から評価点を分析した**。5つの評価ポイント: ①タイポグラフィの体現＝可変フォント自身の特設サイトとして、書体そのものの表現力（Hairline〜Black）を主役に据える構成、②配色＝Expo '67の博覧会ポスターを想起させるレトロな配色の組み合わせ、③レイアウト＝トラベルガイド/万博ポスター風のグラフィックレイアウト、④モーション・演出＝万博の時代感を纏った演出、⑤インタラクションの工夫＝メニュー項目にカーソルを乗せるとフォントのウェイト軸がその場でヌルっと変化し、静的な文字列が触れるだけで表情を変える体験。②③④はいずれも今日ポケのオレンジ/黒/白3色ルール・既存のポップな世界観に合わないレトロ万博調のため見送り、⑤「文字の太さがマウス操作でリアルタイムに変化する」体験を抽出することにした。調査の結果、本サイトの本文フォント`Noto Sans JP`（`src/app/layout.tsx`で`weight`を指定せずに読み込んでいるため、Google Fontsの可変フォント版がそのまま使われている）はまさにウェイト軸を持つ可変フォントであり、①の本質を素材面でも活かせると判断。`src/components/underline-link.tsx`のテキストを`transition-[font-weight]`付きのspanで包み、既定`font-bold`（700）からホバー時`group-hover:font-black`（900）へ滑らかに太さが変化するようにした（可変フォントのため、ブラウザ側で中間ウェイトも実際に補間描画される。従来のアンダーバーがscaleXで伸びる演出とは独立したレイヤーで、両方が同時に効く）。適用範囲はヘッダーのデスクトップナビ（プロフィール/メンバー/実績/動画/リンクの5項目、`UnderlineLink`を使う唯一の箇所）のみ。`npm install`後、`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認し、Playwrightのヘッドレスブラウザで実際にナビ項目をホバーし、文字が太く変化することを目視確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-30（24回目）**: 前回セッションの続きとして、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。node_modulesが未インストールだったため`npm install`を実施してから着手。Awwwards Site of the Day「Longbow」（Digital Butlers制作、英国EVスポーツカーブランドLongbow Motorsのサイト。2026年7月12日SOTD受賞、スコア7.21。Design 7.27/Usability 7.05/Creativity 7.31/Content 7.23）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/longbow、raww.io、commarts.com）は全て403で直接確認できず、WebSearchのスニペット（Communication Arts等の紹介記事）から評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝技術的な印象のモノスペース書体とGaramond（セリフ）を組み合わせ、「革新」と「伝統」の緊張感を演出、②配色・ビジュアルシステム＝黒・白・グレーに絞った抑制されたパレットで、車体写真そのものを主役に据える、③レイアウト＝製図（エンジニアリングドローイング）を思わせる可視化された4カラムグリッドが精密な建築的リズムを生む、④モーション・演出＝大きなタイポグラフィとトリミングされた写真、抑制されたモーションにより、通常のプロダクトページというより「自動車ポスター」のような佇まいになっている、⑤コンテンツ＝オリジナルの動画素材が無い制約を逆手に取り、AIツールで静止写真から映像シーケンスを生成して補っている。①のGaramond導入・②の黒白グレーへの配色縮小は今日ポケの既存フォント指定・オレンジ/黒/白3色ルールに反するため見送り、⑤のAI動画生成は今日ポケには実写映像があり不要なため見送った。③「製図を思わせる精密なグリッド演出」を、今日ポケのブランドに合う形で抽出することにした。`src/components/blueprint-corners.tsx`（写真やバナーの四隅に製図・技術図面風のL字コーナーマークを重ね、Tailwind標準の`font-mono`（新規フォント読み込みなし）で小さな図版キャプション風ラベルを添える軽量な装飾コンポーネント。`aria-hidden`で装飾扱い）を新規作成し、`member-card.tsx`の各メンバー写真フレーム（`NO.01`〜`NO.03`のラベル付き。既存の「01」インデックス表示も`font-mono`化してモノスペース書体の質感を統一）と、`page.tsx`の「Meet the Members」マスコットイラストバナー（`FIG.01 — MASCOTS`ラベル）に適用した。既存の`LiveGlowFrame`（回転グロウ枠）・ホバー時チェックマーク描画・`CurtainReveal`・`ParallaxImage`とは独立したレイヤーで、それぞれの既存機能が引き続き正常に動作することをPlaywrightのスクリーンショットで確認した。`npm install`後、`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-31（25回目）**: セッション開始時、`git branch`にsite-brushupがローカルに存在せず（`git fetch origin`後に`origin/site-brushup`から作成）、まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。Awwwards Site of the Day（直近1ヶ月分）は本HANDOVERで既に全て参考済みだったため、CSS Design Awards Site of the Dayまで対象を広げ「Naiara Odriozola」（Digital Art Director / Interactive Designerによる個人ポートフォリオ`naiaraodriozola.com`。2026年7月28日CSS Design Awards Site of the Day受賞。BMW・Continental・LivePerson等の大手ブランドを横断する15年以上のキャリア。ブルータリズム×ミニマリズムを掛け合わせた探索的レイアウト、スクロリーテリング＋パララックスでブランドの新しいビジュアルアイデンティティを体感させる手法、個々の演出を場当たりで足すのではなく「マイクロアニメーションのデザインシステム」として体系化し開発チームに引き渡す設計思想、UIモーションだけでなくサウンドデザインまで含めた五感のブランディングが評価点として紹介されていた）を参考に分析。**注記: 今回もWebFetch（cssdesignawards.com/sites/portfolio-website/3325、naiaraodriozola.com）は全て403で直接確認できず、WebSearchのスニペット（プロジェクトページの紹介文）から評価点を分析した**。5つの評価ポイント: ①レイアウト＝ブルータリズム×ミニマリズムを掛け合わせた遊び心のある探索的な構成、②モーション・演出＝スクロールに連動したパララックス/スクロリーテリングで新しいビジュアルアイデンティティを段階的に体感させる、③インタラクションの一貫性＝個々のマイクロアニメーションを場当たり的に足すのではなく体系化された「デザインシステム」として設計する思想、④五感を使ったブランディング＝UIモーションとサウンドデザインを組み合わせて世界観を作る、⑤実績の幅と一貫性＝異業種の大手ブランドを横断し15年以上一貫した品質のインタラクティブデザインを提供し続けている継続力。①のブルータリズム的な荒さは今日ポケのポップで元気なブランドに合わないため見送り、④のサウンドデザインは既存の`sound-toggle.tsx`/`spark-tap.tsx`（TRIONN回）で対応済みのため対象外、⑤は今日ポケ自身の実績（実プレイヤーとしての受賞歴）であり演出面の話ではないため対象外とした。②「スクロールに連動して新しいビジュアルアイデンティティを段階的に体感させるスクロリーテリング」を抽出することにした。既存の演出はすべて「要素がビューポートに入ったら反応する」一過性のリビール系（`FadeIn`/`RevealText`/`SnapReveal`等）か、スクロール位置に応じて連続的に値が変化する非pin系（`ParallaxImage`/`SectionBlend`/`GrowthTimeline`）のいずれかで、GSAP ScrollTriggerの`pin: true`（スクロールをその場に留めてコンテンツを順番に主役交代させる、正統派の「スクロールに乗せて物語を読ませる」手法）は今回が初導入。`src/components/stat-spotlight.tsx`（`gsap.matchMedia`でデスクトップ（`min-width: 1024px`）かつ`prefers-reduced-motion: no-preference`の場合のみ、3つの実績数字グリッドをpin+scrubで一箇所に留め、スクロール量に応じて「登録者数→総再生回数→銀の盾」の順に1つずつopacity/scaleで主役交代させる。モバイル・reduced-motion環境では従来通りの静的な3カラムグリッドのままフォールバックする）を新規作成し、`src/app/page.tsx`の「実績・出演」セクションの数字グリッド（既存の`stats`配列、新しい数値は追加していない）を差し替えた。`npm install`後、`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した。さらに`npx playwright`（`/opt/pw-browsers/chromium`）でヘッドレスブラウザから実際にスクロール位置を`window.scrollTo`で段階的に変化させ、pin区間で3つの数字がそれぞれ単独でopacity 1・他2つが0.3に順番に切り替わること、pin区間を抜けた後は通常のページスクロールに正しく復帰することを目視・DOM計測の両方で確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-31（26回目）**: セッション開始時、`git status`はHEAD detachedかつクリーン、`origin/site-brushup`に前回セッション（25回目）以降の新規コミットが無いことを確認。まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。node_modulesが未インストールだったため`npm install`を実施してから着手。Awwwards SOTD（7月分は全日程が本HANDOVERで参考済み）・CSS Design Awards WOTD（同様に直近日程が参考済み）を確認した上で、FWA of the Day受賞歴のあるブランディングエージェンシーMotto（wearemotto.com）の自社サイトを参考に分析。**注記: 今回もWebFetch（wearemotto.com、lapa.ninja、cssdesignawards.com/wotd-award-winners、winners.webbyawards.com）は全て403で直接確認できず、WebSearchのスニペット（Motto公式ブログ記事「Motto® wins FWA Site of the Day」、Medium「FWA OF THE DAY — Motto」等）から評価点を分析した**。5つの評価ポイント: ①タイポグラフィ＝PP Neue Montreal×Non Natural Groteskの太さの効いたペアリングで機関としての信頼感を出す、②配色戦略＝シグネチャーだった黒基調のサイトをクールなグレー/白へ反転させ「近寄りやすさ」を開いた大胆なリブランディング、③モーション＝全ページに一貫したマイクロインタラクションを配置し、体験全体を「建築的」に感じさせる、④インタラクション＝ヒーローセクションで文字単位のスプリットテキストアニメーションを使った登場演出、⑤審査軸の一貫性＝FWAが掲げる技術力・創造的革新性・ユーザーエンゲージメントという3軸を横断して評価される完成度。③④は既存の`GiantTitle`（マウス追従スクイーズ＋文字ごとのスクロール登場）・`RevealText`（文字単位のマスク登場）・累積してきた多数のマイクロインタラクション群と本質的に重複するため見送り、①のフォントペアリングも既存ブランドフォント指定（Titan One/Mochiy Pop One/Zen Kaku Gothic New/Noto Sans JP）を変更しない方針のため見送り、②の黒→グレー/白という配色反転もオレンジ/黒/白の3色ルールに反するため直接は採用しなかった。かわりに②の本質（硬質になりがちなデジタル表面に温かみ・近寄りやすさを与える）を、配色そのものではなく「質感」で翻訳することにした。`src/components/grain-overlay.tsx`（`feTurbulence`によるSVGノイズパターンをdata URIとして背景に敷き、`mix-blend-mode: overlay`・`opacity-[0.045]`という極めて薄い設定で全ページに常時重ねる、静的（アニメーションなし）な軽量グレインテクスチャ。`pointer-events-none`・`aria-hidden`で操作性・アクセシビリティに影響なし）を新規作成し、`src/app/layout.tsx`で`CustomCursor`の直後・`SmoothScroll`の外側にグローバル適用した（`z-[15]`で通常コンテンツより上、`FullscreenMenu`(`z-50`)・`VideoModal`(`z-60`)・カスタムカーソル(`z-[999]`)・`IntroLoader`(`z-[9999]`)よりは下に配置し、モーダル等の視認性を妨げないことを確認）。ブランドカラー（オレンジ/黒/白）・フォント・コンテンツ・既存コンポーネントの挙動は一切変更していない。`npm install`後、`next build --webpack`・`next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した（このサンドボックス環境では今回はTurbopackビルドもGoogle Fontsの取得に失敗せず成功した）。Playwrightは`node_modules`に未インストールのためヘッドレスブラウザでの目視確認は省略し、かわり`npm run dev`起動後に`curl`でHTMLレスポンスに`grain-overlay`のクラスが実際に出力されていることを確認した。詳細はgit logのコミットメッセージ参照
- **2026-07-31（27回目）**: セッション開始時、`git status`はHEAD detachedかつクリーン。`git fetch`で`origin/site-brushup`をローカルに再作成し、前回セッション（26回目）以降の新規コミットが無いことを確認。まずユーザー指摘「全体的に文字が小さい」への対応状況をgit logで確認（`c700422`コミットで対応済み・HANDOVER 7節にも記録済み）したため、通常のブラッシュアップステップへ。node_modulesが未インストールだったため`npm install`を実施してから着手。Awwwards/FWA/CSSDAの直近日程は本HANDOVERで既に全て参考済みだったため対象を広げ、パリ拠点のデジタルプロダクションImmersive Garden制作「Montfort」（Awwwards・FWA・CSS Design Awards同時Site of the Day受賞、Awwwards評価7.62/Creativity 7.85/Usability 7.4。深いブルー`#29648e`×オフホワイト`#f4f6f8`の2色パレット、WebGLによる滑らかな3Dトランジション、遊び心のあるマイクロインタラクション、スクロール連動演出。制作会社インタビューでは「Montfort Groupの世界観にクラリティ（明快さ）をもたらし、唯一無二に感じさせることが目標だった」と紹介されていた）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/montfort、winners.webbyawards.com）は全て403で直接確認できず、WebSearchのスニペット（Immersive GardenのX/Twitter投稿、Awwwardsの評価スコア掲載記事）から評価点を分析した**。5つの評価ポイント: ①配色＝ブルー×オフホワイトの2色に絞り込んだミニマルなパレット、②3D/WebGLによる滑らかなセクション間トランジション、③マイクロインタラクションの遊び心、④スクロール連動演出、⑤「明快さ（クラリティ）をブランドの世界観にもたらす」という導入目的の一貫性——単なる技術デモではなく、複雑になりがちな企業サイトを「分かりやすく・唯一無二に感じさせる」という一段上の狙いのために演出を設計している点。①のブルー系配色は今日ポケのオレンジ/黒/白3色ルールに反するため見送り、②のWebGL本格3Dトランジションは技術スコープに合わないため見送り、③④はこれまで26回のブラッシュアップで数多くのホバー・スクロール演出（チルト・マグネティック・火花・パララックス等）を積み重ねてきており本質的に重複するため対象外とした。かわりに⑤「セクション間を移動する瞬間に、明快な区切りの体験を与える」という発想を、今日ポケのブランドカラーで軽量に翻訳することにした。従来、`FullscreenMenu`のナビ項目（プロフィール/メンバー/実績/動画/リンク）をクリックすると、メニューがフェードアウトしつつ`scrollToHash`でLenisのスムーズスクロールへ即座に移行していたが、区切りの瞬間を示す視覚的な合図が無かった。`src/lib/nav-transition.ts`（`scrollToHash`と同様の軽量なシングルトン。トリガー関数を登録・呼び出すだけの薄いラッパー）と`src/components/nav-transition.tsx`（画面上下から伸びるブランドオレンジの帯がGSAPで一瞬画面全体を覆い、`power3.inOut`イージングで即座に開いて中身を見せる「カーテン」演出。WebGLの3Dトランジションではなく、CSS `scaleY`+GSAPのみの軽量な2D演出で「明快な区切り」という本質だけを抽出。`prefers-reduced-motion`ではトリガー自体を無効化）を新規作成し、`src/app/layout.tsx`にグローバル1回だけマウント（`z-[65]`でフルスクリーンナビ`z-50`・動画モーダル`z-[60]`より上、カスタムカーソル`z-[999]`・`IntroLoader``z-[9999]`より下）、`fullscreen-menu.tsx`の各ナビリンククリック時に`playNavTransition()`を呼ぶよう連携した。既存の`scrollToHash`・Lenis+GSAP ScrollTriggerの連携（`smooth-scroll.tsx`）や、メニュー自体のフェードアウト挙動は変更していない。`npm install --no-save playwright`で一時的にPlaywrightを導入し（`package.json`は変更していないことを確認済み）、`npx next build --webpack`・`npx next build`（Turbopack）双方でビルド成功・型チェック通過・静的ページ生成まで確認した上で、`npm run dev`起動後にヘッドレスChromium（`/opt/pw-browsers/chromium`）から実際に「Menu」ボタン→「メンバー」リンクをクリックし、カーテンの`transform: scaleY(...)`が0→1→0と遷移すること、遷移後に正しく`#members`セクションまでスクロールされていることをDOM計測で確認した。詳細はgit logのコミットメッセージ参照

## 9. 2026-08-01〜02 セッション: Notion によるCMS化

`src/app/page.tsx` にハードコードしていたコンテンツを、Notion から取得する構成に変更した。

- **仕組み**: `src/lib/notion.ts` が `@notionhq/client` の `dataSources.query()` で Notion の各DBを読み、`fetchPublishedMembers(区分)` / `fetchStats()` / `fetchAchievements()` / `fetchVideos()` / `fetchLinks()` / `fetchSiteTexts()` を公開している。`page.tsx` の `Home()` がこれらを `Promise.all` で並列取得する
- **フォールバック設計（重要）**: `NOTION_TOKEN` が未設定、または取得結果が空の場合は `page.tsx` 先頭の `fallbackMembers` / `fallbackStats` / `fallbackAchievements` / `fallbackVideos` / `fallbackMainLinks` / `fallbackMemberLinks` / `fallbackTexts` にそのまま切り替わる。**Notion が落ちてもサイトは壊れない**。ローカルで Notion 無しで動かしたい場合も `.env.local` を空にすれば済む
- **メンバーDBの「区分」プロパティ**: `メインメンバー` / `スタッフ` で分岐し、前者を「メンバー紹介」、後者を「裏方メンバー」に出し分けている
- **再取得間隔**: `page.tsx` の `export const revalidate = 300`（5分）
- **設定手順**: https://www.notion.so/my-integrations で Internal Integration Secret を発行 → `.env.local` に `NOTION_TOKEN=` として設定 → Notion 側の「kyoupoke」ページにそのインテグレーションを接続する（`.env.example` に同じ説明あり）

## 10. 2026-08-02 セッション: レイアウトの読みやすさ仕上げ

直前の5コミットが「プロフィール本文の幅と揃え」をめぐる往復（左詰め→中央寄せ→左端揃え→カード列と同幅まで拡大）で終わっていたため、**主観で調整するのをやめ、稼働中の dev サーバーを 1440px / 375px で実測して数値で判断する**方針に切り替えた。

### 10.1 実測で見つかった問題と着地点

| 項目 | 変更前 | 変更後 |
|---|---|---|
| プロフィール本文の行長 | **76 全角字/行**（1377px ÷ 18px） | **37字/行** |
| 左右余白 | header/実績/リンク=40px、main(プロフィール・メンバー・動画)=**24px** で不揃い | 全セクション **64px**（`px-6 sm:px-10 lg:px-16`）に統一 |
| キャプション類のコントラスト | `text-neutral-400` で **2.37**（AA 4.5未満が23箇所） | `text-neutral-600` で **7.05** |
| 章番号「/05」 | `text-neutral-300` で **1.36** | `text-neutral-500` で **4.35** |
| 白文字 on オレンジ | `bg-brand`(#d9552e) で **3.97** | `bg-brand-dark`(#b8431f) で **5.44** |
| モバイルのメンバーカード本文 | 14px | 16px |
| モバイルの横スクロール | 位相により最大4px はみ出し | なし（8サンプルすべてで `scrollWidth === clientWidth`） |

### 10.2 判断基準（今後この往復を繰り返さないために）

- **本文の1行は40全角字前後を上限とする**（日本語の適正は35〜45字）。「余白が空いて見えるから本文を広げる」のは逆効果。幅を広げるのではなく、**見出しを左カラムに置く2カラム構成**で余白を埋める
- **横方向の余白は `CONTAINER` 定数（`src/app/page.tsx` 冒頭）に一本化する**。個別セクションに `px-*` を直接書かない。左端が1本の線で揃っているかは、全セクションの最初のコンテンツの `getBoundingClientRect().left` が一致するかで機械的に確認できる
- **白文字をオレンジに載せるときは必ず `bg-brand-dark`（#b8431f）を使う**。ブランドの `#d9552e` は白文字とのコントラストが3.97しかなくAA基準(4.5)に届かない。3色ルール（オレンジ/黒/白）は維持したまま、既存トークンの濃い方を使い分ける形で解決している

### 10.3 主な構造変更

- `src/components/site-header.tsx` を新規作成（`"use client"`）。ヘッダーを `page.tsx` から切り出し、`scrollY > 40` で `bg-white/85 + backdrop-blur-md + border-b` を付与するようにした。**黒（実績）・オレンジ（リンク）セクションの上でナビが読めない問題の解消**。以前の白い `text-shadow` グローによる誤魔化しは削除
- `src/components/section-heading.tsx` を新規作成。「章番号+英字ラベル」を1行にまとめ、その下に日本語見出しを置く2段構成を全5セクションで共通化した（内部で既存の `ChapterMark` / `RevealText` をそのまま使うのでアニメーションは維持）
- `<main>` がページ内に2つあった構造上の問題を、ヒーロー〜リンクを包む1つの `<main>` に統合して解消
- 明るいセクションの地色を `#f5f5f5` から白に統一（`SectionBlend` の `from`/`to` も追随）。これにより `bg-neutral-100` のタグピルが背景に埋もれなくなった
- 縦のリズムを `py-24 lg:py-32`（セクション間）/ `mt-10`（ブロック間）/ `mt-6`（見出し-本文間）の3段階に集約
- `overflow-x-clip` をページ最外周に付与。`LiveGlowFrame` の回転するグロー枠が回転位相によって数px はみ出すのを止める（`clip` は `hidden` と違いスクロールコンテナを作らないので、プロフィール見出しの `lg:sticky` は効いたまま）

### 10.4 検証方法

ブラウザのコンソールで実行できる計測スクリプトで確認している（同じ検証を再現したい場合の手順）。

1. **行長**: 全 `<p>`/`<li>` について `getBoundingClientRect().width ÷ fontSize` を出し、実際に折り返すもの（本文長 > 1行の字数）が45を超えていないこと
2. **左端の揃い**: 各セクションの最初のコンテンツの `left` が全て一致すること（1440pxで64px）
3. **コントラスト**: `oklch`/`lab` 表記や半透明色が混ざるので、canvas に白地・黒地の2回描画して премultiplied色とアルファを逆算し、祖先の背景を下から順に合成してから比を計算する（単純な文字列パースでは誤判定する。実際、最初の計測は `bg-white/10` を白地に合成してしまい誤った結果を出した）
4. **横スクロール**: `document.documentElement.scrollWidth <= clientWidth` を、回転アニメーションの位相を変えて複数回サンプリング
5. 残っている「未達」は `BlueprintCorners` の注記（写真の上に直接載る `aria-hidden` の装飾）のみ。背景色に頼れないため `text-shadow` で下地から浮かせる対応にした

**注記**: この環境ではブラウザの `requestAnimationFrame` が強く間引かれる（実測 約4fps）ため、Lenis のスムーズスクロールが一瞬でジャンプしているように見える。実際には動いている（クリック後 1009ms 時点で 2289px → 2606px と中間値を通過することを確認済み）。**この環境でスクロール演出を検証するときは、フレーム数ではなく中間値を通過しているかで判断すること。**

## 11. 2026-08-04 セッション: モバイル版ヒーローの作り直し

実機（iPhone）のスクリーンショットをユーザーから受け取りながら直す形で進行。**最初の2回は「横スクロールが出ていない」等の部分的な計測だけで完了報告してしまい、実機で崩れが残っていて指摘を受けた**。反省点は 11.4 に記載。

### 11.1 直した症状（すべて実機スクショで確認された実害）

| 症状 | 原因 |
|---|---|
| 両端の2人が見切れる | 横長写真(1601×1101)を縦長のヒーロー全体に `object-cover` で敷き、高さ基準で拡大されて横が切れていた |
| ステッカーがタイトルに重なる | ステッカーがセクション高さに対する `bottom-%` 指定で、モバイルの縦長画面ではテキストブロックの上に来ていた |
| 写真の下に巨大な空白ができる | 写真だけ縦横比を直したが、セクションは `min-h-[100svh]`・テキストは `mt-auto` で下端固定のままだったため、間に何もない帯が残った |
| SCROLL がタグラインに重なる | セクション高さを縮めたのに `absolute bottom-8` のままで、本文に食い込んだ |
| マスコット画像の左右に色違いの帯（PC） | `ParallaxImage` の既定が `object-contain` で、余った領域に `wrapperClassName` の `bg-[#df5330]` が見えていた |

### 11.2 最終的なモバイルのレイアウト方針

**フルスクリーンをやめ、コンテンツの分だけ縦に積む**構成に変更（`src/app/page.tsx` のヒーロー節）。

- 並び順は DOM 順のまま **タイトル → タグライン → 写真**。`order-*` は使わない（DOM 順と一致しているので不要）
- 写真は `-mx-6 w-[calc(100%+3rem)]` でセクションの `px-6` を打ち消して**全幅**に。左右が画面端に達するので横の継ぎ目が消える
- 写真の**上下だけ**を `mask-image` の縦 linear-gradient でフェード（`.hero-photo-fade` / `src/app/globals.css`）。四角い画像を貼った見た目を消すのが目的。上は顔に掛からないよう 9%、下は胴体〜背景なので 74%→100% と長く溶かす
- 写真の背後に暖色のにじみ（`blur-2xl` の radial）を敷き、フェードした外周が白地でぶつ切りにならないようにしている
- セクション背景にモバイル限定の暖色 radial-gradient（クリーム→アプリコット→白）。写真の地色と繋げるため
- `pb-0` にして写真の下端＝セクション下端。マスクがそこで透明になるので継ぎ目が出ない
- **「最新動画を公開中」リンクと SCROLL インジケーターはモバイルでは非表示**（`sm:` 以上のみ）。第一印象を名前に絞る／モバイルはスクロールが自明で、写真の下に置くと余白が間延びするため

### 11.3 sm(640px) 以上は一切変更していない

マスクは `@media (min-width: 40rem)` で `none`、背景グラデーションは `sm:bg-none sm:bg-white`、写真は `sm:absolute sm:inset-0` で従来通り全画面に敷く。変更前後で h1 の位置が 465–612px と一致することを実測して確認済み。

### 11.4 反省と、次に同じ作業をするときの手順

- **`scrollWidth === clientWidth`（横スクロールなし）は「崩れていない」の証明にならない**。縦方向の重なり・空白は別途見る必要がある
- **要素の矩形を測るだけでなく、必ず `computer{action:"screenshot"}` で実際に目視する**。今回、上下のマスクを最初 radial-gradient で書いたが、辺の中点は不透明のままで**ハッキリした直線が残っていた**。これは座標計測では絶対に気付けず、スクリーンショットを見て初めて分かった
- この環境では `preview_start` 直後はペインが未表示でスクリーンショットが5秒でタイムアウトすることがある。`resize_window` を挟むと撮れるようになる。**なお過去メモの「resize_window は効かない」は誤りで、現在は正常に動作する**
- ページ初回表示は `IntroLoader` が数秒出るので、リロード直後は `wait` を挟んでから撮る
- デスクトップ幅ではペインのスクリーンショットが極端に縮小されて描画されることがある。その場合は `getBoundingClientRect()` の数値で判断する
- 確認した幅: **320 / 375 / 639 / 640 / 1280**。639↔640 の切り替わりが破綻しないことまで見ること
