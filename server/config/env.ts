import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8787),
  FRONTEND_URL: z.string().min(1).default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid server environment configuration:\n${issues.join("\n")}`);
}

export const env = {
  ...parsed.data,
  allowedOrigins: parsed.data.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean),
};
