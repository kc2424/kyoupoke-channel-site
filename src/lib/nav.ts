// ヘッダー・ハンバーガーメニュー・フッターで共有するナビゲーション定義。
// トップ1枚に集約するhub-and-spoke構成のため、お知らせ以外は全てトップ内のアンカー。

export type NavItem = {
  label: string;
  /** トップページ内のアンカーは "#id"、別階層のページは "/news" のような絶対パス。 */
  href: string;
};

export const navItems: NavItem[] = [
  { label: "プロフィール", href: "#profile" },
  { label: "メンバー", href: "#members" },
  { label: "実績", href: "#achievements" },
  { label: "動画", href: "#videos" },
  { label: "お知らせ", href: "/news" },
  { label: "SNS", href: "#links" },
  { label: "お問い合わせ", href: "#contact" },
];

/**
 * トップ以外のページからはアンカーだけでは飛べないので、"/#profile" 形式に直す。
 * isHome が true のときはそのまま返し、Lenisのスムーススクロールに任せる。
 */
export function resolveNavHref(href: string, isHome: boolean): string {
  if (!href.startsWith("#")) return href;
  return isHome ? href : `/${href}`;
}

export const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@KYOUPOKE" },
  { label: "X（旧Twitter）", href: "https://x.com/KYOUPOKEch" },
  { label: "Instagram", href: "https://www.instagram.com/kyoupokeexpress" },
  { label: "TikTok", href: "https://www.tiktok.com/@kyoupoke" },
  { label: "今日ポケ SHOP", href: "https://kyoupoke.shop" },
];
