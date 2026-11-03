import { Router, type RequestHandler } from "express";
import { verifyDatabaseConnection } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "Service is running" });
});

const databaseHealthCheck: RequestHandler = async (_req, res) => {
  try {
    await verifyDatabaseConnection();
    res.json({
      success: true,
      data: { database: { status: "ok", connection: "connected", query: "ok" } },
      message: "Database is available",
    });
  } catch (error) {
    console.error("Database readiness check failed:", error instanceof Error ? error.message : "unknown error");
    res.status(503).json({
      success: false,
      data: { database: { status: "unavailable", connection: "disconnected", query: "failed" } },
      message: "Database is unavailable",
    });
  }
};

healthRouter.get("/db", databaseHealthCheck);
healthRouter.get("/ready", databaseHealthCheck);
