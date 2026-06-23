"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-bg-glass p-0.5 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors min-h-9 min-w-9",
            locale === loc
              ? "bg-accent-primary text-bg-deep"
              : "text-text-muted hover:text-text-primary",
          )}
          aria-current={locale === loc ? "true" : undefined}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
