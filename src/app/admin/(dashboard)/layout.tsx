import { requireAdmin } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-dvh bg-bg-deep">
      <AdminSidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-surface/80 backdrop-blur px-4 lg:px-8">
          <div className="w-10 lg:hidden" />
          <p className="text-sm text-text-muted hidden sm:block">
            Signed in as{" "}
            <span className="text-text-primary">{session.email}</span>
          </p>
          <LogoutButton />
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
