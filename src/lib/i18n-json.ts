import type { Locale } from "@/i18n/routing";

export type LocalizedString = Partial<Record<Locale, string>> & {
  fa?: string;
  ps?: string;
  en?: string;
};

export function pickLocale(value: unknown, locale: string): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const obj = value as LocalizedString;
  return obj[locale as Locale] ?? obj.fa ?? obj.en ?? obj.ps ?? "";
}

export function pickLocaleArray<T>(
  value: unknown,
  locale: string,
  mapper: (item: unknown) => T,
): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(mapper);
}
