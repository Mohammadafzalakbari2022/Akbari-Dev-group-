import { getPrisma } from "@/lib/prisma";
import { pickLocale } from "@/lib/i18n-json";

function startOfWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export type DashboardStats = {
  totalProducts: number;
  pendingReviews: number;
  downloadsThisWeek: number;
  pageViewsThisWeek: number;
  hasDatabase: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      totalProducts: 0,
      pendingReviews: 0,
      downloadsThisWeek: 0,
      pageViewsThisWeek: 0,
      hasDatabase: false,
    };
  }

  const weekStart = startOfWeek();

  try {
    const [totalProducts, pendingReviews, downloadsThisWeek, pageViewsThisWeek] =
      await Promise.all([
        prisma.product.count(),
        prisma.review.count({ where: { status: "pending" } }),
        prisma.downloadEvent.count({ where: { createdAt: { gte: weekStart } } }),
        prisma.pageViewEvent.count({ where: { createdAt: { gte: weekStart } } }),
      ]);

    return {
      totalProducts,
      pendingReviews,
      downloadsThisWeek,
      pageViewsThisWeek,
      hasDatabase: true,
    };
  } catch {
    return {
      totalProducts: 0,
      pendingReviews: 0,
      downloadsThisWeek: 0,
      pageViewsThisWeek: 0,
      hasDatabase: false,
    };
  }
}

export type AnalyticsOverview = {
  hasDatabase: boolean;
  totalPageViews: number;
  totalDownloads: number;
  pendingReviews: number;
  contactSubmissions: number;
  averageRating: number;
  topProductsByDownloads: { name: string; slug: string; count: number }[];
  topProductsByViews: { name: string; slug: string; count: number }[];
  downloadsOverTime: { date: string; count: number }[];
  platformBreakdown: { platform: string; count: number }[];
  reviewStats: {
    pending: number;
    approved: number;
    rejected: number;
    averageRating: number;
  };
};

export async function getAnalyticsOverview(
  days = 30,
): Promise<AnalyticsOverview> {
  const empty: AnalyticsOverview = {
    hasDatabase: false,
    totalPageViews: 0,
    totalDownloads: 0,
    pendingReviews: 0,
    contactSubmissions: 0,
    averageRating: 0,
    topProductsByDownloads: [],
    topProductsByViews: [],
    downloadsOverTime: [],
    platformBreakdown: [],
    reviewStats: { pending: 0, approved: 0, rejected: 0, averageRating: 0 },
  };

  const prisma = getPrisma();
  if (!prisma) return empty;

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const [
      totalPageViews,
      totalDownloads,
      pendingReviews,
      contactSubmissions,
      approvedReviews,
      reviewCounts,
      downloadGroups,
      viewGroups,
      platformGroups,
      dailyDownloads,
    ] = await Promise.all([
      prisma.pageViewEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.downloadEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.review.count({ where: { status: "pending" } }),
      prisma.contactSubmission.count({ where: { createdAt: { gte: since } } }),
      prisma.review.findMany({
        where: { status: "approved" },
        select: { rating: true },
      }),
      prisma.review.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.downloadEvent.groupBy({
        by: ["productId"],
        where: { createdAt: { gte: since } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.pageViewEvent.groupBy({
        by: ["productId"],
        where: { createdAt: { gte: since }, productId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.downloadEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { platform: { select: { platform: true } } },
      }),
      prisma.downloadEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const productIds = [
      ...new Set([
        ...downloadGroups.map((g) => g.productId),
        ...viewGroups.map((g) => g.productId!).filter(Boolean),
      ]),
    ];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, slug: true, nameJson: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const topProductsByDownloads = downloadGroups.map((g) => {
      const p = productMap.get(g.productId);
      return {
        name: p ? pickLocale(p.nameJson, "en") : g.productId,
        slug: p?.slug ?? "",
        count: g._count.id,
      };
    });

    const topProductsByViews = viewGroups
      .filter((g) => g.productId)
      .map((g) => {
        const p = productMap.get(g.productId!);
        return {
          name: p ? pickLocale(p.nameJson, "en") : g.productId!,
          slug: p?.slug ?? "",
          count: g._count.id,
        };
      });

    const platformCounts: Record<string, number> = {};
    for (const d of platformGroups) {
      const key = d.platform?.platform ?? "unknown";
      platformCounts[key] = (platformCounts[key] ?? 0) + 1;
    }

    const dayMap: Record<string, number> = {};
    for (const d of dailyDownloads) {
      const key = d.createdAt.toISOString().slice(0, 10);
      dayMap[key] = (dayMap[key] ?? 0) + 1;
    }
    const downloadsOverTime = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    const avg =
      approvedReviews.length > 0
        ? approvedReviews.reduce((s, r) => s + r.rating, 0) /
          approvedReviews.length
        : 0;

    const statusMap = Object.fromEntries(
      reviewCounts.map((r) => [r.status, r._count.id]),
    );

    return {
      hasDatabase: true,
      totalPageViews,
      totalDownloads,
      pendingReviews,
      contactSubmissions,
      averageRating: Math.round(avg * 10) / 10,
      topProductsByDownloads,
      topProductsByViews,
      downloadsOverTime,
      platformBreakdown: Object.entries(platformCounts).map(
        ([platform, count]) => ({ platform, count }),
      ),
      reviewStats: {
        pending: statusMap.pending ?? 0,
        approved: statusMap.approved ?? 0,
        rejected: statusMap.rejected ?? 0,
        averageRating: Math.round(avg * 10) / 10,
      },
    };
  } catch {
    return empty;
  }
}
