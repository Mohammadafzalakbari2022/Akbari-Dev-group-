import { getPrisma } from "@/lib/prisma";
import { ReviewsTable } from "@/components/admin/ReviewsTable";
import type { ReviewStatus } from "@prisma/client";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const prisma = getPrisma();

  const where =
    status && status !== "all"
      ? { status: status as ReviewStatus }
      : undefined;

  const reviews = prisma
    ? await prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { nameJson: true, slug: true } },
        },
      })
    : [];

  const rows = reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    product: r.product,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-text-muted mt-1">Moderate public product reviews.</p>
      </div>
      <ReviewsTable reviews={rows} initialStatus={status ?? "all"} />
    </div>
  );
}
