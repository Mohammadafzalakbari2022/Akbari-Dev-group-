import { getAnalyticsOverview } from "@/lib/admin/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsOverview(30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-text-muted mt-1">
          Owner-only insights from downloads, page views, reviews, and contact
          submissions.
        </p>
      </div>
      <AnalyticsDashboard data={data} />
    </div>
  );
}
