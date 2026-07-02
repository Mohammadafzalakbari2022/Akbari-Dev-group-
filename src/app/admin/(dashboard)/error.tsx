"use client";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-deep p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-semibold text-red-400">
          Something went wrong
        </h1>
        <p className="text-text-muted">
          An unexpected error occurred while loading the admin dashboard.
          Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent-primary px-4 py-2 text-white hover:bg-accent-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
