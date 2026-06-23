"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnalyticsOverview } from "@/lib/admin/analytics";

export function AnalyticsDashboard({ data }: { data: AnalyticsOverview }) {
  if (!data.hasDatabase) {
    return (
      <div className="rounded-xl border border-border p-12 text-center text-text-muted">
        <p className="text-lg">No analytics data yet</p>
        <p className="text-sm mt-2">
          Connect DATABASE_URL and wait for page views and downloads to be
          logged from the public site.
        </p>
      </div>
    );
  }

  const kpis = [
    { label: "Page views (30d)", value: data.totalPageViews },
    { label: "Downloads (30d)", value: data.totalDownloads },
    { label: "Pending reviews", value: data.pendingReviews },
    { label: "Contact submissions", value: data.contactSubmissions },
    { label: "Avg rating", value: data.averageRating || "—" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">
                {k.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Downloads over time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {data.downloadsOverTime.length === 0 ? (
              <p className="text-sm text-text-muted">No download events yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.downloadsOverTime}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00e5be" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data.platformBreakdown.length === 0 ? (
              <p className="text-sm text-text-muted">No data</p>
            ) : (
              <ul className="space-y-2">
                {data.platformBreakdown.map((p) => (
                  <li
                    key={p.platform}
                    className="flex justify-between text-sm"
                  >
                    <span className="capitalize">{p.platform}</span>
                    <span className="font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top products by downloads</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProductsByDownloads.length === 0 ? (
              <p className="text-sm text-text-muted">No data</p>
            ) : (
              <ul className="space-y-2">
                {data.topProductsByDownloads.map((p) => (
                  <li
                    key={p.slug}
                    className="flex justify-between text-sm"
                  >
                    <span>{p.name}</span>
                    <span className="font-medium">{p.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{data.reviewStats.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span>{data.reviewStats.approved}</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected</span>
              <span>{data.reviewStats.rejected}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span>Average rating</span>
              <span>{data.reviewStats.averageRating || "—"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
