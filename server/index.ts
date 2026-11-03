import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closePool } from "./db/pool.js";

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`BizzLeap API listening on port ${env.PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close((error) => {
      if (error) {
        console.error("HTTP server shutdown failed:", error.message);
        process.exitCode = 1;
      }

      void closePool().catch((poolError: unknown) => {
        console.error(
          "PostgreSQL pool shutdown failed:",
          poolError instanceof Error ? poolError.message : "unknown error",
        );
        process.exitCode = 1;
      });
    });
  });
}
