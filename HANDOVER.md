# 今日ポケ ファンサイト 引き継ぎ書

最終更新: 2026-07-30（自動ブラッシュアップルーティンにより、「Meet the Members」バナーへ折り目めくり演出を追加する対応まで）

## 1. プロジェクト概要

今日ポケ（KYOUPOKE / @KYOUPOKE）の**非公式ファンサイト**。
本人・関係者による公式サイトではなく、ファンが個人的に制作したもの。

- ローカルパス: `C:\Users\0124o\バイブコーディング練習\kyoupoke-channel-site`
- GitHubリポジトリ: https://github.com/kc2424/kyoupoke-channel-site （**Private**）
- 本番URL: https://kyoupoke-channel-site.vercel.app
- **Vercel Authentication が有効**（Vercelアカウントでログインしていない人は閲覧不可。非公開状態を維持するための設定）
- **作業ブランチ: `site-brushup`**（`main` とは別）。2026-07-30時点、見た目まわりの作業はすべてこのブランチで進行中。`main` にマージするかは未定（ユーザー確認待ち）

## 2. 技術スタック

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

- ~~【優先】全体的に文字が小さいので、もっと大きくする~~ → **対応済み**（2026-07-29自動ブラッシュアップ。`src/app/page.tsx`のセクションラベル（About/Members/Recognition/Videos/Links等の`text-xs`キャプション）・フッター注記・`member-card.tsx`の本文とタグ・`fullscreen-menu.tsx`のMenu/Closeボタンとロゴ・下部リンクに`lg:`サイズを追加。見出し（`lg:text-5xl`等）は元々大きめだったため対象外）
- おすすめ動画の実URL差し替え
- Instagram・TikTokリンクの追加
- Notion をCMS化して自分で更新できるようにする（会話中に提案済み・未着手）
- 個別メンバー写真があれば、グループ写真のクロップ処理から差し替え可能

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
