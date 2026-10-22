import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import { formatPrice } from "../lib/currency";

interface MarketplaceListing {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  listing_type: "product" | "service";
  price: string;
  currency_code: string;
  unit: string | null;
  availability_status: "available" | "limited" | "unavailable";
  region: string | null;
  city: string | null;
  image_url: string | null;
  alt_text: string | null;
  business_name: string | null;
  business_slug: string | null;
  public_email: string | null;
  public_phone: string | null;
}

const availabilityLabel: Record<MarketplaceListing["availability_status"], string> = {
  available: "Available",
  limited: "Limited stock",
  unavailable: "Unavailable",
};

export function Marketplace() {
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");

  const listings = useQuery({
    queryKey: ["marketplace", "listings", search],
    queryFn: () =>
      apiRequest<{ listings: MarketplaceListing[] }>(
        `/marketplace/listings${search ? `?q=${encodeURIComponent(search)}` : ""}`,
      ),
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(draftSearch.trim());
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">Marketplace</h1>
            <p className="mt-2 text-ink-muted">Browse published products and services, then contact the seller directly.</p>
          </div>

          <form onSubmit={handleSearch} role="search" className="flex w-full gap-2 md:max-w-md">
            <label htmlFor="marketplace-search" className="sr-only">
              Search products and services
            </label>
            <input
              id="marketplace-search"
              type="search"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Search products or services"
              maxLength={100}
              className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-ink shadow-card focus:border-brand focus:outline-none"
            />
            <button type="submit" className="rounded-xl bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
              Search
            </button>
          </form>
        </div>

        <section aria-live="polite" className="mt-10">
          {listings.isPending && <p className="text-ink-muted">Loading listings...</p>}

          {listings.isError && (
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <p className="font-medium text-danger">{listings.error.message}</p>
              <button
                type="button"
                onClick={() => listings.refetch()}
                className="mt-4 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
              >
                Try again
              </button>
            </div>
          )}

          {listings.isSuccess && listings.data.listings.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-card">
              <h2 className="text-lg font-semibold text-ink">
                {search ? "No listings match your search" : "No listings have been published yet"}
              </h2>
              <p className="mt-2 text-ink-muted">
                {search ? "Try different words or clear the search." : "Check back soon as sellers publish their products."}
              </p>
            </div>
          )}

          {listings.isSuccess && listings.data.listings.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.data.listings.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-12 text-center text-sm text-ink-muted">
          <Link to="/" className="font-semibold text-brand hover:text-brand-dark">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const location = [listing.city, listing.region].filter(Boolean).join(", ");
  const phoneHref = listing.public_phone ? `tel:${listing.public_phone.replace(/[^+\d]/g, "")}` : null;
  const emailHref = listing.public_email
    ? `mailto:${listing.public_email}?subject=${encodeURIComponent(`Enquiry about ${listing.title}`)}`
    : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      {listing.image_url ? (
        <img src={listing.image_url} alt={listing.alt_text ?? listing.title} className="h-48 w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-warm-cream to-brand/10 text-sm font-semibold uppercase tracking-wide text-brand-dark">
          {listing.listing_type === "service" ? "Service" : "Product"}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{availabilityLabel[listing.availability_status]}</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{listing.title}</h2>
        {listing.description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{listing.description}</p>}

        <p className="mt-4 text-xl font-bold text-ink">
          {formatPrice(listing.price)}
          {listing.unit && <span className="text-sm font-normal text-ink-muted"> / {listing.unit}</span>}
        </p>
        {location && <p className="mt-1 text-sm text-ink-muted">{location}</p>}
        {listing.business_name && <p className="mt-3 text-sm font-medium text-ink">Sold by {listing.business_name}</p>}

        <div className="mt-auto pt-5">
          {phoneHref || emailHref ? (
            <div className="flex flex-wrap gap-2">
              {phoneHref && (
                <a href={phoneHref} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                  Call seller
                </a>
              )}
              {emailHref && (
                <a href={emailHref} className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5">
                  Email seller
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">This seller has not published contact details.</p>
          )}
        </div>
      </div>
    </article>
  );
}
