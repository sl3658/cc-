import { createClient } from "@supabase/supabase-js";
import { ensureEnv } from "./env";

const config = ensureEnv();

export const supabaseAdmin = createClient(
  config.NEXT_PUBLIC_SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);
