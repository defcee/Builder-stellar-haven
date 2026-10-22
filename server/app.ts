import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { healthRouter } from "./routes/health.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1", notFound);
  app.use(errorHandler);

  return app;
}
