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

## 動作を確認する

```sh
npm run lint
npm run build
```

## 運用資料

本番はVercel、試験版はCloudflare Workersで公開しています。

- Cloudflare試験版の手順と公開履歴は、監査改善ブランチの [CLOUDFLARE.md](https://github.com/kc2424/kyoupoke-channel-site/blob/1fd7b54fd3f16143152a19e5152cb754ab041933/CLOUDFLARE.md) と [CURRENT_STATUS.md](https://github.com/kc2424/kyoupoke-channel-site/blob/1fd7b54fd3f16143152a19e5152cb754ab041933/CURRENT_STATUS.md) を参照してください。

リポジトリ管理者は [kc2424](https://github.com/kc2424) です。
