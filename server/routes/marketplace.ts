import { randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { getPool } from "../db/pool.js";
import { HttpError } from "../middleware/errors.js";
import { requireUser } from "./auth.js";

export const marketplaceRouter = Router();

const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  type: z.enum(["product", "service"]).optional(),
  category: z.string().trim().max(80).optional(),
});

const createListingSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(5000).optional(),
  listingType: z.enum(["product", "service"]),
  productType: z.enum(["agricultural_produce", "livestock", "artisan_goods", "small_business_products", "other"]).optional(),
  categoryLabel: z.string().trim().max(100).optional(),
  price: z.coerce.number().finite().min(0).max(999999999),
  currencyCode: z.string().length(3).default("NGN").transform((code) => code.toUpperCase()),
  unit: z.string().trim().max(40).optional(),
  categoryId: z.string().uuid().optional(),
  city: z.string().trim().max(100).optional(),
  region: z.string().trim().max(100).optional(),
  imageUrl: z.string().url().refine((value) => {
    try {
      return new URL(value).hostname === "res.cloudinary.com";
    } catch {
      return false;
    }
  }).optional(),
});

const updateListingSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().max(5000).optional(),
  price: z.coerce.number().finite().min(0).max(999999999).optional(),
  availabilityStatus: z.enum(["available", "limited", "unavailable"]).optional(),
}).refine((value) => Object.keys(value).length > 0);

const listingSelect = `
  SELECT l.id, l.owner_id, l.slug, l.title, l.description, l.listing_type, l.price,
         l.currency_code, l.unit, l.availability_status, l.region, l.city,
         l.published_at, l.created_at, l.category_id, c.name AS category_name,
         l.product_type, l.category_label,
         img.image_url, img.alt_text, owner.full_name AS seller_name,
         bp.business_name, CASE WHEN bp.publication_status = 'published' THEN bp.slug END AS business_slug,
         COALESCE(bp.public_email, CASE WHEN fp.public_contact_preferences->>'email' = 'true' THEN owner.email END) AS public_email,
         COALESCE(bp.public_phone, CASE WHEN fp.public_contact_preferences->>'phone' = 'true' THEN owner.phone END) AS public_phone
    FROM listings l
    JOIN users owner ON owner.id = l.owner_id
    LEFT JOIN categories c ON c.id = l.category_id
    LEFT JOIN business_profiles bp ON bp.user_id = owner.id
    LEFT JOIN farmer_profiles fp ON fp.user_id = owner.id
    LEFT JOIN LATERAL (
      SELECT li.image_url, li.alt_text
        FROM listing_images li
       WHERE li.listing_id = l.id
       ORDER BY li.sort_order, li.created_at
       LIMIT 1
    ) img ON true`;

marketplaceRouter.get("/categories", async (_request, response) => {
  const { rows } = await getPool().query(
    "SELECT id, name, slug FROM categories WHERE is_active = true ORDER BY name",
  );
  response.json({ success: true, data: { categories: rows }, message: "Categories retrieved" });
});

marketplaceRouter.get("/listings", async (request, response) => {
  const parsed = querySchema.safeParse(request.query);
  if (!parsed.success) throw new HttpError(400, "Search filters are invalid");

  const { q, type, category } = parsed.data;
  const { rows } = await getPool().query(
    `${listingSelect}
      WHERE l.publication_status = 'published'
        AND ($1::text IS NULL OR l.search_vector @@ plainto_tsquery('simple', $1)
          OR l.category_label ILIKE '%' || $1 || '%'
          OR l.product_type ILIKE '%' || replace($1, ' ', '_') || '%')
        AND ($2::text IS NULL OR l.listing_type = $2)
        AND ($3::text IS NULL OR c.slug = $3)
      ORDER BY l.published_at DESC NULLS LAST, l.created_at DESC
      LIMIT 48`,
    [q || null, type || null, category || null],
  );
  response.json({ success: true, data: { listings: rows }, message: "Listings retrieved" });
});

