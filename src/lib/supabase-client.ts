import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are set
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use placeholder credentials to prevent startup crashes if not configured
const activeUrl = supabaseUrl || "https://placeholder-project.supabase.co";
const activeKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWxlYXNlIjoicGxhY2Vob2xkZXIifQ.placeholder";

export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
