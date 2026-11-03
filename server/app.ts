import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { requestId } from "./middleware/requestId.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { marketplaceRouter } from "./routes/marketplace.js";
import { mediaRouter } from "./routes/media.js";
import { messagingRouter } from "./routes/messaging.js";
import { notificationsRouter } from "./routes/notifications.js";
import { profileRouter } from "./routes/profile.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestId);
  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/marketplace", marketplaceRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/messages", messagingRouter);
  app.use("/api/v1/notifications", notificationsRouter);
  app.use("/api/v1/media", mediaRouter);
  app.use("/api/v1", notFound);

  if (env.NODE_ENV === "production") {
    const webRoot = path.resolve(process.cwd(), "dist");
    app.use(express.static(webRoot, { index: false, maxAge: "1y", immutable: true }));
    app.get("/{*path}", (_request, response) => response.sendFile(path.join(webRoot, "index.html")));
  }

  app.use(errorHandler);

  return app;
}