marketplaceRouter.get("/storefronts/:slug", async (request, response) => {
  const slug = z.string().min(1).max(200).safeParse(request.params.slug);
  if (!slug.success) throw new HttpError(400, "Storefront was not found");
  const { rows: storefrontRows } = await getPool().query(
    `SELECT id, user_id, business_name, slug, business_type, description, logo_url, cover_image_url,
            country_code, region, city, public_email, public_phone, website_url, verification_status
       FROM business_profiles
      WHERE slug = $1 AND publication_status = 'published'
      LIMIT 1`,
    [slug.data],
  );
  const storefront = storefrontRows[0];
  if (!storefront) throw new HttpError(404, "This storefront is not available");
  const { rows: listings } = await getPool().query(
    `${listingSelect}
      WHERE l.owner_id = $1 AND l.publication_status = 'published'
      ORDER BY l.published_at DESC NULLS LAST, l.created_at DESC
      LIMIT 48`,
    [storefront.user_id],
  );
  response.json({ success: true, data: { storefront, listings }, message: "Storefront retrieved" });
});

marketplaceRouter.get("/listings/mine", requireUser, async (_request, response) => {
  const user = response.locals.user as { id: string };
  const { rows } = await getPool().query(
    `${listingSelect}
      WHERE l.owner_id = $1 AND l.publication_status <> 'archived'
      ORDER BY l.created_at DESC`,
    [user.id],
  );
  response.json({ success: true, data: { listings: rows }, message: "Your listings" });
});

marketplaceRouter.get("/listings/:slug", async (request, response) => {
  const slug = z.string().min(1).max(200).safeParse(request.params.slug);
  if (!slug.success) throw new HttpError(400, "Listing was not found");
  const { rows } = await getPool().query(
    `${listingSelect}
      WHERE l.slug = $1 AND l.publication_status = 'published'
      LIMIT 1`,
    [slug.data],
  );
  if (!rows[0]) throw new HttpError(404, "This listing is no longer available");
  response.json({ success: true, data: { listing: rows[0] }, message: "Listing retrieved" });
});

