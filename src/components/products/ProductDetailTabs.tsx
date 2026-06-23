"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadTab } from "./DownloadTab";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { formatDate } from "@/lib/format";
import { pickLocale } from "@/lib/i18n-json";
import type { ProductDto } from "@/lib/data/types";
import { PlatformBadge } from "./PlatformBadge";

type ProductDetailTabsProps = {
  product: ProductDto;
  locale: string;
  baseUrl: string;
};

export function ProductDetailTabs({
  product,
  locale,
  baseUrl,
}: ProductDetailTabsProps) {
  const t = useTranslations("products");

  return (
    <Tabs defaultValue="download" className="w-full">
      <TabsList>
        <TabsTrigger value="download">{t("tabDownload")}</TabsTrigger>
        <TabsTrigger value="reviews">
          {t("tabReviews")} ({product.reviewCount})
        </TabsTrigger>
        <TabsTrigger value="changelog">{t("tabChangelog")}</TabsTrigger>
      </TabsList>

      <TabsContent value="download">
        <DownloadTab
          platforms={product.platforms}
          locale={locale}
          productSlug={product.slug}
          baseUrl={baseUrl}
        />
      </TabsContent>

      <TabsContent value="reviews" className="space-y-8">
        <ReviewList reviews={product.reviews} locale={locale} />
        <ReviewForm productId={product.id} locale={locale} />
      </TabsContent>

      <TabsContent value="changelog">
        {product.changelog.length === 0 ? (
          <p className="text-text-muted">{t("noChangelog")}</p>
        ) : (
          <ul className="space-y-4">
            {product.changelog.map((entry) => (
              <li key={entry.id} className="rounded-xl glass-panel p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-text-primary">
                    v{entry.version}
                  </span>
                  {entry.platform && (
                    <PlatformBadge platform={entry.platform} locale={locale} />
                  )}
                  <time className="text-xs text-text-muted">
                    {formatDate(entry.date, locale)}
                  </time>
                </div>
                <p className="text-sm text-text-muted">
                  {pickLocale(entry.notesJson, locale)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
