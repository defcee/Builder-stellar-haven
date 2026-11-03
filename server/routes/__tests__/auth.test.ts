import { createHash } from "node:crypto";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  query: vi.fn(),
  connect: vi.fn(),
}));

vi.mock("../../db/pool.js", () => ({
  getPool: () => ({ query: database.query, connect: database.connect }),
}));

import { createApp } from "../../app.js";

const app = createApp();
const users = new Map<string, Record<string, unknown>>();
const sessions = new Map<string, string>();
const userId = "10000000-0000-4000-8000-000000000001";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

beforeEach(() => {
  users.clear();
  sessions.clear();
  database.query.mockReset();
  database.connect.mockReset();

  const client = {
    query: vi.fn(async (sql: string, values: unknown[] = []) => {
      if (sql.includes("INSERT INTO users")) {
        const [fullName, email, passwordHash, role, countryCode] =
          values as string[];
        const user = {
          id: userId,
          full_name: fullName,
          email,
          password_hash: passwordHash,
          role,
          country_code: countryCode,
          account_status: "active",
        };
        users.set(email, user);
        return { rows: [user] };
      }

      if (sql.includes("INSERT INTO sessions")) {
        const [ownerId, tokenHash] = values as string[];
        sessions.set(tokenHash, ownerId);
      }

      return { rows: [] };
    }),
    release: vi.fn(),
  };
  database.connect.mockResolvedValue(client);

  database.query.mockImplementation(
    async (sql: string, values: unknown[] = []) => {
      if (sql.includes("INSERT INTO sessions")) {
        sessions.set(values[1] as string, values[0] as string);
        return { rows: [] };
      }

      if (sql.includes("FROM sessions s")) {
        const ownerId = sessions.get(values[0] as string);
        const user = [...users.values()].find(
          (candidate) => candidate.id === ownerId,
        );
        return { rows: user ? [user] : [] };
      }

      if (sql.includes("FROM users WHERE email")) {
        const user = users.get(values[0] as string);
        return { rows: user ? [user] : [] };
      }

      return { rows: [] };
    },
  );
});

describe("authentication routes", () => {
  it("registers an account, signs in, and returns the authenticated user", async () => {
    const registration = await request(app).post("/api/v1/auth/sign-up").send({
      fullName: "Amina Farmer",
      email: "AMINA@example.com",
      password: "StrongPassword42",
      role: "farmer",
      countryCode: "NG",
    });

    expect(registration.status).toBe(201);
    expect(registration.body.data.user.email).toBe("amina@example.com");
    expect(registration.headers["set-cookie"]).toBeDefined();
    expect(database.connect).toHaveBeenCalledOnce();

    const signIn = await request(app).post("/api/v1/auth/sign-in").send({
      email: "amina@example.com",
      password: "StrongPassword42",
    });

    expect(signIn.status).toBe(200);
    expect(signIn.body.data.user.id).toBe(userId);
    const token = signIn.headers["set-cookie"][0].match(
      /bizzleap_session=([a-f0-9]+)/,
    )?.[1];
    expect(token).toBeDefined();

    const currentUser = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `bizzleap_session=${token}`);

    expect(currentUser.status).toBe(200);
    expect(currentUser.body.data.user.email).toBe("amina@example.com");
    expect(sessions.has(hashToken(token!))).toBe(true);
  });

  it("rejects invalid credentials and missing or expired sessions", async () => {
    const registration = await request(app).post("/api/v1/auth/sign-up").send({
      fullName: "Amina Farmer",
      email: "amina@example.com",
      password: "StrongPassword42",
      role: "farmer",
    });
    expect(registration.status).toBe(201);

    const invalidSignIn = await request(app).post("/api/v1/auth/sign-in").send({
      email: "amina@example.com",
      password: "WrongPassword42",
    });
    expect(invalidSignIn.status).toBe(401);

    const missingSession = await request(app).get("/api/v1/auth/me");
    expect(missingSession.status).toBe(401);
    expect(missingSession.body.message).toBe("Sign in to continue");

    const expiredSession = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `bizzleap_session=${"a".repeat(64)}`);
    expect(expiredSession.status).toBe(401);
    expect(expiredSession.body.message).toContain("session has expired");
  });

  it("rejects registration with an invalid password", async () => {
    const response = await request(app).post("/api/v1/auth/sign-up").send({
      fullName: "Amina Farmer",
      email: "amina@example.com",
      password: "weak",
      role: "farmer",
    });

    expect(response.status).toBe(400);
    expect(database.connect).not.toHaveBeenCalled();
  });
});
