import { getPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ActivityAction =
  | "product.create"
  | "product.update"
  | "product.delete"
  | "product.publish"
  | "product.archive"
  | "review.approve"
  | "review.reject"
  | "review.delete"
  | "page.update"
  | "team.create"
  | "team.update"
  | "team.delete"
  | "hero.update"
  | "settings.update"
  | "login";

export async function logAdminActivity(opts: {
  adminEmail: string;
  action: ActivityAction | string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const prisma = getPrisma();
  if (!prisma) return;

  try {
    await prisma.adminActivityLog.create({
      data: {
        adminEmail: opts.adminEmail,
        action: opts.action,
        entityType: opts.entityType,
        entityId: opts.entityId ?? null,
        metadataJson: opts.metadata
          ? (opts.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    });
  } catch {
    // non-blocking
  }
}
