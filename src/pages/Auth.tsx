import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";

type AuthMode = "sign-up" | "sign-in";
type AccountRole = "farmer" | "business" | "buyer";

const accountRoles: { value: AccountRole; label: string; detail: string }[] = [
  { value: "farmer", label: "Farmer", detail: "Sell a harvest or farm service" },
  { value: "business", label: "Small business", detail: "Build a storefront and sell" },
  { value: "buyer", label: "Buyer", detail: "Discover local products" },
];

export function Auth({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === "sign-up";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [role, setRole] = useState<AccountRole>("buyer");
  const [shareContact, setShareContact] = useState(false);
  const [formError, setFormError] = useState("");
  const authentication = useMutation({
    mutationFn: (formData: FormData) =>
      apiRequest<{ user: { id: string } }>(isSignUp ? "/auth/sign-up" : "/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignUp
            ? {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                password: formData.get("password"),
                phone: formData.get("phone"),
                role,
                countryCode: "NG",
                shareContact,
              }
            : { email: formData.get("email"), password: formData.get("password") },
        ),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/dashboard");
    },
    onError: (error) => setFormError(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    authentication.mutate(new FormData(event.currentTarget));
  }

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl gap-0 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8">
        <section className="relative min-h-[300px] overflow-hidden rounded-xl bg-ink lg:min-h-[680px]">
          <img
            src="/assets/heroimage_slide1.jpeg"
            alt="A farmer tending crops in a thriving green field"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-200">A better way to grow</p>
            <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
              Good things grow when local businesses connect.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
              From the farm gate to the neighborhood shop, find your people on BizzLeap.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl py-8 lg:px-6 lg:py-12">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-dark">BizzLeap community</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            {isSignUp ? "Start with a free account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            {isSignUp ? "Choose how you want to use the marketplace." : "Sign in to pick up where you left off."}
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <fieldset>
                  <legend className="mb-2 block text-sm font-semibold text-ink">I am a</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {accountRoles.map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-lg border p-3 transition ${
                          role === option.value
                            ? "border-brand bg-brand/5 ring-1 ring-brand"
                            : "border-line bg-white hover:border-brand/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => setRole(option.value)}
                          className="sr-only"
                        />
                        <span className="block text-sm font-semibold text-ink">{option.label}</span>
                        <span className="mt-1 hidden text-xs leading-4 text-ink-muted sm:block">{option.detail}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="full-name" className="block text-sm font-semibold text-ink">
                    {role === "business" ? "Your name or business name" : "Full name"}
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={120}
                    required
                    className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-ink">Phone number <span className="font-normal text-ink-muted">(optional)</span></label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  minLength={7}
                  maxLength={20}
                  className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
              </div>
            )}

            {isSignUp && role !== "buyer" && (
              <label className="flex items-start gap-3 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={shareContact}
                  onChange={(event) => setShareContact(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand"
                />
                <span>Show my email and phone on my public listings</span>
              </label>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={isSignUp ? 10 : 1}
                maxLength={128}
                pattern={isSignUp ? "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,128}" : undefined}
                title={isSignUp ? "Use at least 10 characters, including an uppercase letter, a lowercase letter, and a number." : undefined}
                required
                className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
              />
              {isSignUp && <p className="mt-2 text-xs text-ink-muted">At least 10 characters, with upper- and lowercase letters and a number.</p>}
            </div>

            {formError && <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p>}

            <button
              type="submit"
              disabled={authentication.isPending}
              className="w-full rounded-lg bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
            >
              {authentication.isPending ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            {isSignUp ? "Already have an account?" : "New to BizzLeap?"}{" "}
            <Link to={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-brand hover:text-brand-dark">
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}