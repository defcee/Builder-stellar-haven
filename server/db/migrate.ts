import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { closePool, getPool } from "./pool.js";

const migrationsDir = path.resolve(process.cwd(), "migrations");

export async function runMigrations(): Promise<string[]> {
  const client = await getPool().connect();
  const applied: string[] = [];

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await client.query<{ name: string }>("SELECT name FROM schema_migrations");
    const appliedNames = new Set(rows.map((row) => row.name));

    const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

    for (const file of files) {
      if (appliedNames.has(file)) continue;

      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        applied.push(file);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }
  } finally {
    client.release();
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
