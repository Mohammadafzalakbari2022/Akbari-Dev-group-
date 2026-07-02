export default function AdminDashboardLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-deep">
      <div className="flex items-center gap-3 text-text-muted">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
        <span>Loading dashboard…</span>
      </div>
    </div>
  );
}
