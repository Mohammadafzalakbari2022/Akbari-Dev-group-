import type { PlatformType, ProductStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { pickLocale } from "@/lib/i18n-json";
import type { ProductDto, ProductListItem } from "./types";
import {
  MOCK_PRODUCT_LIST,
  MOCK_PRODUCTS,
  getMockProductBySlug,
  toListItem,
} from "./mock-products";

function computeRating(reviews: { rating: number; status: string }[]) {
  const approved = reviews.filter((r) => r.status === "approved");
  if (approved.length === 0) return { averageRating: 0, reviewCount: 0 };
  const sum = approved.reduce((s, r) => s + r.rating, 0);
  return {
    averageRating: Math.round((sum / approved.length) * 10) / 10,
    reviewCount: approved.length,
  };
}

function mapProduct(raw: {
  id: string;
  slug: string;
  status: ProductStatus;
  featured: boolean;
  isNew: boolean;
  isNewUntil: Date | null;
  iconUrl: string | null;
  coverUrl: string | null;
  nameJson: unknown;
  taglineJson: unknown;
  purposeJson: unknown;
  featuresJson: unknown;
  requirementsJson: unknown;
  contactJson: unknown;
  socialJson: unknown;
  pricingJson: unknown;
  seoJson: unknown;
  downloadCount: number;
  sortOrder: number;
  updatedAt: Date;
  platforms: {
    id: string;
    platform: PlatformType;
    version: string | null;
    fileSize: string | null;
    minOs: string | null;
    downloadUrl: string | null;
    isActive: boolean;
    sortOrder: number;
  }[];
  screenshots: {
    id: string;
    url: string;
    captionJson: unknown;
    sortOrder: number;
  }[];
  guides: {
    id: string;
    type: ProductDto["guides"][0]["type"];
    titleJson: unknown;
    contentJson: unknown;
    fileUrl: string | null;
    externalUrl: string | null;
    sortOrder: number;
    isPublished: boolean;
  }[];
  changelog: {
    id: string;
    version: string;
    date: Date;
    notesJson: unknown;
    platform: PlatformType | null;
  }[];
  reviews: {
    id: string;
    authorName: string | null;
    rating: number;
    comment: string | null;
    status: ProductDto["reviews"][0]["status"];
    createdAt: Date;
  }[];
}): ProductDto {
  const { averageRating, reviewCount } = computeRating(raw.reviews);
  return {
    ...raw,
    averageRating,
    reviewCount,
    platforms: raw.platforms.filter((p) => p.isActive),
    guides: raw.guides.filter((g) => g.isPublished),
    reviews: raw.reviews.filter((r) => r.status === "approved"),
  };
}

const productInclude = {
  platforms: { orderBy: { sortOrder: "asc" as const } },
  screenshots: { orderBy: { sortOrder: "asc" as const } },
  guides: { orderBy: { sortOrder: "asc" as const } },
  changelog: { orderBy: { date: "desc" as const } },
  reviews: { orderBy: { createdAt: "desc" as const } },
};

export async function getPublishedProducts(): Promise<ProductListItem[]> {
  const prisma = getPrisma();
  if (!prisma) return MOCK_PRODUCT_LIST;

  try {
    const products = await prisma.product.findMany({
      where: { status: "published" },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        platforms: { where: { isActive: true }, select: { platform: true } },
        reviews: { where: { status: "approved" }, select: { rating: true } },
      },
    });

    if (products.length === 0) return MOCK_PRODUCT_LIST;

    return products.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10,
            ) / 10
          : 0;
      return {
        id: p.id,
        slug: p.slug,
        status: p.status,
        featured: p.featured,
        isNew: p.isNew,
        isNewUntil: p.isNewUntil,
        iconUrl: p.iconUrl,
        nameJson: p.nameJson,
        taglineJson: p.taglineJson,
        downloadCount: p.downloadCount,
        sortOrder: p.sortOrder,
        updatedAt: p.updatedAt,
        platforms: p.platforms,
        averageRating,
        reviewCount: ratings.length,
      };
    });
  } catch (err) {
    console.error("getPublishedProducts failed:", err);
    return MOCK_PRODUCT_LIST;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
  const prisma = getPrisma();
  if (!prisma) return getMockProductBySlug(slug);

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    if (!product || product.status !== "published") {
      return getMockProductBySlug(slug);
    }

    return mapProduct(product);
  } catch (err) {
    console.error("getProductBySlug failed:", err);
    return getMockProductBySlug(slug);
  }
}

export async function getFeaturedProducts(
  ids?: string[],
): Promise<ProductListItem[]> {
  const prisma = getPrisma();
  if (!prisma) {
    if (ids?.length) {
      return MOCK_PRODUCT_LIST.filter((p) => ids.includes(p.id));
    }
    return MOCK_PRODUCT_LIST.filter((p) => p.featured);
  }

  try {
    const where = ids?.length
      ? { id: { in: ids }, status: "published" as const }
      : { featured: true, status: "published" as const };

    const products = await prisma.product.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        platforms: { where: { isActive: true }, select: { platform: true } },
        reviews: { where: { status: "approved" }, select: { rating: true } },
      },
    });

    if (products.length === 0) {
      return MOCK_PRODUCT_LIST.filter((p) => p.featured);
    }

    return products.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10,
            ) / 10
          : 0;
      return {
        id: p.id,
        slug: p.slug,
        status: p.status,
        featured: p.featured,
        isNew: p.isNew,
        isNewUntil: p.isNewUntil,
        iconUrl: p.iconUrl,
        nameJson: p.nameJson,
        taglineJson: p.taglineJson,
        downloadCount: p.downloadCount,
        sortOrder: p.sortOrder,
        updatedAt: p.updatedAt,
        platforms: p.platforms,
        averageRating,
        reviewCount: ratings.length,
      };
    });
  } catch (err) {
    console.error("getFeaturedProducts failed:", err);
    return MOCK_PRODUCT_LIST.filter((p) => p.featured);
  }
}

export function filterProducts(
  products: ProductListItem[],
  locale: string,
  opts: {
    search?: string;
    platform?: PlatformType | "all";
    status?: ProductStatus | "all";
  },
): ProductListItem[] {
  let result = [...products];

  if (opts.status && opts.status !== "all") {
    result = result.filter((p) => p.status === opts.status);
  }

  if (opts.platform && opts.platform !== "all") {
    result = result.filter((p) =>
      p.platforms.some((pl) => pl.platform === opts.platform),
    );
  }

  if (opts.search?.trim()) {
    const q = opts.search.trim().toLowerCase();
    result = result.filter((p) => {
      const name = pickLocale(p.nameJson, locale).toLowerCase();
      const tagline = pickLocale(p.taglineJson, locale).toLowerCase();
      return name.includes(q) || tagline.includes(q) || p.slug.includes(q);
    });
  }

  return result;
}

export async function getProductSlugs(): Promise<string[]> {
  const prisma = getPrisma();
  if (!prisma) return MOCK_PRODUCTS.map((p) => p.slug);

  try {
    const products = await prisma.product.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return products.length > 0
      ? products.map((p) => p.slug)
      : MOCK_PRODUCTS.map((p) => p.slug);
  } catch (err) {
    console.error("getProductSlugs failed:", err);
    return MOCK_PRODUCTS.map((p) => p.slug);
  }
}

export { toListItem };
