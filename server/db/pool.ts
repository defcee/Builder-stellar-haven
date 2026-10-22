import pg from "pg";
import { env } from "../config/env.js";

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  pool ??= new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return pool;
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}
