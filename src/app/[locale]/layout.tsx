import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isRtlLocale, type Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { getSiteSettings } from "@/lib/data/site-settings";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const siteSettings = await getSiteSettings();
  const maintenance = siteSettings.maintenance.enabled;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh flex flex-col antialiased",
          locale === "en" && "font-en",
        )}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AnalyticsProvider locale={locale}>
              <Navbar />
              <main className="flex-1">
                {maintenance ? (
                  <MaintenanceScreen settings={siteSettings} locale={locale} />
                ) : (
                  children
                )}
              </main>
              {!maintenance && <Footer settings={siteSettings} />}
            </AnalyticsProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
