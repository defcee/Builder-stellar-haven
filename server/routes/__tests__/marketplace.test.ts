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
const sessionToken = "b".repeat(64);
const ownerId = "20000000-0000-4000-8000-000000000002";
const listingId = "30000000-0000-4000-8000-000000000003";
const user = {
  id: ownerId,
  full_name: "Amina Farmer",
  email: "amina@example.com",
  role: "farmer",
  country_code: "NG",
};
let listing: Record<string, unknown> | undefined;

const cookie = `bizzleap_session=${sessionToken}`;

beforeEach(() => {
  listing = undefined;
  database.query.mockReset();
  database.connect.mockReset();

  const client = {
    query: vi.fn(async (sql: string, values: unknown[] = []) => {
      if (sql.includes("INSERT INTO listings")) {
        listing = {
          id: listingId,
          slug: values[3],
          title: values[2],
          listing_type: values[5],
          price: values[6],
          product_type: values[7],
          category_label: values[8],
        };
        return { rows: [{ id: listingId, slug: values[3] }] };
      }

      return { rows: [] };
    }),
    release: vi.fn(),
  };
  database.connect.mockResolvedValue(client);

  const sessionHash = createHash("sha256").update(sessionToken).digest("hex");
  database.query.mockImplementation(
    async (sql: string, values: unknown[] = []) => {
      if (sql.includes("FROM sessions s")) {
        return { rows: values[0] === sessionHash ? [user] : [] };
      }

      if (sql.includes("WHERE l.owner_id = $1")) {
        return { rows: listing ? [listing] : [] };
      }

      return { rows: [] };
    },
  );
});

describe("marketplace listing routes", () => {
  it("rejects product listings without a product type", async () => {
    const response = await request(app)
      .post("/api/v1/marketplace/listings")
      .set("Cookie", cookie)
      .send({ title: "Fresh tomatoes", listingType: "product", price: 2500 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Choose a product type");
    expect(database.connect).not.toHaveBeenCalled();
  });

  it("publishes a valid farmer listing and returns it from the seller dashboard route", async () => {
    const created = await request(app)
      .post("/api/v1/marketplace/listings")
      .set("Cookie", cookie)
      .send({
        title: "Fresh tomatoes",
        description: "Locally grown tomatoes",
        listingType: "product",
        productType: "agricultural_produce",
        categoryLabel: "Tomatoes",
        price: 2500,
        currencyCode: "ngn",
      });

    expect(created.status).toBe(201);
    expect(created.body.data.listing.id).toBe(listingId);
    expect(created.body.data.listing.slug).toMatch(/^fresh-tomatoes-/);

    const mine = await request(app)
      .get("/api/v1/marketplace/listings/mine")
      .set("Cookie", cookie);

    expect(mine.status).toBe(200);
    expect(mine.body.data.listings).toHaveLength(1);
    expect(mine.body.data.listings[0]).toMatchObject({
      id: listingId,
      product_type: "agricultural_produce",
      category_label: "Tomatoes",
    });
  });
});
