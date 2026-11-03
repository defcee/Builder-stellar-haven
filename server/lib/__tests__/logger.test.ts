import { describe, expect, it } from "vitest";
import { createLogger } from "../logger.js";

describe("structured logger", () => {
  it("writes JSON with request and error context", () => {
    const lines: string[] = [];
    const logger = createLogger({ write: (line) => lines.push(line) });

    logger.error(
      { requestId: "request-123", err: new Error("sample failure") },
      "request failed",
    );

    expect(JSON.parse(lines[0])).toMatchObject({
      level: 50,
      requestId: "request-123",
      msg: "request failed",
      err: { message: "sample failure" },
    });
  });
});
