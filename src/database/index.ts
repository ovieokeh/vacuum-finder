import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

export const db = new Database(process.env.DATABASE_URL || "./database.db");
db.pragma("journal_mode = WAL");

const [SUPABASE_PROJECT_URL = "", SUPABASE_PUBLIC_ANON_KEY = ""] = [
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_PUBLIC_ANON_KEY,
];

console.log("Hello, Vite!", process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PUBLIC_ANON_KEY);
export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY);
