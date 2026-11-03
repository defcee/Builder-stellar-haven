import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";
import { requireUser } from "./auth.js";

export const profileRouter = Router();

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.union([z.string().trim().min(7).max(20), z.literal("")]).optional(),
  farmName: z.string().trim().min(2).max(120).optional(),
  businessName: z.string().trim().min(2).max(120).optional(),
  businessType: z.string().trim().max(100).optional(),
  description: z.string().trim().max(4000).optional(),
  city: z.string().trim().max(100).optional(),
  region: z.string().trim().max(100).optional(),
  publicEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  publicPhone: z.union([z.string().trim().min(7).max(20), z.literal("")]).optional(),
  websiteUrl: z.union([
    z.string().trim().url().max(500).refine((value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }),
    z.literal(""),
  ]).optional(),
  publicationStatus: z.enum(["draft", "published"]).optional(),
  shareEmail: z.boolean().optional(),
  sharePhone: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0);

async function loadProfile(userId: string) {
  const { rows } = await getPool().query(
    `SELECT u.id, u.full_name, u.email, u.role, u.country_code, u.phone, u.avatar_url,
            fp.farm_name, fp.description AS farm_description, fp.city AS farm_city,
            fp.region AS farm_region, fp.public_contact_preferences,
            bp.id AS business_profile_id, bp.business_name, bp.slug AS business_slug,
            bp.business_type, bp.description AS business_description, bp.logo_url,
            bp.cover_image_url, bp.city AS business_city, bp.region AS business_region,
            bp.public_email, bp.public_phone, bp.website_url, bp.publication_status,
            bp.verification_status
       FROM users u
       LEFT JOIN farmer_profiles fp ON fp.user_id = u.id
       LEFT JOIN business_profiles bp ON bp.user_id = u.id
      WHERE u.id = $1`,
    [userId],
  );
  const row = rows[0];
  if (!row) throw new HttpError(404, "Account not found");
  return {
    user: {
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      role: row.role,
      country_code: row.country_code,
      phone: row.phone,
      avatar_url: row.avatar_url,
    },
    farmerProfile: row.farm_name ? {
      farm_name: row.farm_name,
      description: row.farm_description,
      city: row.farm_city,
      region: row.farm_region,
      public_contact_preferences: row.public_contact_preferences,
    } : null,
    businessProfile: row.business_profile_id ? {
      id: row.business_profile_id,
      business_name: row.business_name,
      slug: row.business_slug,
      business_type: row.business_type,
      description: row.business_description,
      logo_url: row.logo_url,
      cover_image_url: row.cover_image_url,
      city: row.business_city,
      region: row.business_region,
      public_email: row.public_email,
      public_phone: row.public_phone,
      website_url: row.website_url,
      publication_status: row.publication_status,
      verification_status: row.verification_status,
    } : null,
  };
}

profileRouter.get("/me", requireUser, async (_request, response) => {
  const user = response.locals.user as { id: string };
  response.json({ success: true, data: { profile: await loadProfile(user.id) }, message: "Profile retrieved" });
});

profileRouter.patch("/me", requireUser, async (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) throw new HttpError(400, "Check the profile details and try again");
  const user = response.locals.user as { id: string; role: string };
  const input = parsed.data;
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE users
          SET full_name = COALESCE($2, full_name),
              phone = CASE WHEN $3::boolean THEN NULLIF($4, '') ELSE phone END
        WHERE id = $1`,
      [user.id, input.fullName ?? null, input.phone !== undefined, input.phone ?? ""],
    );

    if (user.role === "farmer") {
      if (input.farmName !== undefined || input.description !== undefined || input.city !== undefined ||
          input.region !== undefined || input.shareEmail !== undefined || input.sharePhone !== undefined) {
        const { rows } = await client.query(
          "SELECT farm_name, country_code, public_contact_preferences FROM farmer_profiles WHERE user_id = $1 FOR UPDATE",
          [user.id],
        );
        if (!rows[0]) throw new HttpError(409, "Farmer profile is not available");
        const preferences = {
          ...(rows[0].public_contact_preferences ?? {}),
          ...(input.shareEmail === undefined ? {} : { email: input.shareEmail }),
          ...(input.sharePhone === undefined ? {} : { phone: input.sharePhone }),
        };
        await client.query(
          `UPDATE farmer_profiles
              SET farm_name = COALESCE($2, farm_name),
                  description = CASE WHEN $3::boolean THEN NULLIF($4, '') ELSE description END,
                  city = CASE WHEN $5::boolean THEN NULLIF($6, '') ELSE city END,
                  region = CASE WHEN $7::boolean THEN NULLIF($8, '') ELSE region END,
                  public_contact_preferences = $9::jsonb
            WHERE user_id = $1`,
          [
            user.id, input.farmName ?? null, input.description !== undefined, input.description ?? "",
            input.city !== undefined, input.city ?? "", input.region !== undefined, input.region ?? "",
            JSON.stringify(preferences),
          ],
        );
      }
    } else if (user.role === "business") {
      if (input.businessName !== undefined || input.businessType !== undefined || input.description !== undefined ||
          input.city !== undefined || input.region !== undefined || input.publicEmail !== undefined ||
          input.publicPhone !== undefined || input.websiteUrl !== undefined || input.publicationStatus !== undefined) {
        const { rows } = await client.query(
          "SELECT id FROM business_profiles WHERE user_id = $1 FOR UPDATE",
          [user.id],
        );
        if (!rows[0]) throw new HttpError(409, "Business profile is not available");
        await client.query(
          `UPDATE business_profiles
              SET business_name = COALESCE($2, business_name),
                  business_type = CASE WHEN $3::boolean THEN NULLIF($4, '') ELSE business_type END,
                  description = CASE WHEN $5::boolean THEN NULLIF($6, '') ELSE description END,
                  city = CASE WHEN $7::boolean THEN NULLIF($8, '') ELSE city END,
                  region = CASE WHEN $9::boolean THEN NULLIF($10, '') ELSE region END,
                  public_email = CASE WHEN $11::boolean THEN NULLIF($12, '') ELSE public_email END,
                  public_phone = CASE WHEN $13::boolean THEN NULLIF($14, '') ELSE public_phone END,
                  website_url = CASE WHEN $15::boolean THEN NULLIF($16, '') ELSE website_url END,
                  publication_status = COALESCE($17, publication_status)
            WHERE user_id = $1`,
          [
            user.id, input.businessName ?? null, input.businessType !== undefined, input.businessType ?? "",
            input.description !== undefined, input.description ?? "", input.city !== undefined, input.city ?? "",
            input.region !== undefined, input.region ?? "", input.publicEmail !== undefined, input.publicEmail ?? "",
            input.publicPhone !== undefined, input.publicPhone ?? "", input.websiteUrl !== undefined,
            input.websiteUrl ?? "", input.publicationStatus ?? null,
          ],
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Profile update rollback failed:", rollbackError instanceof Error ? rollbackError.message : "unknown error");
    }
    if (error instanceof HttpError) throw error;
    console.error("Profile update failed:", error instanceof Error ? error.message : "unknown error");
    throw new HttpError(503, "We could not update your profile right now");
  } finally {
    client.release();
  }

  response.json({ success: true, data: { profile: await loadProfile(user.id) }, message: "Profile updated" });
});
