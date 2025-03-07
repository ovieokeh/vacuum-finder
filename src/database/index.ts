import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

export const db = new Database(process.env.DATABASE_URL || "./database.db");
db.pragma("journal_mode = WAL");

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL ?? "https://cevxzvsqlweccdszjadm.supabase.co"!,
  process.env.VITE_SUPABASE_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnh6dnNxbHdlY2Nkc3pqYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzA1NjksImV4cCI6MjA1Njg0NjU2OX0.hdzjvJu1pekfhZbFI4rdvWqZi6llKsc9cNAkglkqToI"!
);
