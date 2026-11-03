import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";
import { logger } from "../lib/logger.js";

const SESSION_COOKIE = "bizzleap_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const signUpSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(10).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/),
  role: z.enum(["farmer", "business", "buyer"]),
  countryCode: z.string().trim().length(2).default("NG").transform((code) => code.toUpperCase()),
  phone: z.union([z.string().trim().min(7).max(20), z.literal("")]).optional(),
  shareContact: z.boolean().default(false),
});

const signInSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

function derivePassword(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await derivePassword(password, salt);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, expectedHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex || !/^[a-f0-9]{128}$/i.test(expectedHex)) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = await derivePassword(password, salt);
  return timingSafeEqual(actual, expected);
}

function sessionTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(SESSION_COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/i.test(token) ? token : null;
}

function setSessionCookie(response: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=${secure ? "None" : "Lax"}; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure ? "; Secure" : ""}`,
  );
}

function clearSessionCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production";
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=${secure ? "None" : "Lax"}; Max-Age=0${secure ? "; Secure" : ""}`,
  );
}

function createSessionToken() {
  return randomBytes(32).toString("hex");
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function saveSession(userId: string, token: string) {
  await getPool().query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, now() + interval '30 days')`,
    [userId, hashSessionToken(token)],
  );
}

export const requireUser: RequestHandler = async (request, response, next) => {
  const token = sessionTokenFromRequest(request);
  if (!token) throw new HttpError(401, "Sign in to continue");

  const { rows } = await getPool().query(
    `SELECT u.id, u.full_name, u.email, u.role, u.country_code
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()
        AND u.account_status = 'active'`,
    [hashSessionToken(token)],
  );
  const user = rows[0];
  if (!user) throw new HttpError(401, "Your session has expired. Please sign in again.");
  response.locals.user = user;
  next();
};

export const authRouter = Router();

authRouter.post("/sign-up", async (request, response) => {
  const parsed = signUpSchema.safeParse(request.body);
  if (!parsed.success) throw new HttpError(400, "Enter your name, a valid email, account type, and a strong password");

  const input = parsed.data;
  const passwordHash = await hashPassword(input.password);
  const client = await getPool().connect();
  const token = createSessionToken();

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role, country_code, phone)
       VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''))
       RETURNING id, full_name, email, role, country_code`,
      [input.fullName, input.email, passwordHash, input.role, input.countryCode, input.phone ?? ""],
    );
    const user = rows[0];

    if (input.role === "farmer") {
      await client.query(
        `INSERT INTO farmer_profiles (user_id, farm_name, country_code, public_contact_preferences)
         VALUES ($1, $2, $3, $4::jsonb)`,
        [
          user.id,
          `${input.fullName.slice(0, 115)} Farm`,
          input.countryCode,
          JSON.stringify({ email: input.shareContact, phone: input.shareContact && Boolean(input.phone) }),
        ],
      );
    } else if (input.role === "business") {
      const baseSlug = input.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";
      const slug = `${baseSlug.slice(0, 100)}-${randomBytes(4).toString("hex")}`;
      await client.query(
        `INSERT INTO business_profiles (user_id, business_name, slug, country_code, public_email, public_phone)
         VALUES ($1, $2, $3, $4, CASE WHEN $5 THEN $6 ELSE NULL END, CASE WHEN $5 THEN NULLIF($7, '') ELSE NULL END)`,
        [user.id, input.fullName, slug, input.countryCode, input.shareContact, input.email, input.phone ?? ""],
      );
    }

    await client.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + interval '30 days')`,
      [user.id, hashSessionToken(token)],
    );
    await client.query("COMMIT");
    setSessionCookie(response, token);
    response.status(201).json({ success: true, data: { user }, message: "Your account is ready" });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof Error && "code" in error && error.code === "23505") {
      throw new HttpError(409, "An account with this email already exists");
    }
    logger.error({ requestId: response.locals.requestId, err: error }, "Account registration failed");
    throw new HttpError(503, "We could not create your account right now. Please try again.");
  } finally {
    client.release();
  }
});

authRouter.post("/sign-in", async (request, response) => {
  const parsed = signInSchema.safeParse(request.body);
  if (!parsed.success) throw new HttpError(400, "Enter a valid email and password");

  const { rows } = await getPool().query(
    `SELECT id, full_name, email, password_hash, role, country_code, account_status
       FROM users WHERE email = $1 LIMIT 1`,
    [parsed.data.email],
  );
  const user = rows[0];
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    throw new HttpError(401, "Email or password is incorrect");
  }
  if (user.account_status !== "active") throw new HttpError(403, "This account is not available");

  const token = createSessionToken();
  await saveSession(user.id, token);
  await getPool().query("UPDATE users SET last_login_at = now() WHERE id = $1", [user.id]);
  setSessionCookie(response, token);
  response.json({
    success: true,
    data: {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        country_code: user.country_code,
      },
    },
    message: "Signed in successfully",
  });
});

authRouter.post("/sign-out", async (request, response) => {
  const token = sessionTokenFromRequest(request);
  if (token) {
    await getPool().query(
      "UPDATE sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL",
      [hashSessionToken(token)],
    );
  }
  clearSessionCookie(response);
  response.json({ success: true, data: null, message: "Signed out" });
});

authRouter.get("/me", requireUser, (_request, response) => {
  response.json({ success: true, data: { user: response.locals.user }, message: "Current account" });
});