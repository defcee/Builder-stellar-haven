import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import pg from "pg";
import { closePool, getPool } from "./pool.js";

const migrationsDir = path.resolve(process.cwd(), "migrations");
const migrationLockId = "725114928341";

async function userHasColumn(client: pg.PoolClient, tableName: string, columnName: string): Promise<boolean> {
  const { rows } = await client.query(
    "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1",
    [tableName, columnName],
  );
  return rows.length > 0;
}

async function markExistingSchemaMigrations(
  client: pg.PoolClient,
  appliedNames: Set<string>,
  files: string[],
): Promise<void> {
  if (appliedNames.size > 0) return;

  const { rows: tableRows } = await client.query<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
  );
  const tableSet = new Set(tableRows.map((row: { table_name: string }) => row.table_name));

  const existingMigrations = new Map<string, boolean>([
    ["0001_initial_schema.sql", tableSet.has("users") && tableSet.has("sessions")],
    ["0002_social_campaigns.sql", tableSet.has("social_campaigns")],
    ["0003_user_profile_fields.sql", tableSet.has("users") && (await userHasColumn(client, "users", "phone"))],
    ["0004_marketplace_catalog.sql", tableSet.has("categories")],
    ["0005_locations_and_orders.sql", tableSet.has("user_locations") && tableSet.has("orders") && tableSet.has("order_items")],
  ]);

  for (const file of files) {
    const isSatisfied = existingMigrations.get(file);
    if (!isSatisfied || appliedNames.has(file)) continue;

    await client.query("INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [file]);
    appliedNames.add(file);
  }
}

export async function runMigrations(): Promise<string[]> {
  const client = await getPool().connect();
  const applied: string[] = [];
  let lockAcquired = false;

  try {
    await client.query("SELECT pg_advisory_lock($1::bigint)", [migrationLockId]);
    lockAcquired = true;

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await client.query<{ name: string }>("SELECT name FROM schema_migrations");
    const appliedNames = new Set(rows.map((row) => row.name));

    const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();
    await markExistingSchemaMigrations(client, appliedNames, files);

    for (const file of files) {
      if (appliedNames.has(file)) continue;

      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [file]);
        await client.query("COMMIT");
        applied.push(file);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }
  } finally {
    try {
      if (lockAcquired) {
        await client.query("SELECT pg_advisory_unlock($1::bigint)", [migrationLockId]);
      }
    } finally {
      client.release();
    }
  }

  return applied;
}

const isEntrypoint = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  runMigrations()
    .then((applied) => {
      console.log(applied.length ? `Applied migrations: ${applied.join(", ")}` : "Database is up to date");
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(() => closePool());
}
