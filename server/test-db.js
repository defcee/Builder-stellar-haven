import { closePool, verifyDatabaseConnection } from "./db/pool.js";

try {
  await verifyDatabaseConnection();
  console.log("PostgreSQL connection and query verified.");
} catch (error) {
  console.error("PostgreSQL connection check failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
} finally {
  await closePool();
}
