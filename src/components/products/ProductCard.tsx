"use client";

import { Star, Download, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickLocale } from "@/lib/i18n-json";
import { formatDownloadCount } from "@/lib/format";
import type { ProductListItem } from "@/lib/data/types";
import { PlatformBadge } from "./PlatformBadge";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductListItem;
  locale: string;
};

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("products");
  const name = pickLocale(product.nameJson, locale);
  const tagline = pickLocale(product.taglineJson, locale);
  const showNew =
    product.isNew &&
    (!product.isNewUntil || product.isNewUntil > new Date());

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl glass-panel overflow-hidden transition-all",
        "hover:border-accent-primary/30 hover:shadow-lg hover:shadow-accent-primary/5 hover:-translate-y-0.5",
      )}
    >
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {product.iconUrl ? (
              <RemoteImage
                src={product.iconUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-accent-primary/15 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-accent-primary" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-semibold text-text-primary truncate">{name}</h2>
              <p className="text-sm text-text-muted line-clamp-2">{tagline}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.featured && (
            <Badge variant="warm">{t("featured")}</Badge>
          )}
          {showNew && <Badge variant="default">{t("new")}</Badge>}
          {product.platforms.map((p) => (
            <PlatformBadge
              key={p.platform}
              platform={p.platform}
              locale={locale}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            {product.reviewCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent-warm text-accent-warm" />
                {product.averageRating}
              </span>
            )}
            {product.downloadCount > 0 && (
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {formatDownloadCount(product.downloadCount, locale)}
              </span>
            )}
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/products/${product.slug}`}>{t("view")}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
