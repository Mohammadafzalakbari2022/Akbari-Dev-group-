import { getPrisma } from "@/lib/prisma";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { emptyLocale } from "@/lib/admin/types";
import type { LocalizedString } from "@/lib/i18n-json";
import type { HeroFormData } from "@/lib/admin/actions";

export default async function AdminHeroPage() {
  const prisma = getPrisma();

  const [hero, products] = prisma
    ? await Promise.all([
        prisma.heroSetting.findUnique({ where: { id: "default" } }),
        prisma.product.findMany({
          where: { status: "published" },
          select: { id: true, nameJson: true },
          orderBy: { sortOrder: "asc" },
        }),
      ])
    : [null, []];

  const initial: HeroFormData = {
    headline_json: (hero?.headlineJson as LocalizedString) ?? emptyLocale(),
    subheadline_json:
      (hero?.subheadlineJson as LocalizedString) ?? emptyLocale(),
    stat_products: hero?.statProducts ?? 0,
    stat_downloads: hero?.statDownloads ?? 0,
    featured_product_ids: Array.isArray(hero?.featuredProductIds)
      ? (hero.featuredProductIds as string[])
      : [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hero Settings</h1>
        <p className="text-text-muted mt-1">
          Edit homepage hero headlines, stats, and featured orbit products.
        </p>
      </div>
      <HeroEditor initial={initial} products={products} />
    </div>
  );
}
