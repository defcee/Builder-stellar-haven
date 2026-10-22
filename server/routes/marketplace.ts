import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";

export const marketplaceRouter = Router();

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
});

marketplaceRouter.get("/listings", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new HttpError(400, "Search text must be 100 characters or fewer");
  }

  const search = parsed.data.q || null;

  let rows;
  try {
    ({ rows } = await getPool().query(
      `SELECT l.id, l.slug, l.title, l.description, l.listing_type, l.price, l.currency_code,
              l.unit, l.availability_status, l.region, l.city, l.published_at,
              img.image_url, img.alt_text,
              bp.business_name, bp.slug AS business_slug, bp.public_email, bp.public_phone
         FROM listings l
         LEFT JOIN business_profiles bp ON bp.id = l.business_id
         LEFT JOIN LATERAL (
           SELECT li.image_url, li.alt_text
             FROM listing_images li
            WHERE li.listing_id = l.id
            ORDER BY li.sort_order, li.created_at
            LIMIT 1
         ) img ON true
        WHERE l.publication_status = 'published'
          AND (l.business_id IS NULL OR bp.publication_status = 'published')
          AND ($1::text IS NULL OR l.search_vector @@ plainto_tsquery('simple', $1))
        ORDER BY l.published_at DESC
        LIMIT 24`,
      [search],
    ));
  } catch {
    throw new HttpError(503, "The marketplace is not available right now. Please try again later.");
  }

  res.json({ success: true, data: { listings: rows }, message: "Listings retrieved" });
});
