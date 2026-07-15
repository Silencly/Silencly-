import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://dytkjacgarqwaypeazhh.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

// Use provided credentials or fallback to env vars
const activeUrl = supabaseUrl;
const activeKey = supabaseAnonKey;

export const isSupabaseConfigured = !!activeUrl && !!activeKey;

export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
