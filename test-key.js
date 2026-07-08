import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://dytkjacgarqwaypeazhh.supabase.co", "your-key-here");
supabase.from("history").select("*").then(console.log).catch(console.error);
