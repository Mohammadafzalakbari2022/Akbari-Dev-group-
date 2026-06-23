import type { Locale } from "@/i18n/routing";

export function formatDownloadCount(count: number, locale: string): string {
  if (count >= 1_000_000) {
    const val = (count / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return locale === "en" ? `${val}M` : `${val}M`;
  }
  if (count >= 10_000) {
    const val = (count / 1_000).toFixed(1).replace(/\.0$/, "");
    return locale === "en" ? `${val}k` : `${val}k`;
  }
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "fa-AF").format(
    count,
  );
}

export function formatDate(date: Date, locale: string): string {
  const tag = locale === "en" ? "en-US" : locale === "ps" ? "ps-AF" : "fa-AF";
  return new Intl.DateTimeFormat(tag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
