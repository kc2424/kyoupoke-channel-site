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
29. **Hearst Exhibit 2026**（OSMOS PRO制作、Awwwards Site of the Day 2026-08-02、Developer Award）← 今回追加

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
