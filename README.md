# 今日ポケch. ファンサイト

今日ポケ（[@KYOUPOKE](https://www.youtube.com/@KYOUPOKE)）の非公式ファンサイト。
Next.js / TypeScript / Tailwind CSSで制作し、Notionでコンテンツを管理しています。

## 現在の公開先

| 用途 | URL | 更新方法 |
|---|---|---|
| 本番・既存URL | https://kyoupoke-channel-site.vercel.app | GitHub main → Vercel |
| Cloudflare試験版 | https://kyoupoke-channel-site-preview.kc2424-buzz.workers.dev | 下記のCloudflareデプロイコマンド |

Cloudflare試験版は検索除外とし、canonicalは本番URLを維持しています。
`vercel.app`はVercelのドメインなのでCloudflareへ移管できません。Cloudflare本番化にはworkers.devのURLを正式採用するか、独自ドメインを用意します。

**引き継ぎは [CURRENT_STATUS.md](CURRENT_STATUS.md) と [CLOUDFLARE.md](CLOUDFLARE.md) から読んでください。**
`HANDOVER.md` / `MAKER_STATE.md` は過去の作業記録です。

## このMacでの開発

Node.js 24とnpmを使用します。別OSのnode_modulesをコピーせず、各PCでインストールしてください。

```sh
npm ci
cp .env.example .env.local
# .env.local の NOTION_TOKEN を設定する（既に設定済みならコピー不要）
npm run dev
```

http://localhost:3000 を開きます。Notion未設定時はコード内の代替コンテンツが表示されるため、本番と同じ内容を確認するにはキーが必要です。
このMacでは `.env.local` 設定済みです。秘密の値はGitに登録しません。

```sh
npm run lint
npm run build
```

## Cloudflareの試験・更新

```sh
npx wrangler login               # このMacでは認証済み
npm run cf:typegen
npm run build:vinext
npm run start:vinext             # http://localhost:8787
```

Cloudflareローカル実行では `.dev.vars` にNOTION_TOKENを設定します。雛形は `.dev.vars.example`。このMacでは設定済みです。

```sh
npm run cf:dry-run               # ビルド済み成果物を検査（公開しない）
npm run deploy:cloudflare        # 再ビルドして試験Workerへ公開
```

Notionキーを変更したときだけ `npm run cf:secret` でCloudflareへ登録し直します。接続先は試験Workerに限定しています。
Cloudflare側のGitHub自動デプロイは未接続です。GitHubへpushしただけではCloudflareは更新されません。

## 主な編集箇所

- `src/app/page.tsx`: トップのレイアウト・Notion未接続時の代替コンテンツ
- `src/app/globals.css`: ブランドカラー・全体スタイル
- `src/lib/notion.ts`: Notion取得とデータソースID
- `src/content/news.ts`: お知らせ取得・代替記事
- `src/lib/seo.ts`: メタデータ・canonical・検索設定
- `vite.config.ts` / `wrangler.jsonc`: Cloudflare試験版の設定

紹介文・実績・通常のお知らせ更新はNotionを編集します。トップ・お知らせの再検証間隔は300秒です。
問い合わせフォームの宛先は仮アドレスのままです（`src/components/contact-form.tsx`）。
mainへの直接変更・force pushは行わず、作業ブランチで確認します。詳細は [AGENTS.md](AGENTS.md) を参照してください。
