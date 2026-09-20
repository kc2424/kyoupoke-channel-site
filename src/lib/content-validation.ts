/** CMS/RSSの境界で使用する、ネットワークに依存しない検証。 */
export function validSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 160;
}

export function validVideoId(value: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}

export function safeExternalUrl(value: string): string | undefined {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password && parsed.hostname
      ? parsed.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function safeImagePath(value: string): string | undefined {
  if (
    /^\/(?!\/)[A-Za-z0-9/_-]+\.(?:png|jpe?g|webp|avif)$/i.test(value) &&
    !value.split("/").includes("..")
  ) return value;
  const external = safeExternalUrl(value);
  if (!external) return undefined;
  const parsed = new URL(external);
  return parsed.hostname === "img.youtube.com" &&
    /^\/vi\/[A-Za-z0-9_-]{11}\/(?:default|mqdefault|hqdefault|sddefault|maxresdefault)\.jpg$/.test(parsed.pathname)
    ? external
    : undefined;
}

/** 日付のみなら日本時間0時、日時なら明記されたタイムゾーンを採用する。 */
export function publicationTimestamp(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) {
    return undefined;
  }
  const day = value.slice(0, 10);
  const calendarDate = new Date(`${day}T00:00:00Z`);
  if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== day) {
    return undefined;
  }
  const timestamp = Date.parse(value.length === 10 ? `${value}T00:00:00+09:00` : value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

export function isPublishedBy(value: string, now = Date.now()): boolean {
  const timestamp = publicationTimestamp(value);
  return timestamp !== undefined && timestamp <= now;
}

export function formatPublicationDate(value: string): string {
  const timestamp = publicationTimestamp(value);
  if (timestamp === undefined) return "日付未設定";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(timestamp);
}

/** JSONの文字列中でもHTMLパーサーは </script> を解釈するため必ずエスケープ。 */
export function serializeJsonLd(value: object): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
