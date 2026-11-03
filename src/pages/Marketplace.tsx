import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import type { MarketplaceListing } from "../lib/marketplace";
import { formatPrice } from "../lib/currency";

interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
}

const availabilityLabel: Record<MarketplaceListing["availability_status"], string> = {
  available: "Available",
  limited: "Limited stock",
  unavailable: "Unavailable",
};

export function Marketplace() {
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const categories = useQuery({
    queryKey: ["marketplace", "categories"],
    queryFn: () => apiRequest<{ categories: MarketplaceCategory[] }>("/marketplace/categories"),
  });

  const listings = useQuery({
    queryKey: ["marketplace", "listings", search, type, category],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (type) params.set("type", type);
      if (category) params.set("category", category);
      return apiRequest<{ listings: MarketplaceListing[] }>(`/marketplace/listings?${params.toString()}`);
    },
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

          <form onSubmit={handleSearch} role="search" className="grid w-full gap-2 sm:grid-cols-[1fr_auto_auto] md:max-w-2xl">
            <label htmlFor="marketplace-search" className="sr-only">Search products and services</label>
            <input
              id="marketplace-search"
              type="search"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Search products or services"
              maxLength={100}
              className="min-w-0 rounded-lg border border-line bg-white px-4 py-2.5 text-ink focus:border-brand focus:outline-none"
            />
            <label className="sr-only" htmlFor="listing-type-filter">Filter by type</label>
            <select id="listing-type-filter" value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-line bg-white px-3 py-2.5 text-ink">
              <option value="">All offers</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
            </select>
            <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">Search</button>
            <div className="sm:col-span-3">
              <label className="sr-only" htmlFor="category-filter">Filter by category</label>
              <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)} disabled={categories.isPending || categories.isError} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink disabled:opacity-60">
                <option value="">All categories</option>
                {categories.data?.categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
              {categories.isError && (
                <p role="alert" className="mt-2 text-sm text-danger">
                  Categories could not be loaded.{" "}
                  <button type="button" onClick={() => categories.refetch()} className="font-semibold underline">Try again</button>
                </p>
              )}
            </div>
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
                {search || category || type ? "No listings match these filters" : "No listings have been published yet"}
              </h2>
              <p className="mt-2 text-ink-muted">
                {search || category || type ? "Try changing or clearing the filters." : "Check back soon as sellers publish their products."}
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
      <ImagePlaceholder label={listing.title} src={listing.image_url} className="h-48 rounded-none" />

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {listing.category_label ?? listing.category_name ?? listing.product_type?.replace(/_/g, " ") ?? (listing.listing_type === "product" ? "Product" : "Service")}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{availabilityLabel[listing.availability_status]}</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{listing.title}</h2>
        {listing.description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{listing.description}</p>}

        <p className="mt-4 text-xl font-bold text-ink">
          {formatPrice(listing.price)}
          {listing.unit && <span className="text-sm font-normal text-ink-muted"> / {listing.unit}</span>}
        </p>
        {location && <p className="mt-1 text-sm text-ink-muted">{location}</p>}
        <p className="mt-3 text-sm text-ink-muted">
          From{" "}
          {listing.business_name && listing.business_slug
            ? <Link to={`/storefront/${listing.business_slug}`} className="font-semibold text-brand hover:underline">{listing.business_name}</Link>
            : listing.business_name ?? listing.seller_name}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2">
            <Link to={`/marketplace/${listing.slug}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">View listing</Link>
            {phoneHref && <a href={phoneHref} aria-label={`Call ${listing.business_name ?? listing.seller_name}`} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-brand">Call</a>}
            {emailHref && <a href={emailHref} aria-label={`Email ${listing.business_name ?? listing.seller_name}`} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-brand">Email</a>}
          </div>
        </div>
      </div>
    </article>
  );
}
