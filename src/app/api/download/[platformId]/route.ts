import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPrisma } from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";

type RouteContext = {
  params: Promise<{ platformId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { platformId } = await context.params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? undefined;

  let downloadUrl: string | null = null;

  const prisma = getPrisma();

  if (prisma) {
    try {
      const platform = await prisma.productPlatform.findUnique({
        where: { id: platformId },
        include: { product: { select: { id: true, status: true } } },
      });

      if (
        platform?.isActive &&
        platform.downloadUrl &&
        platform.product.status === "published"
      ) {
        downloadUrl = platform.downloadUrl;

        const headersList = await headers();
        const countryCode = headersList.get("x-vercel-ip-country") ?? null;
        const referrer = request.headers.get("referer");

        await prisma.$transaction([
          prisma.downloadEvent.create({
            data: {
              productId: platform.productId,
              platformId: platform.id,
              locale,
              countryCode,
              referrer,
            },
          }),
          prisma.product.update({
            where: { id: platform.productId },
            data: { downloadCount: { increment: 1 } },
          }),
        ]);
      }
    } catch {
      /* fall through to mock */
    }
  }

  if (!downloadUrl) {
    for (const product of MOCK_PRODUCTS) {
      const platform = product.platforms.find((p) => p.id === platformId);
      if (platform?.downloadUrl) {
        downloadUrl = platform.downloadUrl;
        break;
      }
    }
  }

  if (!downloadUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(downloadUrl, 302);
}
