import { getPrisma } from "@/lib/prisma";
import type { HeroSettingsDto } from "./types";
import { MOCK_HERO_SETTINGS } from "./mock-products";
import { getFeaturedProducts } from "./products";

export async function getHeroSettings(): Promise<HeroSettingsDto> {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      headlineJson: MOCK_HERO_SETTINGS.headlineJson,
      subheadlineJson: MOCK_HERO_SETTINGS.subheadlineJson,
      statProducts: MOCK_HERO_SETTINGS.statProducts,
      statDownloads: MOCK_HERO_SETTINGS.statDownloads,
      featuredProducts: MOCK_HERO_SETTINGS.featuredProducts,
    };
  }

  try {
    const [hero, productCount, downloadAgg] = await Promise.all([
      prisma.heroSetting.findUnique({ where: { id: "default" } }),
      prisma.product.count({ where: { status: "published" } }),
      prisma.product.aggregate({
        where: { status: "published" },
        _sum: { downloadCount: true },
      }),
    ]);

    const featuredIds = Array.isArray(hero?.featuredProductIds)
      ? (hero.featuredProductIds as string[])
      : undefined;

    const featuredProducts = await getFeaturedProducts(featuredIds);

    const statProducts =
      hero?.statProducts ?? (productCount > 0 ? productCount : MOCK_HERO_SETTINGS.statProducts);
    const statDownloads =
      hero?.statDownloads ??
      downloadAgg._sum.downloadCount ??
      MOCK_HERO_SETTINGS.statDownloads;

    return {
      headlineJson: hero?.headlineJson ?? null,
      subheadlineJson: hero?.subheadlineJson ?? null,
      statProducts,
      statDownloads,
      featuredProducts:
        featuredProducts.length > 0
          ? featuredProducts
          : MOCK_HERO_SETTINGS.featuredProducts,
    };
  } catch {
    return {
      headlineJson: MOCK_HERO_SETTINGS.headlineJson,
      subheadlineJson: MOCK_HERO_SETTINGS.subheadlineJson,
      statProducts: MOCK_HERO_SETTINGS.statProducts,
      statDownloads: MOCK_HERO_SETTINGS.statDownloads,
      featuredProducts: MOCK_HERO_SETTINGS.featuredProducts,
    };
  }
}
