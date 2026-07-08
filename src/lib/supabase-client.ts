import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Use provided credentials or fallback to env vars
const activeUrl = (supabaseUrl && supabaseUrl.trim() !== "") ? supabaseUrl.trim() : "https://dytkjacgarqwaypeazhh.supabase.co";
const activeKey = (supabaseAnonKey && supabaseAnonKey.trim() !== "") ? supabaseAnonKey.trim() : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dGtqYWNnYXJxd2F5cGVhemhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MTkzMzIsImV4cCI6MjA5ODE5NTMzMn0.XRpODxLqR0PEj6zVwBXZu2G2t0AvyXG6Z5vURRHzL2c";

export const isSupabaseConfigured = true;


export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
