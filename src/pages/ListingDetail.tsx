import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import type { MarketplaceListing } from "../lib/marketplace";
import { formatPrice } from "../lib/currency";
import { useCurrentUser } from "../lib/auth";

interface ListingReview {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  reviewer_name: string;
}

export function ListingDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const listing = useQuery({
    queryKey: ["marketplace", "listing", slug],
    queryFn: () => apiRequest<{ listing: MarketplaceListing }>(`/marketplace/listings/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });
  const reviews = useQuery({
    queryKey: ["marketplace", "reviews", slug],
    queryFn: () => apiRequest<{ reviews: ListingReview[] }>(`/marketplace/listings/${encodeURIComponent(slug)}/reviews`),
    enabled: Boolean(slug),
  });
  const messageSeller = useMutation({
    mutationFn: (listingId: string) =>
      apiRequest<{ conversationId: string }>("/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      }),
    onSuccess: ({ conversationId }) => navigate(`/messages?conversation=${conversationId}`),
  });
  const submitReview = useMutation({
    mutationFn: () =>
      apiRequest<{ review: ListingReview }>(`/marketplace/listings/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating), reviewText }),
      }),
    onSuccess: async () => {
      setReviewText("");
      await queryClient.invalidateQueries({ queryKey: ["marketplace", "reviews", slug] });
    },
  });
  const item = listing.data?.listing;
  const emailHref = item?.public_email
    ? `mailto:${item.public_email}?subject=${encodeURIComponent(`Enquiry about ${item.title}`)}`
    : null;
  const phoneHref = item?.public_phone ? `tel:${item.public_phone.replace(/[^+\d]/g, "")}` : null;

  function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitReview.mutate();
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Link to="/marketplace" className="text-sm font-semibold text-brand hover:text-brand-dark">Back to marketplace</Link>
        {listing.isPending && <p className="mt-8 text-ink-muted">Loading listing...</p>}
        {listing.isError && (
          <section className="mt-8 rounded-lg border border-line bg-white p-8">
            <h1 className="text-2xl font-bold text-ink">Listing unavailable</h1>
            <p className="mt-2 text-ink-muted">{listing.error.message}</p>
            <Link to="/marketplace" className="mt-5 inline-flex font-semibold text-brand">Browse other listings</Link>
          </section>
        )}
        {item && (
          <article className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <ImagePlaceholder label={item.title} src={item.image_url} className="min-h-[320px] rounded-lg sm:min-h-[500px]" />
            <div className="flex flex-col">
              <p className="text-sm font-bold uppercase tracking-wide text-brand">
                {item.category_label ?? item.category_name ?? item.product_type?.replace(/_/g, " ") ?? (item.listing_type === "product" ? "Product" : "Service")}
              </p>
              <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{item.title}</h1>
              <p className="mt-5 text-2xl font-bold text-ink">
                {formatPrice(item.price)}{item.unit && <span className="text-base font-normal text-ink-muted"> / {item.unit}</span>}
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                {item.availability_status === "available" ? "Available now" : item.availability_status === "limited" ? "Limited availability" : "Currently unavailable"}
              </p>
              {(item.city || item.region) && <p className="mt-2 text-sm text-ink-muted">{[item.city, item.region].filter(Boolean).join(", ")}</p>}
              {item.description && <p className="mt-7 whitespace-pre-line leading-7 text-ink-muted">{item.description}</p>}

              <section className="mt-8 border-t border-line pt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Seller</h2>
                <p className="mt-2 text-lg font-semibold text-ink">{item.business_name ?? item.seller_name}</p>
                {item.business_slug && <Link to={`/storefront/${item.business_slug}`} className="mt-2 inline-block text-sm font-semibold text-brand">Visit storefront</Link>}
                <div className="mt-4 flex flex-wrap gap-3">
                  {phoneHref && <a href={phoneHref} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">Call seller</a>}
                  {emailHref && <a href={emailHref} className="rounded-lg border border-brand px-5 py-3 font-semibold text-brand hover:bg-brand/5">Email seller</a>}
                  {!phoneHref && !emailHref && <p className="text-sm text-ink-muted">The seller has not shared public contact details.</p>}
                </div>
                {!currentUser.data?.user && <Link to="/sign-in" className="mt-4 inline-flex rounded-lg border border-brand px-5 py-3 font-semibold text-brand">Sign in to message seller</Link>}
                {currentUser.data?.user && currentUser.data.user.id !== item.owner_id && (
                  <button type="button" disabled={messageSeller.isPending} onClick={() => messageSeller.mutate(item.id)} className="mt-4 inline-flex rounded-lg border border-brand px-5 py-3 font-semibold text-brand disabled:opacity-60">
                    {messageSeller.isPending ? "Opening conversation..." : "Message seller"}
                  </button>
                )}
                {messageSeller.isError && <p role="alert" className="mt-3 text-sm text-danger">{messageSeller.error.message}</p>}
              </section>
            </div>
          </article>
        )}
        {item && (
          <section className="mt-12 border-t border-line pt-8" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-2xl font-bold text-ink">Reviews</h2>
            {reviews.isPending && <p className="mt-4 text-ink-muted" role="status">Loading reviews...</p>}
            {reviews.isError && (
              <div role="alert" className="mt-4 text-sm text-danger">
                <p>{reviews.error.message}</p>
                <button type="button" onClick={() => reviews.refetch()} className="mt-2 font-semibold underline">Try again</button>
              </div>
            )}
            {reviews.data?.reviews.length === 0 && <p className="mt-4 text-sm text-ink-muted">No reviews yet.</p>}
            <ul className="mt-4 space-y-4">
              {reviews.data?.reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-line bg-white p-5">
                  <p className="font-semibold text-ink">{review.reviewer_name} <span className="ml-2 text-amber-600" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></p>
                  {review.review_text && <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">{review.review_text}</p>}
                  <time className="mt-3 block text-xs text-ink-muted" dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time>
                </li>
              ))}
            </ul>
            {currentUser.data?.user && currentUser.data.user.id !== item.owner_id && (
              <form onSubmit={handleReviewSubmit} className="mt-8 max-w-2xl space-y-4 rounded-lg border border-line bg-white p-5">
                <h3 className="font-semibold text-ink">Leave a review</h3>
                <div>
                  <label htmlFor="review-rating" className="block text-sm font-semibold text-ink">Rating</label>
                  <select id="review-rating" value={rating} onChange={(event) => setRating(event.target.value)} className="mt-2 rounded-lg border border-line bg-white px-4 py-2">
                    {[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} {score === 1 ? "star" : "stars"}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="review-text" className="block text-sm font-semibold text-ink">Comment <span className="font-normal text-ink-muted">(optional)</span></label>
                  <textarea id="review-text" value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={2000} rows={4} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                {submitReview.isError && <p role="alert" className="text-sm text-danger">{submitReview.error.message}</p>}
                {submitReview.isSuccess && <p role="status" className="text-sm text-success">Your review was submitted.</p>}
                <button type="submit" disabled={submitReview.isPending} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white disabled:opacity-60">
                  {submitReview.isPending ? "Submitting..." : "Submit review"}
                </button>
              </form>
            )}
            {!currentUser.data?.user && <p className="mt-6 text-sm text-ink-muted"><Link to="/sign-in" className="font-semibold text-brand">Sign in</Link> to leave a review.</p>}
          </section>
        )}
      </main>
    </div>
  );
}