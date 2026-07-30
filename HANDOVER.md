# 今日ポケ ファンサイト 引き継ぎ書

最終更新: 2026-07-30（自動ブラッシュアップルーティンにより、実績カードへのタップ火花演出追加まで）

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
