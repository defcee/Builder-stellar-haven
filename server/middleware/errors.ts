import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ success: false, message: "Request body must be valid JSON" });
    return;
  }

  if (env.NODE_ENV === "production") {
    console.error("Unhandled error:", error instanceof Error ? error.message : "unknown");
  } else {
    console.error(error);
  }

  res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
}
