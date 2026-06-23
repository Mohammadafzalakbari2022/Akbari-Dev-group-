import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardStats } from "@/lib/admin/analytics";
import { countNewContactSubmissions } from "@/lib/data/contact";
import { Package, Star, Download, Eye, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [stats, newContacts] = await Promise.all([
    getDashboardStats(),
    countNewContactSubmissions(),
  ]);

  const kpis = [
    {
      label: "Total products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Pending reviews",
      value: stats.pendingReviews,
      icon: Star,
      href: "/admin/reviews?status=pending",
    },
    {
      label: "Downloads this week",
      value: stats.downloadsThisWeek,
      icon: Download,
      href: "/admin/analytics",
    },
    {
      label: "Page views this week",
      value: stats.pageViewsThisWeek,
      icon: Eye,
      href: "/admin/analytics",
    },
    {
      label: "New contact messages",
      value: newContacts,
      icon: Inbox,
      href: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-text-muted mt-1">
          Overview of your Akbari Dev Group hub.
        </p>
      </div>

      {!stats.hasDatabase && (
        <div className="rounded-lg border border-accent-warm/30 bg-accent-warm/10 p-4 text-sm">
          Database not connected. Set DATABASE_URL to enable full CMS features.
          KPIs show zero until events are logged.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href}>
              <Card className="hover:border-accent-primary/40 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">
                    {kpi.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-accent-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {stats.pendingReviews > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending reviews</CardTitle>
            <CardDescription>
              {stats.pendingReviews} review(s) awaiting moderation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/reviews?status=pending">
                Review queue
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
