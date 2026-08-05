# Maker（実装役）状態管理ファイル

このファイルはMaker（夜間の自動ブラッシュアップ・クラウドルーティン、実装役）が毎回
参照・更新する。同じリポジトリ直下の `STATE.md` はChecker（検証役ルーティン）専用の
状態ファイルであり、`STATE.md` 側に明記されている通り「Maker役はこのファイルを編集
しません」というルールがあるため、Maker側の記録は本ファイルに分離した。
（2026-08-05: MakerとCheckerが同時刻にそれぞれ `STATE.md` を新規作成し衝突したため、
この分離を行った。）

## 引用済み受賞作品（重複禁止・毎回このリストを確認してから選定すること）

過去のコミットメッセージ（`git log site-brushup --grep="参考作品"`）から集計した実績:

1. 'kin（Awwwards/FWA/CSSDA同時受賞・Developer Award）
2. Montfort（Awwwards/FWA/CSSDA同時Site of the Day）
3. Motto（FWA Site of the Day）
4. Naiara Odriozola（CSS Design Awards）
5. Longbow（Awwwards SOTD）
6. PP Neue Montreal（Awwwards SOTD）
7. Mees Verberne（CSSDA/Awwwards/FWA受賞）
8. RISK（Awwwards SOTD）
9. Made With Gsap（Awwwards SOTD）
10. CoffeeTech（Awwwards SOTD）
11. Glitch&Grit（Awwwards SOTD）
12. Lama Lama（Awwwards SOTD）
13. Dragonfly Redux（Awwwards SOTD）
14. House of Honey（Awwwards SOTD）
15. IZANAMI（Awwwards SOTD）
16. Hiroto Sato（Awwwards SOTD）
17. NORMAL IS BORING（Awwwards SOTD）
18. TRIONN（Awwwards/FWA SOTD）
19. MONOLOG（Awwwards SOTD）
20. Spotify Wrapped Party（Awwwards SOTD）
21. Lacoste Polo Factory（Awwwards SOTD）
22. Partizan（Awwwards SOTD）
23. Hildén & Kaira（Awwwards SOTD）
24. Obys Experiment Space（Awwwards SOTD）
25. Der Baukasten（Awwwards/FWA SOTD）
26. Bucks Sauce（Awwwards SOTD）
27. Crazy About Eggs（Awwwards SOTD）
28. Artem Shcherbakov Portfolio（Awwwards SOTD）
29. Hearst Exhibit 2026（OSMOS PRO制作、Awwwards Site of the Day 2026-08-02、Developer Award）
30. Noomo Showcase（Noomo Agency制作、Awwwards Site of the Day 2026-08-01、総合スコア7.34）
31. **Lacoste Ace Breaker**（Merci-Michel制作、Awwwards Site of the Day 2026-08-03、Developer Award、総合スコア7.46）← 今回追加

次回以降は必ずこのリストに無い作品を選ぶこと。

## 既知の問題・回避策（Maker視点）

- **WebFetch がこの実行環境で awwwards.com 等の外部サイトに対しほぼ確実に403を返す**。過去の全セッションで再現。回避策: WebSearchのスニペット（Communication Arts、Codrops、Muzli等の紹介記事や検索結果の要約）から評価点を分析する。2026-08-05時点でも `https://www.awwwards.com/sites/hearst-exhibit-2026` はWebFetchで403だった。
- **`npm run build`（Turbopackデフォルト）がGoogle Fontsの取得に失敗して落ちることが過去にあった**（環境のネットワーク状況に依存、ベースコミットでも再現する場合はサンドボックス固有の既知問題としてそのままpushしてよい）。回避策として `next build --webpack` を使った実績もある。2026-08-05時点では `npm run build`（Turbopack）は問題なく成功した。
- `npm install` は毎回のセッション開始時に必要（`node_modules` はクリーンな環境ではコミットされていない）。
- `npm run lint` は本ルーティンの対象外の既存ファイル（`scramble-text.tsx`, `sound-toggle.tsx`, `video-modal.tsx` の `react-hooks/set-state-in-effect`、計4件）で既知のエラーが出るが、Checker側の`STATE.md`でも確認済みの通りビルド自体はブロックしない既存の技術的負債。今回変更したファイルには影響しない。
- **`main` ブランチと `site-brushup` ブランチは無関係な履歴に分岐している**（共通祖先が無い状態）。Checkerの`STATE.md`でも同様の指摘あり。Maker/Checkerどちらもこの分岐自体の解消は自分のスコープ外として扱っている。
- **並行実行時の衝突に注意**: 2026-08-05、MakerとCheckerがほぼ同時刻に`STATE.md`をそれぞれ新規作成しpushし、push時にconflictが発生した。今後は本ファイル（`MAKER_STATE.md`）のみをMakerが編集することで回避する。

## 直近の実行ログ

