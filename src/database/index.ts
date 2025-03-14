import { QueryData, createClient } from "@supabase/supabase-js";

import { Database, Tables, TablesInsert } from "../../database.types";

let supabaseUrl = "";
if (typeof import.meta !== "undefined") {
  supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? "https://cevxzvsqlweccdszjadm.supabase.co";
}
let supabaseKey = "";
if (typeof import.meta !== "undefined") {
  supabaseKey =
    (import.meta.env.VITE_SUPABASE_KEY as string) ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnh6dnNxbHdlY2Nkc3pqYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzA1NjksImV4cCI6MjA1Njg0NjU2OX0.hdzjvJu1pekfhZbFI4rdvWqZi6llKsc9cNAkglkqToI";
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const vacuumsWithAffiliateLinksQuery = supabase.from("Vacuums").select(`
    *,
    affiliateLinks:AffiliateLinks (
    *
    )
  `);
export type Vacuum = Tables<"Vacuums">;
export type VacuumCreate = TablesInsert<"Vacuums">;
export type VacuumsWithAffiliateLinks = QueryData<typeof vacuumsWithAffiliateLinksQuery>;

export const vacuumWithAffiliateLinksQuery = supabase
  .from("Vacuums")
  .select(`*,affiliateLinks:AffiliateLinks (*)`)
  .single();
export type VacuumWithAffiliateLinks = QueryData<typeof vacuumWithAffiliateLinksQuery>;
export type AffiliateLinks = VacuumWithAffiliateLinks["affiliateLinks"];

export const affiliateLinkQuery = supabase.from("AffiliateLinks").select("*").single();
export type AffiliateLink = Tables<"AffiliateLinks">;
export type AffiliateLinkCreate = TablesInsert<"AffiliateLinks">;

export type MappingTechnology = Database["public"]["Enums"]["MappingTechnology"];
export type Currency = Database["public"]["Enums"]["Currency"];
export type Region = Database["public"]["Enums"]["Region"];
