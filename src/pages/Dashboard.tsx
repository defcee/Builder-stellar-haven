import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest, ApiError } from "../lib/api";
import { useCurrentUser } from "../lib/auth";
import type { MarketplaceListing } from "../lib/marketplace";
import { formatPrice } from "../lib/currency";

export function Dashboard() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const user = currentUser.data?.user;
  const needsSignIn = currentUser.isError && currentUser.error instanceof ApiError && currentUser.error.status === 401;
  const isSeller = user?.role === "farmer" || user?.role === "business";
  const listings = useQuery({
    queryKey: ["marketplace", "mine"],
    queryFn: () => apiRequest<{ listings: MarketplaceListing[] }>("/marketplace/listings/mine"),
    enabled: isSeller,
  });
  const updateListing = useMutation({
    mutationFn: ({ id, availabilityStatus }: { id: string; availabilityStatus: MarketplaceListing["availability_status"] }) =>
      apiRequest(`/marketplace/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityStatus }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marketplace", "mine"] }),
  });
  const archiveListing = useMutation({
    mutationFn: (id: string) => apiRequest(`/marketplace/listings/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["marketplace", "mine"] });
      await queryClient.invalidateQueries({ queryKey: ["marketplace", "listings"] });
    },
  });

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {currentUser.isPending && <p className="text-center text-ink-muted" role="status">Loading your account...</p>}

        {currentUser.isError && !needsSignIn && (
          <section className="mx-auto max-w-xl rounded-lg border border-line bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-ink">Dashboard unavailable</h1>
            <p role="alert" className="mt-2 text-ink-muted">{currentUser.error.message}</p>
            <button type="button" onClick={() => currentUser.refetch()} className="mt-5 rounded-lg bg-brand px-5 py-3 font-semibold text-white">
              Try again
            </button>
          </section>
        )}

        {needsSignIn && (
          <section className="mx-auto max-w-xl rounded-lg border border-line bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-ink">Sign in to your account</h1>
            <p className="mt-2 text-ink-muted">Your dashboard and listings are available after sign in.</p>
            <Link to="/sign-in" className="mt-5 inline-flex rounded-lg bg-brand px-5 py-3 font-semibold text-white">Sign in</Link>
          </section>
        )}

        {user && (
          <>
            <div className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand">{user.role === "business" ? "Small business" : user.role}</p>
                <h1 className="mt-2 text-3xl font-bold text-ink">Welcome, {user.full_name}</h1>
                <p className="mt-2 text-ink-muted">{user.email}</p>
              </div>
              {isSeller && (
                <Link to="/listings/new" className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">
                  Create a listing
                </Link>
              )}
            </div>

            {isSeller ? (
              <section className="mt-8" aria-labelledby="your-listings-title">
                <h2 id="your-listings-title" className="text-xl font-bold text-ink">Your listings</h2>
                {listings.isPending && <p className="mt-5 text-ink-muted">Loading your listings...</p>}
                {listings.isError && <p role="alert" className="mt-5 text-danger">{listings.error.message}</p>}
                {listings.isSuccess && listings.data.listings.length === 0 && (
                  <div className="mt-5 rounded-lg border border-dashed border-line bg-white p-8 text-center">
                    <h3 className="font-semibold text-ink">Your storefront starts here</h3>
                    <p className="mt-2 text-sm text-ink-muted">Publish your first product or service to appear in the marketplace.</p>
                    <Link to="/listings/new" className="mt-4 inline-flex rounded-lg bg-brand px-5 py-3 font-semibold text-white">Create a listing</Link>
                  </div>
                )}
                {listings.isSuccess && listings.data.listings.length > 0 && (
                  <ul className="mt-5 divide-y divide-line border-y border-line">
                    {listings.data.listings.map((listing) => (
                      <li key={listing.id} className="grid gap-4 py-5 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                        <ImagePlaceholder label={listing.title} src={listing.image_url} className="h-24 rounded-lg" />
                        <div className="min-w-0">
                          <Link to={`/marketplace/${listing.slug}`} className="font-semibold text-ink hover:text-brand">{listing.title}</Link>
                          <p className="mt-1 text-sm text-ink-muted">{formatPrice(listing.price)}{listing.unit ? ` / ${listing.unit}` : ""} · {listing.category_label ?? listing.category_name ?? listing.product_type?.replace(/_/g, " ") ?? (listing.listing_type === "product" ? "Product" : "Service")}</p>
                          <p className="mt-1 text-xs text-ink-muted">{listing.city && listing.region ? `${listing.city}, ${listing.region}` : listing.city || listing.region || "Location not set"}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="sr-only" htmlFor={`availability-${listing.id}`}>Availability for {listing.title}</label>
                          <select
                            id={`availability-${listing.id}`}
                            value={listing.availability_status}
                            disabled={updateListing.isPending}
                            onChange={(event) => updateListing.mutate({ id: listing.id, availabilityStatus: event.target.value as MarketplaceListing["availability_status"] })}
                            className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
                          >
                            <option value="available">Available</option>
                            <option value="limited">Limited</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                          <button
                            type="button"
                            disabled={archiveListing.isPending}
                            onClick={() => {
                              if (window.confirm(`Archive “${listing.title}”? It will no longer appear in the marketplace.`)) {
                                archiveListing.mutate(listing.id);
                              }
                            }}
                            className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-muted hover:border-danger hover:text-danger disabled:opacity-60"
                          >
                            Archive
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {(updateListing.isError || archiveListing.isError) && (
                  <p role="alert" className="mt-4 text-sm text-danger">{updateListing.error?.message ?? archiveListing.error?.message}</p>
                )}
              </section>
            ) : (
              <section className="mt-8 rounded-lg border border-line bg-white p-7">
                <h2 className="text-xl font-bold text-ink">Discover something local</h2>
                <p className="mt-2 text-ink-muted">Browse products and services from farmers and small businesses.</p>
                <Link to="/marketplace" className="mt-4 inline-flex rounded-lg bg-brand px-5 py-3 font-semibold text-white">Explore marketplace</Link>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}