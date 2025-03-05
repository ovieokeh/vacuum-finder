import Database from "better-sqlite3";

export const db = new Database(process.env.DATABASE_URL || "./database.db");
db.pragma("journal_mode = WAL");
