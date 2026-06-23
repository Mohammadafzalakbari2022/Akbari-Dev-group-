import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSupabaseConfigMessage } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const configMessage = getSupabaseConfigMessage();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-deep p-4">
      <Suspense>
        <LoginForm configMessage={configMessage} />
      </Suspense>
    </div>
  );
}
