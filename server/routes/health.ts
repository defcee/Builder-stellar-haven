import { Router } from "express";
import { pool } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "Service is running" });
});

healthRouter.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true, data: { database: "ok" }, message: "Service is ready" });
  } catch {
    res.status(503).json({ success: false, message: "Service is not ready" });
  }
});
