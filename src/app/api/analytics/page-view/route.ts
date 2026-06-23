import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import type { PageViewType } from "@prisma/client";

const bodySchema = z.object({
  path: z.string().min(1),
  pageType: z.enum([
    "home",
    "about",
    "products_list",
    "product_detail",
    "contact",
    "other",
  ]),
  locale: z.string().optional(),
  referrer: z.string().nullable().optional(),
  productSlug: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bodySchema.parse(json);
    const prisma = getPrisma();

    if (!prisma) {
      return NextResponse.json({ ok: true, stub: true });
    }

    const headersList = await headers();
    const countryCode = headersList.get("x-vercel-ip-country") ?? null;

    let productId: string | null = null;
    if (data.productSlug) {
      const product = await prisma.product.findUnique({
        where: { slug: data.productSlug },
        select: { id: true },
      });
      productId = product?.id ?? null;
    }

    await prisma.pageViewEvent.create({
      data: {
        path: data.path,
        pageType: data.pageType as PageViewType,
        productId,
        locale: data.locale,
        referrer: data.referrer ?? null,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        countryCode,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
