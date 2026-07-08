import { createClient } from "@supabase/supabase-js";
try {
  const supabase = createClient("https://dytkjacgarqwaypeazhh.supabase.co", "");
  supabase.from("history").select("*").then(console.log).catch(console.error);
} catch(e) {
  console.log("Error in createClient:", e.message);
}
