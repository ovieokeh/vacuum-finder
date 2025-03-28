import { createClient } from "@supabase/supabase-js";

import { Database } from "../../database.types";

const supabaseUrl = "https://cevxzvsqlweccdszjadm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnh6dnNxbHdlY2Nkc3pqYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzA1NjksImV4cCI6MjA1Njg0NjU2OX0.hdzjvJu1pekfhZbFI4rdvWqZi6llKsc9cNAkglkqToI";
export const supabase = createClient<Database>(supabaseUrl.replace(/"/, ""), supabaseKey.replace(/"/, ""));

export const vacuumsWithAffiliateLinksQuery = supabase.from("Vacuums").select(`
    *,
    affiliateLinks:AffiliateLinks (
    *
    )
  `);