- **2026-08-05（29回目）**: Awwwards Site of the Day「Hearst Exhibit 2026」（OSMOS PRO制作、HearstCC / Edoardo Lunardi / Daniel Velasquez / Marjoe Bacus。ELLE・Esquire合同のハリウッド写真展を紹介するギャラリーサイト。2026-08-02 SOTD受賞、Developer Award同時受賞、総合スコア7.21）を参考に分析。**注記: WebFetch（awwwards.com）は今回も403で直接確認できず、WebSearchのスニペットから評価点を分析した**。5つの評価ポイント: ①配色の抑制＝わずか2色（#252525のほぼ黒、#E3E3E3のほぼ白）のミニマルパレットに絞り、写真そのものを主役にする哲学、②WebGLギャラリー＝写真展示に本格的なWebGLトランジションを使用、③GSAPによる滑らかなスクロール演出、④マイクロインタラクション＝ホバー・カーソル演出、⑤タイポグラフィと余白＝クリーンで抑制されたギャラリー的な余白の使い方。今日ポケのオレンジ/黒/白3色ルールに合わない本格WebGL（②相当）は見送り、また①はサムネイルに既に`MonoReveal`（グレースケール→カラー）で近い哲学を実装済みのため重複を避けた。今回は⑤の本質——「意味情報（キャプション）は常時表示せず、興味を持って触れた人にだけ差し出す」という展示物解説プレート的な節度——を抽出し独自実装した。
  - `src/components/gallery-caption.tsx`: 新規作成。`group/gallery`を付けた祖先要素にホバー/フォーカスした時だけ、下端から黒グラデーションのスクリムと共に展示キャプション（アイウォッシュラベル＋一言キャプション、ブランドオレンジの区切り線）が`clip-path`でスライドインする薄いラッパーコンポーネント。GSAP不使用の純CSS transition（既存の`MonoReveal`/`UnderlineLink`と同じ設計方針を踏襲）。
  - `src/app/page.tsx`: 「Meet the Members」の実写マスコットバナー（`hero-mascots.png`）にのみ適用。既存の`BlueprintCorners`の常時表示ラベルは変更せず残し、`GalleryCaption`をホバー時だけ追加で現れる第二層の情報として重ねた。他のセクション（実績カード・動画サムネイル等）には適用せず、節度を保った。
  - ビルド結果: `npm install` → `npm run build`（Turbopack）で成功。型チェック・静的ページ生成まで確認済み。`npm run lint` は上記の既知の問題（本変更と無関係な3ファイル・計4件）のみでビルドはブロックされない。
  - `STATE.md`衝突の経緯: 当初`STATE.md`を新規作成してpushしようとしたところ、Checkerロールが同時刻に別内容の`STATE.md`をpushしており衝突。rebaseの上、Checker側の`STATE.md`をそのまま残し、Maker用の記録は本ファイル（`MAKER_STATE.md`）に分離した。
  - コミットハッシュ: （このコミット自体。`git log -1`参照）
- **2026-08-05（30回目）**: Awwwards Site of the Day「Noomo Showcase」（Noomo Agency制作。Salesforce・AMD・Coinbaseなど大手ブランド案件を紹介するエージェンシーの実績ショーケースサイト。2026-08-01 SOTD受賞、総合スコア7.34／design 7.29・usability 7.06・creativity 7.79・content 7.51）を参考に分析。**注記: 今回もWebFetch（awwwards.com）は403で直接確認できず、WebSearchのスニペット（Awwwardsの個別インスピレーションページ「Noomo Showcase - Project Hover」「3D hover effect」等の紹介文・スコア情報）から評価点を分析した**。5つの評価ポイント: ①3Dホバープレビュー＝プロジェクト項目にカーソルを合わせると、その場でクリックせずとも中身の質感が伝わる3D/WebGLプレビューが浮かぶ「触れる前に見せる」設計、②WebGL/Three.js/GSAPを使った没入型のモーション演出、③エディトリアルな余白とレイアウトでポートフォリオを見せる構成、④カーソル追従のマイクロインタラクション、⑤4項目（design/usability/creativity/content）で偏りなく高スコアという総合力の高さ。今日ポケのオレンジ/黒/白3色ルールと軽量なCSS/GSAP構成に対し本格的なWebGL/3D（①②相当そのもの）は不釣り合いなため見送り。今回は④の本質——「カーソルに寄り添って“これから見に行く場所”の手がかりを差し出す」というプレビュー体験——を、画像やWebGLを使わずタイポグラフィのみで抽出し独自実装した。
  - `src/components/custom-cursor.tsx`: 既存のカスタムカーソル（リング/ドット/ラベル追従）を拡張。新たに`previewIndex`ステートを追加し、ホバー対象の`data-cursor-index`属性を読み取って、カーソル追従ラベルの上に「区切り線＋セクション番号（例: 03 / 05）」の小さなインデックスチップを重ねて表示するようにした。既存の`labelX/labelY`の位置トラッキング（GSAP `quickTo`）や`mix-blend-difference`の仕組みはそのまま踏襲し、新しい追従ロジックは追加していない。
  - `src/components/underline-link.tsx`: `cursorLabel`・`cursorIndex`の任意propsを追加し、`data-cursor-label`・`data-cursor-index`として`<a>`要素へ橋渡しするだけの薄い変更。デフォルトでは何も指定しなければ従来通り無属性のまま。
  - `src/app/page.tsx`: ヘッダーのグローバルナビ（プロフィール/メンバー/実績/動画/リンク）の`UnderlineLink`にのみ`cursorLabel`（ナビ項目名）と`cursorIndex`（"01 / 05"形式の連番）を付与。他のリンク（YouTubeへ/SNS等）には適用せず、「これから移動するセクションの手がかりを事前に見せる」というナビゲーション文脈に限定して節度を保った。
  - ビルド結果: `npm install` → `npm run build`（Turbopack）で成功。型チェック・静的ページ生成まで確認済み。`npm run lint` は既知の問題（本変更と無関係な3ファイル・計4件の`react-hooks/set-state-in-effect`）のみでビルドはブロックされない。Playwrightがこの環境に未インストールのため実ブラウザでの目視スクリーンショット確認は今回省略した（コード変更は既存の`data-cursor-label`機構を素直に拡張したのみで、リスクは低いと判断）。
  - コミットハッシュ: （このコミット自体。`git log -1`参照）
