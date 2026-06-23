import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export type AdminSession = {
  email: string;
  id: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return { email: user.email, id: user.id };
}

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return { email: "dev@local", id: "dev" };
    }
    redirect("/admin/login");
  }

  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export function getSupabaseConfigMessage(): string | null {
  if (isSupabaseConfigured()) return null;
  return "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.";
}
