import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";
import { useCurrentUser } from "../lib/auth";
import type { FormEvent } from "react";

interface ProfileData {
  user: {
    full_name: string;
    email: string;
    phone: string | null;
    role: string;
  };
  farmerProfile: {
    farm_name: string;
    description: string | null;
    city: string | null;
    region: string | null;
    public_contact_preferences: { email?: boolean; phone?: boolean };
  } | null;
  businessProfile: {
    business_name: string;
    business_type: string | null;
    description: string | null;
    city: string | null;
    region: string | null;
    public_email: string | null;
    public_phone: string | null;
    website_url: string | null;
    publication_status: "draft" | "published";
    slug: string;
  } | null;
}

export function Profile() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const profile = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => apiRequest<{ profile: ProfileData }>("/profile/me"),
    enabled: Boolean(currentUser.data?.user),
  });
  const updateProfile = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiRequest<{ profile: ProfileData }>("/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
    };
    if (profile.data?.profile.user.role === "farmer") {
      body.farmName = formData.get("farmName");
      body.description = formData.get("description");
      body.city = formData.get("city");
      body.region = formData.get("region");
      body.shareEmail = formData.get("shareEmail") === "on";
      body.sharePhone = formData.get("sharePhone") === "on";
    }
    if (profile.data?.profile.user.role === "business") {
      body.businessName = formData.get("businessName");
      body.businessType = formData.get("businessType");
      body.description = formData.get("description");
      body.city = formData.get("city");
      body.region = formData.get("region");
      body.publicEmail = formData.get("publicEmail");
      body.publicPhone = formData.get("publicPhone");
      body.websiteUrl = formData.get("websiteUrl");
      body.publicationStatus = formData.get("publicationStatus");
    }
    updateProfile.mutate(body);
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/dashboard" className="text-sm font-semibold text-brand">Back to dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold text-ink">Profile and storefront</h1>
        <p className="mt-2 text-ink-muted">Keep your account and public business information up to date.</p>
        {currentUser.isPending && <p className="mt-6 text-ink-muted" role="status">Checking your account...</p>}
        {currentUser.isError && <p role="alert" className="mt-6 text-danger">{currentUser.error.message} <Link to="/sign-in" className="font-semibold underline">Sign in</Link></p>}
        {currentUser.data && profile.isPending && <p className="mt-6 text-ink-muted" role="status">Loading your profile...</p>}
        {profile.isError && <div role="alert" className="mt-6 rounded-lg bg-danger/10 p-4 text-danger">{profile.error.message}</div>}

        {profile.data?.profile && (
          <form key={profile.data.profile.user.full_name + profile.data.profile.businessProfile?.publication_status} onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-line bg-white p-6 sm:p-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-ink">Account information</h2>
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-ink">Full name</label>
                <input id="fullName" name="fullName" required minLength={2} maxLength={120} defaultValue={profile.data.profile.user.full_name} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink">Email</label>
                <input id="email" value={profile.data.profile.user.email} readOnly className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink-muted" />
                <p className="mt-1 text-xs text-ink-muted">Contact support to change your sign-in email.</p>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-ink">Phone number</label>
                <input id="phone" name="phone" type="tel" minLength={7} maxLength={20} defaultValue={profile.data.profile.user.phone ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
              </div>
            </section>

            {profile.data.profile.farmerProfile && (
              <section className="space-y-4 border-t border-line pt-6">
                <h2 className="text-lg font-semibold text-ink">Farm profile</h2>
                <div>
                  <label htmlFor="farmName" className="block text-sm font-semibold text-ink">Farm name</label>
                  <input id="farmName" name="farmName" required minLength={2} maxLength={120} defaultValue={profile.data.profile.farmerProfile.farm_name} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <ProfileLocationFields city={profile.data.profile.farmerProfile.city} region={profile.data.profile.farmerProfile.region} description={profile.data.profile.farmerProfile.description} />
                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-ink">Public seller contact</legend>
                  <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="shareEmail" defaultChecked={profile.data.profile.farmerProfile.public_contact_preferences.email} /> Show my email on listings</label>
                  <label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="sharePhone" defaultChecked={profile.data.profile.farmerProfile.public_contact_preferences.phone} /> Show my phone on listings</label>
                </fieldset>
              </section>
            )}

            {profile.data.profile.businessProfile && (
              <section className="space-y-4 border-t border-line pt-6">
                <h2 className="text-lg font-semibold text-ink">Storefront details</h2>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-ink">Business name</label>
                  <input id="businessName" name="businessName" required minLength={2} maxLength={120} defaultValue={profile.data.profile.businessProfile.business_name} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-semibold text-ink">Business type</label>
                  <input id="businessType" name="businessType" maxLength={100} defaultValue={profile.data.profile.businessProfile.business_type ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <ProfileLocationFields city={profile.data.profile.businessProfile.city} region={profile.data.profile.businessProfile.region} description={profile.data.profile.businessProfile.description} />
                <div>
                  <label htmlFor="publicEmail" className="block text-sm font-semibold text-ink">Public email</label>
                  <input id="publicEmail" name="publicEmail" type="email" maxLength={254} defaultValue={profile.data.profile.businessProfile.public_email ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <div>
                  <label htmlFor="publicPhone" className="block text-sm font-semibold text-ink">Public phone</label>
                  <input id="publicPhone" name="publicPhone" type="tel" minLength={7} maxLength={20} defaultValue={profile.data.profile.businessProfile.public_phone ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-semibold text-ink">Website URL</label>
                  <input id="websiteUrl" name="websiteUrl" type="url" maxLength={500} defaultValue={profile.data.profile.businessProfile.website_url ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
                </div>
                <div>
                  <label htmlFor="publicationStatus" className="block text-sm font-semibold text-ink">Storefront page visibility</label>
                  <select id="publicationStatus" name="publicationStatus" defaultValue={profile.data.profile.businessProfile.publication_status} className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3">
                    <option value="draft">Private draft</option>
                    <option value="published">Published</option>
                  </select>
                  <p className="mt-1 text-xs text-ink-muted">This controls the public storefront page; individual published listings remain visible in the marketplace.</p>
                </div>
                {profile.data.profile.businessProfile.publication_status === "published" && (
                  <p className="text-sm text-ink-muted">Storefront slug: <code>/storefront/{profile.data.profile.businessProfile.slug}</code></p>
                )}
              </section>
            )}

            {updateProfile.isError && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{updateProfile.error.message}</p>}
            {updateProfile.isSuccess && <p role="status" className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">Your profile was saved.</p>}
            <button type="submit" disabled={updateProfile.isPending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60">
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function ProfileLocationFields({
  city,
  region,
  description,
}: {
  city: string | null;
  region: string | null;
  description: string | null;
}) {
  return (
    <>
      <div>
        <label htmlFor="city" className="block text-sm font-semibold text-ink">City</label>
        <input id="city" name="city" maxLength={100} defaultValue={city ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
      </div>
      <div>
        <label htmlFor="region" className="block text-sm font-semibold text-ink">State or region</label>
        <input id="region" name="region" maxLength={100} defaultValue={region ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink">Description</label>
        <textarea id="description" name="description" rows={4} maxLength={4000} defaultValue={description ?? ""} className="mt-2 w-full rounded-lg border border-line px-4 py-3" />
      </div>
    </>
  );
}
