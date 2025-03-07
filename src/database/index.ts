import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

export const db = new Database(process.env.DATABASE_URL || "./database.db");
db.pragma("journal_mode = WAL");

export const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_KEY!);
