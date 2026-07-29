# 🎮 今日ポケ ファンサイト

今日ポケ（[@KYOUPOKE](https://www.youtube.com/@KYOUPOKE)）の**非公式**ファンサイトです。
Next.js + Tailwind CSS で作られています。

## 📁 ファイル構成

```
kyoupoke-channel-site/
├── src/app/page.tsx     ページの中身（文章・動画・リンク）
├── src/app/layout.tsx   フォント・メタデータなど全体の設定
├── src/app/globals.css  ブランドカラーなどのテーマ設定
└── README.md            このファイル
```

## ✏️ 編集する場所

`src/app/page.tsx` の中の `TODO` コメント箇所が、書き換えるべき場所です。

- **プロフィール文**: `id="profile"` セクションの文章
- **メンバー紹介**: ファイル先頭の `members` 配列
- **おすすめ動画**: `id="videos"` セクションの `iframe` の `src="https://www.youtube.com/embed/動画ID"` の「動画ID」部分
  - 動画URL `https://www.youtube.com/watch?v=XXXXXXXXXXX` の `XXXXXXXXXXX` が動画IDです
- **SNSリンク**: ファイル先頭の `links` 配列に追加すると増やせます

## 👀 確認方法（ローカル）

初回のみ依存パッケージのインストールが必要です。

```
npm install
npm run dev
```

その後 `http://localhost:3000` をブラウザで開くと確認できます。

## 🚀 公開方法（Vercel・自分だけに非公開で）

1. `git push` すると GitHub 経由で Vercel が自動的にビルド・デプロイします
2. Vercel プロジェクトの **Settings → Deployment Protection** で **Vercel Authentication** が有効になっています
   - URLを知っている人でも Vercel アカウントでログインしていないと中身を見られません
