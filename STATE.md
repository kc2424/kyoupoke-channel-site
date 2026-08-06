# site-brushup 自動ブラッシュアップ Checker 状態ファイル

このファイルはChecker（検証役クラウドルーティン）が読み書きする状態ファイルです。
Maker役はこのファイルを編集しません。Checkerは自身の判定をここに追記し、次回実行時の
「前回チェック済みコミット」の判断材料にします。

## 既知の問題・回避策

- **lint: `react-hooks/set-state-in-effect`（4件）**: `src/components/intro-loader.tsx`・
  `src/components/scramble-text.tsx`・`src/components/sound-toggle.tsx`・
  `src/components/video-modal.tsx` で `npm run lint` がエラーになる。2026-08-05のChecker初回実行
  時点で、直近のMaker変更（f9d3e8f, 7576296）が触れていないファイルであり、それより前の
  `fc13e9a` 時点でも同じ4件が再現することを確認済み。2026-08-06のChecker実行（8回目）で
  `intro-loader.tsx` も同じエラー種別で既に含まれていたことを確認し（前回検証済みコミット
  `de3acfd` 時点で再現、今回のMaker変更 `348cd5f` 由来ではない）、リストを4ファイルに更新した。
  今回の変更が原因ではない既知の技術的負債として扱う。将来のChecker実行でもこの4ファイル由来の
  同じ4件はビルド判定のブロッカーにしない（新しいファイル・別のエラー内容が増えていないかは
  毎回確認すること）。
- **`npm run build`（Turbopack）がサンドボックスでGoogle Fonts取得に失敗することがある**:
  HANDOVER.md記載の通り、Maker側のセッションでも過去に発生している既知の環境要因。再現したら
  `next build --webpack` で切り分けるか、ベースコミットでも同じ失敗が起きるか確認すること。

## 直近の実行ログ

- **2026-08-05 (Checker初回実行)**: STATE.mdがsite-brushup/mainどちらにも存在しなかったため、
  本ファイルを新規作成。前回チェック済みコミットの記録が無いため、直近2コミット
  (`7576296` ナビ移動へオレンジのカーテン演出, `f9d3e8f` エディトリアル見出し帯へスクロール連動の
  重み演出) を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認、origin/mainとsite-brushupは無関係な履歴に分岐して
    いるが、これは今回の2コミットの範囲外の既存事象であり今回の判定対象外とした）
  - 各コミットは1回で1テーマの変更に限定されており、無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md相当のファイル（HANDOVER.md）は実行ログの追記のみで、既存内容の不自然な書き換えなし
  - `npm install` → `npm run build`（Turbopack）: 成功
  - `npm run lint`: 上記「既知の問題」の4件のみで失敗。`fc13e9a`（検証対象コミットより前）でも
    同じ4件が再現することを確認し、今回の変更由来ではないと判断
  - **判定: PASS**（対象コミット: `f9d3e8f7ea02f60e2d31137f3824b3f06f847a7c`）
