/**
 * Apply migration 008 to your remote Supabase database.
 *
 * Setup (one time):
 * 1. Supabase Dashboard → Project Settings → Database → Connection string → URI
 * 2. Add to .env.local:
 *    DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
 *
 * Run:
 *   npm run db:migrate-008
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = resolve(__dirname, "../.env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(`
Missing DATABASE_URL in .env.local

Get it from Supabase Dashboard:
  Project Settings → Database → Connection string → URI (Session pooler)

Add to .env.local:
  DATABASE_URL=postgresql://postgres.[ref]:[password]@...

Then run:
  npm run db:migrate-008

Or paste the contents of supabase/migrations/008_request_preferences.sql
into Supabase Dashboard → SQL Editor → Run.
`);
  process.exit(1);
}

const sql = readFileSync(
  resolve(__dirname, "../supabase/migrations/008_request_preferences.sql"),
  "utf8"
);

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("Applying migration 008_request_preferences.sql...");
  await client.query(sql);
  console.log("Migration applied successfully.");
} catch (err) {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
