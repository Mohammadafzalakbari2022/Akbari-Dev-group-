/**
 * Supabase helpers for Akbari Dev Group hub.
 * Re-exports browser and server clients.
 */
export { createClient as createBrowserSupabaseClient } from "./supabase/client";
export {
  createClient as createServerSupabaseClient,
  createServiceClient as createServiceSupabaseClient,
} from "./supabase/server";

export { isSupabaseConfigured } from "./utils";
