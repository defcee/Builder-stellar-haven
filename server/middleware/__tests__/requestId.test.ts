import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

describe("request ID middleware", () => {
  it("attaches a unique request ID to each response", async () => {
    const app = createApp();
    const first = await request(app).get("/api/health");
    const second = await request(app).get("/api/health");

    expect(first.headers["x-request-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(second.headers["x-request-id"]).not.toBe(
      first.headers["x-request-id"],
    );
  });
});
