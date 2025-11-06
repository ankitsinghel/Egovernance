import { createClient } from "@supabase/supabase-js";

export  const supabaseAdmin = createClient(
  process.env.DATABASE_URL_SECURE!,
  process.env.PUBLIC_KEY!
);
