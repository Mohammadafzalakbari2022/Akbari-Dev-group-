"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Package } from "lucide-react";
import type { PlatformType, ProductStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { filterProducts } from "@/lib/data/products";
import type { ProductListItem } from "@/lib/data/types";

type ProductsGridProps = {
  products: ProductListItem[];
  locale: string;
};

const PLATFORMS: (PlatformType | "all")[] = [
  "all",
  "android",
  "ios",
  "web",
  "desktop",
  "database",
  "other",
];

export function ProductsGrid({ products, locale }: ProductsGridProps) {
  const t = useTranslations("products");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<PlatformType | "all">("all");
  const [status, setStatus] = useState<ProductStatus | "all">("all");

  const filtered = useMemo(
    () => filterProducts(products, locale, { search, platform, status }),
    [products, locale, search, platform, status],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted inset-inline-start-3 pointer-events-none" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
            aria-label={t("searchPlaceholder")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value as PlatformType | "all")
            }
            className="h-11 rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary"
            aria-label={t("filterPlatform")}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? t("allPlatforms") : t(`platform.${p}`)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ProductStatus | "all")
            }
            className="h-11 rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary"
            aria-label={t("filterStatus")}
          >
            <option value="all">{t("allStatuses")}</option>
            <option value="published">{t("statusActive")}</option>
            <option value="archived">{t("statusArchived")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center rounded-xl glass-panel py-16 px-8 text-center">
          <Package className="h-12 w-12 text-text-muted mb-4" />
          <p className="text-lg font-medium text-text-primary">
            {t("noResults")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
