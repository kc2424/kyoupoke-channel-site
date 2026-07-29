# 🎮 今日ポケチャンネル ファンサイト

今日ポケチャンネル（[@KYOUPOKE](https://www.youtube.com/@KYOUPOKE)）の**非公式**ファンサイトです。
プレーンな HTML / CSS のみで作られていて、特別なインストール作業なしで編集・確認できます。

## 📁 ファイル構成

```
kyoupoke-channel-site/
├── index.html   ページの中身（文章・動画・リンク）
├── style.css    見た目（色・レイアウト）
└── README.md    このファイル
```

## ✏️ 編集する場所

`index.html` の中で `<!-- TODO: ... -->` と書かれている部分が、書き換えるべき場所です。

- **プロフィール文**: `<section id="profile">` の中の文章
- **おすすめ動画**: `<section id="videos">` の中、`iframe` の `src="https://www.youtube.com/embed/動画ID"` の「動画ID」部分
  - 動画URL `https://www.youtube.com/watch?v=XXXXXXXXXXX` の `XXXXXXXXXXX` が動画IDです
- **SNSリンク**: `<section id="links">` の中、`<ul class="sns-links">` に `<li>` を追加すると増やせます

## 👀 確認方法（ローカル）

`index.html` をダブルクリックするだけでブラウザに表示されます。特別なソフトは不要です。

## 🚀 公開方法（Vercel・自分だけに非公開で）

1. このフォルダを GitHub リポジトリにする（Git初期化 → push）
2. Vercel でそのリポジトリをインポートしてデプロイ
3. Vercel プロジェクトの **Settings → Deployment Protection** で **Vercel Authentication** を有効化
   - これにより、URLを知っている人でも Vercel アカウントでログインしていないと中身を見られなくなります
   - 無料(Hobby)プランでも利用できます

詳しい手順は、進める際に1ステップずつ案内します。
