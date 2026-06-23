import { getPrisma } from "@/lib/prisma";
import type { ContactStatus, ContactType } from "@prisma/client";

export type ContactSubmissionDto = {
  id: string;
  type: ContactType;
  productId: string | null;
  productName: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  createdAt: Date;
};

export async function getContactSubmissions(
  filter?: { status?: ContactStatus; type?: ContactType },
): Promise<ContactSubmissionDto[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    const rows = await prisma.contactSubmission.findMany({
      where: {
        ...(filter?.status ? { status: filter.status } : {}),
        ...(filter?.type ? { type: filter.type } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { nameJson: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      productId: r.productId,
      productName: r.product
        ? String((r.product.nameJson as { en?: string })?.en ?? "")
        : null,
      name: r.name,
      email: r.email,
      phone: r.phone,
      subject: r.subject,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function countNewContactSubmissions(): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) return 0;

  try {
    return prisma.contactSubmission.count({ where: { status: "new" } });
  } catch {
    return 0;
  }
}