- **2026-08-05（31回目）**: Awwwards Site of the Day「Lacoste Ace Breaker」（Merci-Michel制作。Roland Garros開催に合わせたLacosteのブラウザゲーム、ブロック崩し風のテニステーマゲームで本物のチケット・ポロシャツが当たる企画。2026-08-03 SOTD受賞、Developer Award同時受賞、総合スコア7.46）を参考に分析。**注記: 今回もWebFetch（awwwards.com/sites/lacoste-ace-breaker）は403で直接確認できず、WebSearchのスニペット（Awwwards掲載記事・紹介ブログの評からの要約）から評価点を分析した**。5つの評価ポイント: ①パワーアップ等のアイコノグラフィをLacosteブランドカラー（グリーン/ホワイト/イエロー）で色分けし、本文を読まずとも一目で種類が伝わる高コントラストな「即時可読性」の設計、②ワンバーブ（ブロックを崩す、の一動作）に絞ったゲームメカニクスによる導線のシンプルさ、③本番プレイ前に簡潔なルール・特典説明画面を挟むオンボーディング、④リーダーボード＋実際の景品というリプレイ性を生むゲーミフィケーション、⑤WebGL/Three.jsによる本格的な3D演出。今日ポケのオレンジ/黒/白3色ルールと軽量なCSS構成に対し、本格的なゲーム実装（②③④相当）やWebGL（⑤）は規模・工数の面で不釣り合いなため見送り。今回は①の本質——「本文を読む前に、色分けされたアイコンだけで種類が一目で伝わる」設計——を、実績セクションのカードに抽出し独自実装した。
  - `src/components/achievement-icon.tsx`: 新規作成。実績カード用の丸バッジアイコンコンポーネント。award（トロフィー）/tv/controller/globe/live/cardsの6種類の線画SVGアイコンを用意し、カードの背景トーン（オレンジ/黒）に応じてバッジの配色を反転（オレンジ背景カードには白バッジ+オレンジ文字のアイコン、黒背景カードにはオレンジバッジ+白アイコン）することで、既存のブランド3色のみで高コントラストな色分けを実現。GSAP不使用の純SVG+CSSで既存コンポーネント群と同じ軽量方針を踏襲。
  - `src/app/page.tsx`: 「実績・出演」セクションの`achievements`データ配列に`icon`フィールド（表示用メタデータのみ）を追加し、各`SparkTap`カードの本文テキストの前に`AchievementIcon`を配置。ラベル・サブテキスト・トーン等の既存事実情報は一切変更していない。
  - ビルド結果: `npm install` → `npm run build`（Turbopack）はこの実行環境でGoogle Fonts取得に失敗し既知の問題として再現（`next build --webpack`では正常に成功しTypeScriptチェック・静的ページ生成まで確認済み。これは本変更が原因ではなく既知の環境要因）。`npm run lint` は既知の問題（本変更と無関係な3ファイル・計4件の`react-hooks/set-state-in-effect`）のみで、新規/変更ファイル（achievement-icon.tsx, page.tsx）にlintエラーなし。dev serverを起動しHTML応答（200、実績・出演の文言を含む）を確認。Playwrightがこの環境に未インストールのため実ブラウザでの目視スクリーンショット確認は省略。
  - コミットハッシュ: （このコミット自体。`git log -1`参照）
