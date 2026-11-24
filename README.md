# 今日ポケch. ファンサイト

ポケモン対戦を中心に活動するYouTuberグループ「今日ポケ」の非公式ファンサイトです。メンバー紹介、対戦実績、おすすめ動画、お知らせを掲載しています。

[ファンサイトを見る](https://kyoupoke-channel-site.vercel.app) · [今日ポケ公式YouTube](https://www.youtube.com/@KYOUPOKE)

Next.js、TypeScript、Tailwind CSSを使用し、メンバー紹介やお知らせなどの掲載内容はNotionで管理しています。

## ローカルで起動する

Node.js 24とnpmを用意し、リポジトリのルートで実行します。

```sh
npm ci --legacy-peer-deps
npm run dev
```

npm 11.19.0では通常の `npm ci` で依存関係の検証エラーが出るため、`--legacy-peer-deps` を指定します。

起動後に [http://localhost:3000](http://localhost:3000) を開きます。初期状態では同梱のサンプルデータで表示を確認できます。

### 環境変数（任意）

Notionの掲載内容を表示する場合は、対象データソースにアクセスできる連携キーを `NOTION_TOKEN` として、Git管理外の `.env.local` に設定します。[環境変数の雛形](.env.example)

### 情報の自動更新

本番の Vercel Schedules が毎朝6時台（日本時間）に `daily-content-sync` を実行します。トップとニュース一覧は約5分のキャッシュ期限後、次のアクセスでNotionの変更を反映します。最新動画3本は従来どおりYouTubeの公式フィードから取得します。

- **統計**　YouTube Data API v3 のチャンネル統計から、登録者数と総再生回数を取得します。Notionの統計DBには表示値とともに「取得値」（数値）と「確認日」（日付）を保存します。取得に失敗したときは前回値を表示します。
- **お知らせ**　対象の公式チャンネル・主催者の新着から、今日ポケの節目や出演、大会発表を出典付きで登録します。編集者が修正した記事は自動訂正の対象外です。再掲載を止めるには、Notionの記事を残して「公開」のチェックを外します。
- 対象は今日ポケ・テレビ東京「有吉ぃぃeeeee！」・成人男性三人組の公式YouTubeと、株式会社REJECTがPR TIMESで配信する公式発表です。公式Xの節目の告知も取得する場合は、X APIが利用できる `X_BEARER_TOKEN` を設定します。
- **実績**　公開済みのお知らせのうち、本人が発表した登録者の節目や、主催者が明記したREJECT杯の優勝を公式リンク付きで表示します。手動で登録した同じ実績の内容と公開設定を優先します。
- **設定と確認**　VercelのProductionに `NOTION_TOKEN`（統計・ニュースの読み書き権限）、`YOUTUBE_API_KEY`（YouTube Data API v3用）、`CRON_SECRET`（ランダムな共有シークレット）を設定します。変更後は本番を再デプロイしてください。結果はVercelのSchedulesに表示されます。各取得元の失敗はログで確認でき、正常に取得できた項目を更新します。
- 統計キーが未設定の間はニュースのみを更新し、実行ログに `stats.status: not_configured` を記録します。設定済みの取得元で障害が起きた場合は実行履歴にも失敗を記録します。

ローカルでは、必要な値を設定した `.env.local` で次のコマンドを実行すると、書き込みを行わずに更新予定の件数を確認できます。

```sh
node --env-file=.env.local --import tsx scripts/check-content-sync.ts
```

## 動作を確認する

```sh
npm run lint
npm run build
```

## 運用資料

本番はVercel、試験版はCloudflare Workersで公開しています。

- Cloudflare試験版の手順と公開履歴は、監査改善ブランチの [CLOUDFLARE.md](https://github.com/kc2424/kyoupoke-channel-site/blob/1fd7b54fd3f16143152a19e5152cb754ab041933/CLOUDFLARE.md) と [CURRENT_STATUS.md](https://github.com/kc2424/kyoupoke-channel-site/blob/1fd7b54fd3f16143152a19e5152cb754ab041933/CURRENT_STATUS.md) を参照してください。

リポジトリ管理者は [kc2424](https://github.com/kc2424) です。
