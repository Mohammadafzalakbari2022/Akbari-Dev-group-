import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.object({
  type: z.enum(["general", "support", "pricing", "problem_report"]),
  productId: z.string().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  message: z.string().min(1),
  locale: z.string().optional(),
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
        message: "Contact saved (no database)",
      });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        type: data.type,
        productId: data.productId,
        name: data.name ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        subject: data.subject ?? null,
        message: data.message,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
