import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "ps", "en"],
  defaultLocale: "fa",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: Locale[] = ["fa", "ps"];

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localeLabels: Record<Locale, string> = {
  fa: "دری",
  ps: "پښتو",
  en: "EN",
};
