import "dotenv/config";
import { z } from "zod";

const databaseUrlSchema = z.string().url().refine(
  (value) => {
    const protocol = new URL(value).protocol;
    return protocol === "postgres:" || protocol === "postgresql:";
  },
  { message: "must be a valid PostgreSQL connection URL" },
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8787),
  FRONTEND_URL: z.string().min(1).default("http://localhost:8080"),
  DATABASE_URL: z.preprocess((value) => (value === "" ? undefined : value), databaseUrlSchema.optional()),
  CLOUDINARY_CLOUD_NAME: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional()),
  CLOUDINARY_API_KEY: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional()),
  CLOUDINARY_API_SECRET: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(1).optional()),
}).superRefine((configuration, context) => {
  if (configuration.NODE_ENV === "production" && !configuration.DATABASE_URL) {
    context.addIssue({ code: "custom", path: ["DATABASE_URL"], message: "is required in production" });
  }
  if (configuration.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
    context.addIssue({ code: "custom", path: ["FRONTEND_URL"], message: "is required in production" });
  }
  const cloudinaryValues = [
    configuration.CLOUDINARY_CLOUD_NAME,
    configuration.CLOUDINARY_API_KEY,
    configuration.CLOUDINARY_API_SECRET,
  ];
  if (cloudinaryValues.some(Boolean) && !cloudinaryValues.every(Boolean)) {
    context.addIssue({ code: "custom", path: ["CLOUDINARY_CLOUD_NAME"], message: "all Cloudinary settings must be configured together" });
  }
  if (configuration.NODE_ENV === "production" && !cloudinaryValues.every(Boolean)) {
    context.addIssue({ code: "custom", path: ["CLOUDINARY_CLOUD_NAME"], message: "Cloudinary settings are required in production" });
  }
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