marketplaceRouter.post("/listings", requireUser, async (request, response) => {
  const parsed = createListingSchema.safeParse(request.body);
  if (!parsed.success) throw new HttpError(400, "Check the listing details and try again");
  const user = response.locals.user as { id: string; role: string; country_code: string };
  if (user.role !== "farmer" && user.role !== "business") {
    throw new HttpError(403, "Only farmers and business owners can publish listings");
  }

  const input = parsed.data;
  const allowedProductTypes = user.role === "farmer"
    ? ["agricultural_produce", "livestock"]
    : ["artisan_goods", "small_business_products", "other"];
  if (input.listingType === "product" && !input.productType) {
    throw new HttpError(400, "Choose a product type");
  }
  if (input.listingType === "service" && input.productType) {
    throw new HttpError(400, "Product type is only valid for product listings");
  }
  if (input.productType && !allowedProductTypes.includes(input.productType)) {
    throw new HttpError(400, "Choose a product type available for your account");
  }
  const slugBase = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "listing";
  const slug = `${slugBase.slice(0, 130)}-${randomBytes(4).toString("hex")}`;
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO listings (
         owner_id, category_id, title, slug, description, listing_type, price,
         product_type, category_label, currency_code, unit, country_code, city, region, publication_status, published_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULLIF($9, ''), $10, NULLIF($11, ''), $12, NULLIF($13, ''), NULLIF($14, ''), 'published', now())
       RETURNING id, slug`,
      [
        user.id,
        input.categoryId ?? null,
        input.title,
        slug,
        input.description ?? null,
        input.listingType,
        input.price,
        input.productType ?? null,
        input.categoryLabel ?? "",
        input.currencyCode,
        input.unit ?? "",
        user.country_code,
        input.city ?? "",
        input.region ?? "",
      ],
    );
    const listing = rows[0];
    if (input.imageUrl) {
      await client.query(
        `INSERT INTO listing_images (listing_id, image_url, storage_key, alt_text)
         VALUES ($1, $2, $3, $4)`,
        [listing.id, input.imageUrl, input.imageUrl, input.title],
      );
    }
    await client.query("COMMIT");
    response.status(201).json({ success: true, data: { listing }, message: "Listing published" });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Listing creation rollback failed:", rollbackError instanceof Error ? rollbackError.message : "unknown error");
    }
    console.error("Listing creation failed:", error instanceof Error ? error.message : "unknown error");
    throw new HttpError(503, "We could not publish this listing. Please try again.");
  } finally {
    client.release();
  }
});

marketplaceRouter.patch("/listings/:id", requireUser, async (request, response) => {
  const id = z.string().uuid().safeParse(request.params.id);
  const parsed = updateListingSchema.safeParse(request.body);
  if (!id.success || !parsed.success) throw new HttpError(400, "Listing update is invalid");
  const user = response.locals.user as { id: string };
  const update = parsed.data;
  const { rows } = await getPool().query(
    `UPDATE listings
        SET title = COALESCE($3, title),
            description = COALESCE($4, description),
            price = COALESCE($5, price),
            availability_status = COALESCE($6, availability_status)
      WHERE id = $1 AND owner_id = $2 AND publication_status <> 'archived'
      RETURNING id, slug, title, availability_status`,
    [id.data, user.id, update.title ?? null, update.description ?? null, update.price ?? null, update.availabilityStatus ?? null],
  );
  if (!rows[0]) throw new HttpError(404, "Listing not found");
  response.json({ success: true, data: { listing: rows[0] }, message: "Listing updated" });
});

marketplaceRouter.delete("/listings/:id", requireUser, async (request, response) => {
  const id = z.string().uuid().safeParse(request.params.id);
  if (!id.success) throw new HttpError(400, "Listing was not found");
  const user = response.locals.user as { id: string };
  const { rowCount } = await getPool().query(
    `UPDATE listings SET publication_status = 'archived'
      WHERE id = $1 AND owner_id = $2 AND publication_status <> 'archived'`,
    [id.data, user.id],
  );
  if (!rowCount) throw new HttpError(404, "Listing not found");
  response.json({ success: true, data: null, message: "Listing archived" });
});

marketplaceRouter.get("/listings/:slug/reviews", async (request, response) => {
  const slug = z.string().min(1).max(200).safeParse(request.params.slug);
  if (!slug.success) throw new HttpError(400, "Listing was not found");
  const { rows: listingRows } = await getPool().query(
    "SELECT id FROM listings WHERE slug = $1 AND publication_status = 'published'",
    [slug.data],
  );
  if (!listingRows[0]) throw new HttpError(404, "This listing is no longer available");
  const { rows } = await getPool().query(
    `SELECT r.id, r.rating, r.review_text, r.created_at, u.full_name AS reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
      WHERE r.listing_id = $1 AND r.moderation_status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT 100`,
    [listingRows[0].id],
  );
  response.json({ success: true, data: { reviews: rows }, message: "Reviews retrieved" });
});

marketplaceRouter.post("/listings/:slug/reviews", requireUser, async (request, response) => {
  const slug = z.string().min(1).max(200).safeParse(request.params.slug);
  const parsedReview = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    reviewText: z.string().trim().max(2000).optional(),
  }).safeParse(request.body);
  if (!slug.success || !parsedReview.success) throw new HttpError(400, "Review details are invalid");
  const reviewer = response.locals.user as { id: string };
  const { rows: listingRows } = await getPool().query(
    `SELECT l.id, l.owner_id, l.title, bp.id AS business_id
       FROM listings l
       LEFT JOIN business_profiles bp ON bp.user_id = l.owner_id
      WHERE l.slug = $1 AND l.publication_status = 'published'`,
    [slug.data],
  );
  const listing = listingRows[0];
  if (!listing) throw new HttpError(404, "This listing is no longer available");
  if (listing.owner_id === reviewer.id) throw new HttpError(403, "You cannot review your own listing");

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO reviews (reviewer_id, listing_id, rating, review_text)
       VALUES ($1, $2, $3, NULLIF($4, ''))
       RETURNING id, rating, review_text, created_at`,
      [reviewer.id, listing.id, parsedReview.data.rating, parsedReview.data.reviewText ?? ""],
    );
    await client.query(
      `INSERT INTO notifications (user_id, notification_type, title, body, destination_path)
       VALUES ($1, 'review', 'New listing review', $2, $3)`,
      [listing.owner_id, `Your listing “${listing.title}” received a ${parsedReview.data.rating}-star review.`,
        `/marketplace/${slug.data}`],
    );
    await client.query("COMMIT");
    response.status(201).json({ success: true, data: { review: rows[0] }, message: "Review submitted" });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Review submission rollback failed:", rollbackError instanceof Error ? rollbackError.message : "unknown error");
    }
    if (error instanceof HttpError) throw error;
    if (error instanceof Error && "code" in error && error.code === "23505") {
      throw new HttpError(409, "You have already reviewed this listing");
    }
    console.error("Review submission failed:", error instanceof Error ? error.message : "unknown error");
    throw new HttpError(503, "We could not submit your review");
  } finally {
    client.release();
  }
});