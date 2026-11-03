import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import { formatPrice } from "../lib/currency";
import type { MarketplaceListing } from "../lib/marketplace";

interface StorefrontDetails {
  business_name: string;
  slug: string;
  business_type: string | null;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  region: string | null;
  city: string | null;
  public_email: string | null;
  public_phone: string | null;
  website_url: string | null;
}

export function Storefront() {
  const { slug = "" } = useParams();
  const storefront = useQuery({
    queryKey: ["marketplace", "storefront", slug],
    queryFn: () => apiRequest<{ storefront: StorefrontDetails; listings: MarketplaceListing[] }>(`/marketplace/storefronts/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });
  const data = storefront.data;
  const location = data ? [data.storefront.city, data.storefront.region].filter(Boolean).join(", ") : "";

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link to="/marketplace" className="text-sm font-semibold text-brand">Back to marketplace</Link>
        {storefront.isPending && <p className="mt-8 text-ink-muted" role="status">Loading storefront...</p>}
        {storefront.isError && (
          <section className="mt-8 rounded-lg border border-line bg-white p-8">
            <h1 className="text-2xl font-bold text-ink">Storefront unavailable</h1>
            <p role="alert" className="mt-2 text-ink-muted">{storefront.error.message}</p>
          </section>
        )}
        {data && (
          <>
            <section className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
              {data.storefront.cover_image_url
                ? <img src={data.storefront.cover_image_url} alt="" className="h-52 w-full object-cover" />
                : <div className="h-32 bg-gradient-to-r from-brand/15 to-warm-cream" />}
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
                {data.storefront.logo_url && <img src={data.storefront.logo_url} alt="" className="h-20 w-20 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand">{data.storefront.business_type ?? "Local business"}</p>
                  <h1 className="mt-1 text-3xl font-bold text-ink">{data.storefront.business_name}</h1>
                  {location && <p className="mt-2 text-sm text-ink-muted">{location}</p>}
                  {data.storefront.description && <p className="mt-4 whitespace-pre-line leading-7 text-ink-muted">{data.storefront.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {data.storefront.public_email && <a className="font-semibold text-brand" href={`mailto:${data.storefront.public_email}`}>Email</a>}
                    {data.storefront.public_phone && <a className="font-semibold text-brand" href={`tel:${data.storefront.public_phone.replace(/[^+\d]/g, "")}`}>Call</a>}
                    {data.storefront.website_url && <a className="font-semibold text-brand" href={data.storefront.website_url} target="_blank" rel="noreferrer">Website</a>}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-ink">Products and services</h2>
              {data.listings.length === 0 && <p className="mt-4 text-ink-muted">This business has not published any listings yet.</p>}
              <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.listings.map((listing) => (
                  <li key={listing.id} className="overflow-hidden rounded-xl border border-line bg-white">
                    <ImagePlaceholder label={listing.title} src={listing.image_url} className="h-48 rounded-none" />
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase text-brand">{listing.category_label ?? listing.category_name ?? listing.product_type?.replace(/_/g, " ") ?? listing.listing_type}</p>
                      <Link to={`/marketplace/${listing.slug}`} className="mt-1 block text-lg font-semibold text-ink hover:text-brand">{listing.title}</Link>
                      <p className="mt-3 font-bold text-ink">{formatPrice(listing.price)}{listing.unit ? ` / ${listing.unit}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
