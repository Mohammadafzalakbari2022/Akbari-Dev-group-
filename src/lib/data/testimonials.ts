import type { LocalizedString } from "@/lib/i18n-json";
import { getPrisma } from "@/lib/prisma";

export type TestimonialDto = {
  id: string;
  authorName: string;
  roleJson: unknown;
  quoteJson: unknown;
  avatarUrl: string | null;
  productId: string | null;
  productName: LocalizedString | null;
};

const MOCK_TESTIMONIALS: TestimonialDto[] = [
  {
    id: "mock-1",
    authorName: "احمد",
    roleJson: { fa: "خیاط", ps: "خیاط", en: "Tailor" },
    quoteJson: {
      fa: "خیاط کار من را خیلی آسان کرده — اندازه‌گیری و سفارش‌ها همه در یک جا.",
      ps: "خیاط زموږ کار ډیر اسانه کړی.",
      en: "Khayat made my work so much easier — measurements and orders all in one place.",
    },
    avatarUrl: null,
    productId: null,
    productName: { fa: "خیاط", ps: "خیاط", en: "Khayat" },
  },
  {
    id: "mock-2",
    authorName: "Rahim",
    roleJson: {
      fa: "مدیر پمپ بنزین",
      ps: "د پمپ مدیر",
      en: "Fuel station manager",
    },
    quoteJson: {
      fa: "StationPlus مدیریت موجودی و فروش را برای ما ساده کرد.",
      ps: "StationPlus زموږ لپاره مدیریت اسانه کړه.",
      en: "StationPlus simplified inventory and sales management for us.",
    },
    avatarUrl: null,
    productId: null,
    productName: { fa: "استیشن پلاس", ps: "سټیشن پلس", en: "StationPlus" },
  },
];

export async function getPublishedTestimonials(): Promise<TestimonialDto[]> {
  const prisma = getPrisma();
  if (!prisma) return MOCK_TESTIMONIALS;

  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: {
        product: { select: { nameJson: true } },
      },
    });

    if (rows.length === 0) return MOCK_TESTIMONIALS;

    return rows.map((t) => ({
      id: t.id,
      authorName: t.authorName,
      roleJson: t.roleJson,
      quoteJson: t.quoteJson,
      avatarUrl: t.avatarUrl,
      productId: t.productId,
      productName: t.product
        ? (t.product.nameJson as LocalizedString)
        : null,
    }));
  } catch {
    return MOCK_TESTIMONIALS;
  }
}

export async function getAllTestimonials() {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    return prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
      include: { product: { select: { nameJson: true, slug: true } } },
    });
  } catch {
    return [];
  }
}
