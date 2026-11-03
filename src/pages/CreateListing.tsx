import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest, ApiError } from "../lib/api";
import { useCurrentUser } from "../lib/auth";

export function CreateListing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const [formError, setFormError] = useState("");
  const [listingType, setListingType] = useState<"product" | "service">("product");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const createListing = useMutation({
    mutationFn: async ({ body, image }: { body: Record<string, unknown>; image: File | null }) => {
      const imageUrl = image ? await uploadListingImage(image) : undefined;
      return apiRequest<{ listing: { slug: string } }>("/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, imageUrl }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["marketplace", "mine"] });
      await queryClient.invalidateQueries({ queryKey: ["marketplace", "listings"] });
      navigate("/dashboard");
    },
    onError: (error) => setFormError(error.message),
  });

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("");
      return;
    }
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError("");
    createListing.mutate({
      body: {
        title: formData.get("title"),
        description: formData.get("description"),
        listingType,
        productType: listingType === "product" ? formData.get("productType") : undefined,
        categoryLabel: formData.get("categoryLabel"),
        price: formData.get("price"),
        currencyCode: "NGN",
        unit: formData.get("unit"),
        city: formData.get("city"),
        region: formData.get("region"),
      },
      image: selectedImage,
    });
  }

  const role = currentUser.data?.user.role;
  const canSell = currentUser.data?.user.role === "farmer" || currentUser.data?.user.role === "business";
  const needsSignIn = currentUser.isError && currentUser.error instanceof ApiError && currentUser.error.status === 401;

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/dashboard" className="text-sm font-semibold text-brand hover:text-brand-dark">Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold text-ink">Create a listing</h1>
        <p className="mt-2 text-ink-muted">Add a product or service to the BizzLeap marketplace.</p>

        {currentUser.isPending && <p className="mt-8 text-ink-muted" role="status">Checking your account...</p>}

        {currentUser.isError && !needsSignIn && (
          <div className="mt-8 rounded-lg border border-line bg-white p-6">
            <p role="alert" className="text-danger">{currentUser.error.message}</p>
            <button type="button" onClick={() => currentUser.refetch()} className="mt-4 rounded-lg bg-brand px-5 py-3 font-semibold text-white">Try again</button>
          </div>
        )}

        {needsSignIn && (
          <div className="mt-8 rounded-lg border border-line bg-white p-6">
            <p className="text-ink">Sign in with a farmer or small business account to publish a listing.</p>
            <Link to="/sign-in" className="mt-4 inline-block font-semibold text-brand">Sign in</Link>
          </div>
        )}

        {currentUser.data && !canSell && (
          <div className="mt-8 rounded-lg border border-line bg-white p-6">
            <p className="text-ink">Listings are available to farmer and small business accounts.</p>
            <Link to="/marketplace" className="mt-4 inline-block font-semibold text-brand">Browse the marketplace</Link>
          </div>
        )}

        {canSell && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-ink">Listing title</label>
                <input id="title" name="title" required minLength={3} maxLength={160} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="listingType" className="block text-sm font-semibold text-ink">Offer type</label>
                <select id="listingType" name="listingType" value={listingType} onChange={(event) => setListingType(event.target.value as "product" | "service")} className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3">
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div>
                <label htmlFor="productType" className="block text-sm font-semibold text-ink">Product type</label>
                {listingType === "product" ? (
                  <select id="productType" name="productType" required className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3">
                    <option value="">Choose a product type</option>
                    {role === "farmer" ? (
                      <>
                        <option value="agricultural_produce">Agricultural produce</option>
                        <option value="livestock">Livestock</option>
                      </>
                    ) : (
                      <>
                        <option value="artisan_goods">Artisan goods</option>
                        <option value="small_business_products">Small business products</option>
                        <option value="other">Other products</option>
                      </>
                    )}
                  </select>
                ) : (
                  <p className="mt-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink-muted">Service listing</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="categoryLabel" className="block text-sm font-semibold text-ink">Category <span className="font-normal text-ink-muted">(enter a specific category)</span></label>
                <input id="categoryLabel" name="categoryLabel" maxLength={100} placeholder={role === "farmer" ? "e.g. tomatoes, cassava, poultry, cattle" : "e.g. woven baskets, clothing, baked goods"} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-ink">Price (NGN)</label>
                <input id="price" name="price" type="number" min="0" step="0.01" required className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-semibold text-ink">Price unit <span className="font-normal text-ink-muted">(optional)</span></label>
                <input id="unit" name="unit" maxLength={40} placeholder="per basket, per hour..." className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-ink">City</label>
                <input id="city" name="city" maxLength={100} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-semibold text-ink">State or region</label>
                <input id="region" name="region" maxLength={100} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="image" className="block text-sm font-semibold text-ink">Product photo <span className="font-normal text-ink-muted">(optional, up to 5 MB)</span></label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (file && (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
                      setFormError("Choose a JPEG, PNG, WebP, or AVIF image no larger than 5 MB.");
                      event.target.value = "";
                      setSelectedImage(null);
                      return;
                    }
                    setFormError("");
                    setSelectedImage(file);
                  }}
                  className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3"
                />
                {imagePreview && <img src={imagePreview} alt="Selected product preview" className="mt-3 h-40 rounded-lg object-cover" />}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-ink">Description</label>
                <textarea id="description" name="description" rows={5} maxLength={5000} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
            </div>
            {formError && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link to="/dashboard" className="rounded-lg border border-line px-5 py-3 text-center font-semibold text-ink">Cancel</Link>
              <button type="submit" disabled={createListing.isPending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
                {createListing.isPending ? selectedImage ? "Uploading and publishing..." : "Publishing..." : "Publish listing"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

async function uploadListingImage(file: File): Promise<string> {
  const uploaded = await apiRequest<{ imageUrl: string }>("/media/upload", {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return uploaded.imageUrl;
}