- **2026-08-05 (Checker 2回目実行)**: 前回チェック済み以降の新規コミット `1da6334`（Meet the Membersバナーへギャラリー風キャプション演出を追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）
  - 変更ファイルは4件（HANDOVER.md, MAKER_STATE.md新規, src/app/page.tsx, src/components/gallery-caption.tsx新規）で、いずれも今回のテーマ（ギャラリーキャプション演出）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。追加したキャプション中の人物名（くろこ/いろは/バンビー）は既存本文と一致することを確認
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、代わりにMaker専用の`MAKER_STATE.md`を新設して分離する対応が取られていた（前回実行時のSTATE.md衝突を受けた適切な対応）
  - `npm install` → `npm run build`（Turbopack）: 成功
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規追加ファイル(gallery-caption.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `1da6334f8e35c22dcb1ecad6e3254573f6a90a34`）
- **2026-08-05 (Checker 3回目実行)**: 前回チェック済み以降の新規コミット `d364046`（Noomo Showcase(Awwwards SOTD)を参考にヘッダーナビへカーソル追従のセクションプレビューを追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）
  - 変更ファイルは4件（MAKER_STATE.md, src/app/page.tsx, src/components/custom-cursor.tsx, src/components/underline-link.tsx）で、いずれも今回のテーマ（ヘッダーナビのカーソル追従セクションプレビュー）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。ヘッダーナビ項目のラベル文字列も既存のnavItems定義をそのまま参照しており改変なし
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack）: 成功
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規/変更ファイル(custom-cursor.tsx, underline-link.tsx, page.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `d3640465667f56e76b5c1ecef1aa05fc39ea010b`）
- **2026-08-05 (Checker 4回目実行)**: 前回チェック済み以降の新規コミット `de79dd0`（Lacoste Ace Breaker(Awwwards SOTD)を参考に実績カードへ色分けアイコンバッジを追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）
  - 変更ファイルは3件（MAKER_STATE.md, src/app/page.tsx, src/components/achievement-icon.tsx新規）で、いずれも今回のテーマ（実績カードの色分けアイコンバッジ）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績のlabel/sub文言・トーン等の既存事実情報は一切変更なし。`icon`フィールドの追加のみを確認
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack、`git worktree`で隔離した作業ツリーで実行）: 成功（今回はGoogle Fonts取得も問題なく完了）
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規/変更ファイル(achievement-icon.tsx, page.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `de79dd0c713af09d566cd8c6dbba9bd8028a2248`）
- **2026-08-05 (Checker 5回目実行)**: 前回チェック済み以降の新規コミット `29faf7c`（2xA Studio(Awwwards SOTD)を参考にセクション境界へ決定論的な生成トレース演出を追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）。fetch時に「main forced update」の表示が出たが、これはこのセッションのローカルリポジトリがmainを未追跡だったための単発の非fast-forward更新であり、origin/main自体への不審な書き換えではないことを確認（origin/mainの直近履歴は今回検証対象のsite-brushup側コミットと無関係な、モバイルヒーロー画像調整等の別セッションの正当な作業）
  - 変更ファイルは3件（MAKER_STATE.md, src/app/page.tsx, src/components/generative-trace.tsx新規）で、いずれも今回のテーマ（セクション境界への決定論的な生成トレース演出）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。page.tsxの変更は既存4箇所のSectionBlendをrelativeなdivで包み、GenerativeTraceを重ねただけで文言・データの改変なし
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし（de79dd0..HEADで差分ゼロを確認。origin/mainとの差分に@notionhq/clientの有無があるが、これは既知の無関係な履歴分岐によるものでMakerの今回変更とは無関係）
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack、`git worktree`で隔離した作業ツリーで実行）: 成功
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規/変更ファイル(generative-trace.tsx, page.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `29faf7cfa57b010acf24ee342cef3786a2b53a02`）
- **2026-08-05 (Checker 6回目実行)**: 前回チェック済み以降の新規コミット `79167d6`（The Triadic Ballet AI(CSS Design Awards WOTD)を参考にセクション毎の舞台色インデックスを追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）。origin/mainとsite-brushupは既存の無関係な履歴分岐のままで、今回の対象コミットの範囲外
  - 変更ファイルは3件（MAKER_STATE.md, src/app/page.tsx, src/components/act-index.tsx新規）で、いずれも今回のテーマ（セクション毎の舞台色インデックス）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。page.tsxの変更は新規`acts`配列（既存navItemsと対のid/label/toneのみ）の追加と`<ActIndex acts={acts} />`の1箇所挿入のみで、toneは既存ChapterMarkのtoneと一致
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack、`git worktree`で隔離した作業ツリーで実行）: 成功
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規/変更ファイル(act-index.tsx, page.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `79167d695864f7e272da2da806600e7c5a4145d7`）
- **2026-08-05 (Checker 7回目実行)**: 前回チェック済み以降の新規コミット `9b8c5cb`（Motiondeep(CSS Design Awards WOTD)を参考におすすめ動画サムネイルへフレームスクラブ演出を追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）。origin/mainとsite-brushupは既存の無関係な履歴分岐（`no merge base`）のままで、今回の対象コミットの範囲外
  - 変更ファイルは3件（MAKER_STATE.md, src/app/page.tsx, src/components/frame-scrub.tsx新規）で、いずれも今回のテーマ（おすすめ動画サムネイルのフレームスクラブ演出）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。page.tsxの変更は「おすすめ動画」サムネイルの`<Image>`単体を`<FrameScrub videoId={v.videoId} />`に置き換えたのみで、動画ID・タイトル等は不変。未使用になった`next/image`直接importの削除も確認
  - public/icon.png・public/hero-mascots.png等のブランド素材は変更なし
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack、`git worktree`で隔離した作業ツリーで実行）: 成功
  - `npm run lint`: 既知の問題（scramble-text.tsx/sound-toggle.tsx/video-modal.tsxの`react-hooks/set-state-in-effect`計4件）のみで失敗。新規/変更ファイル(frame-scrub.tsx, page.tsx)にlintエラーなし
  - **判定: PASS**（対象コミット: `9b8c5cbc8cd5b2bdbdaff416a8a0cf84e1b4ffa5`）
- **2026-08-06 (Checker 8回目実行)**: 前回チェック済み以降の新規コミット `348cd5f`（Serotoninn(Awwwards SOTD)を参考にヘッダーナビへセクション先出しのムードプレビューを追加）を検証対象とした。
  - mainブランチへの変更なし（読み取りのみ確認）。origin/mainの直近3件は本セッション開始前からの既存の別セッションの正当な作業（モバイルヒーロー調整等）で、今回の対象コミットとは無関係
  - 変更ファイルは3件（MAKER_STATE.md, src/app/page.tsx, src/components/nav-mood-preview.tsx新規）で、いずれも今回のテーマ（ヘッダーナビのムードプレビュー）に一貫。無関係な変更の混入なし
  - メンバー紹介文・実績数値・リンクURL等の事実情報は変更なし。`navMoodItems`は既存`navItems`のlabel/hrefをそのまま展開し、トーンは既存`acts`配列と一致。キャプション文言は新規の要約のみ
  - public/icon.png・public/hero-mascots.png等のブランド素材ファイル自体の差し替えはなし（既存パスを`<Image>`で参照しているのみ）
  - package.json / package-lock.json は変更なし
  - STATE.md自体はMaker側で改変されておらず、Maker専用のMAKER_STATE.mdへの追記のみ
  - `npm install` → `npm run build`（Turbopack、`git worktree`で隔離した作業ツリーで実行）: 成功
  - `npm run lint`: `intro-loader.tsx`・`scramble-text.tsx`・`sound-toggle.tsx`・`video-modal.tsx`の`react-hooks/set-state-in-effect`計4件のみで失敗。`intro-loader.tsx`は今回のdiffに含まれないファイルだが未知のエラーだったため、前回検証済みコミット`de3acfd`でも同じエラーが再現するかを個別に確認し、pre-existingであることを検証済み（今回の変更由来ではない）。新規/変更ファイル(nav-mood-preview.tsx, page.tsx)にlintエラーなし。上記「既知の問題」セクションを4ファイルに更新した
  - **判定: PASS**（対象コミット: `348cd5f`）
