import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import type { GuideViewEventType } from "@prisma/client";

const bodySchema = z.object({
  productId: z.string().min(1),
  guideId: z.string().min(1),
  eventType: z.enum([
    "video_play",
    "pdf_open",
    "pdf_download",
    "external_click",
    "gallery_view",
  ]),
  locale: z.string().optional(),
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

    await prisma.guideViewEvent.create({
      data: {
        productId: data.productId,
        guideId: data.guideId,
        eventType: data.eventType as GuideViewEventType,
        locale: data.locale,
        countryCode,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
