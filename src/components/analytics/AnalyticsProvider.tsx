"use client";

import { PageViewBeacon } from "@/components/analytics/PageViewBeacon";

type AnalyticsProviderProps = {
  locale: string;
  children: React.ReactNode;
};

export function AnalyticsProvider({ locale, children }: AnalyticsProviderProps) {
  return (
    <>
      <PageViewBeacon locale={locale} />
      {children}
    </>
  );
}
