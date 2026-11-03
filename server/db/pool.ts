import pg from "pg";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

let pool: pg.Pool | undefined;

function getConnectionConfig(connectionString: string) {
  const databaseUrl = new URL(connectionString);
  const host = databaseUrl.hostname.replace(/^\[|\]$/g, "");
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const sslMode = databaseUrl.searchParams.get("sslmode")?.toLowerCase();
  const useSsl = !isLocal || ["prefer", "require", "verify-ca", "verify-full"].includes(sslMode ?? "");

  return {
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: true } : false,
  };
}

export function getPool(): pg.Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new pg.Pool({
      ...getConnectionConfig(env.DATABASE_URL),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on("error", (error) => {
      logger.error({ err: error }, "Unexpected PostgreSQL pool error");
    });
  }

  return pool;
}

export async function verifyDatabaseConnection(): Promise<void> {
  const { rows } = await getPool().query<{ connected: number }>("SELECT 1 AS connected");
  if (rows[0]?.connected !== 1) {
    throw new Error("PostgreSQL connection check returned an unexpected result");
  }
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}
