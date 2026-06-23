import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.object({
  productId: z.string().min(1),
  authorName: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bodySchema.parse(json);
    const prisma = getPrisma();

    if (!prisma) {
      return NextResponse.json({
        ok: true,
        stub: true,
        message: "Review queued (no database)",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true, status: true },
    });

    if (!product || product.status !== "published") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        authorName: data.authorName ?? null,
        rating: data.rating,
        comment: data.comment ?? null,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true, id: review.id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
