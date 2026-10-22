import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";

type AuthMode = "sign-up" | "sign-in";

const copy: Record<AuthMode, { title: string; subtitle: string; submit: string; switchText: string; switchTo: string; switchLabel: string }> = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Join BizzLeap SME to list your products or services and reach buyers.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchTo: "/sign-in",
    switchLabel: "Sign in",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to manage your storefront, listings, and messages.",
    submit: "Sign in",
    switchText: "New to BizzLeap SME?",
    switchTo: "/sign-up",
    switchLabel: "Create an account",
  },
};

export function Auth({ mode }: { mode: AuthMode }) {
  const text = copy[mode];
  const isSignUp = mode === "sign-up";

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="relative overflow-hidden bg-gradient-to-br from-warm-cream via-white to-brand/10">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-card">
              BizzLeap SME
            </p>
            <h1 className="mt-6 text-3xl font-bold text-ink sm:text-4xl">{text.title}</h1>
            <p className="mt-4 text-base text-ink-muted">{text.subtitle}</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              {isSignUp && (
                <div>
                  <label htmlFor="full-name" className="block text-sm font-semibold text-ink">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-ink">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
                />
              </div>

              <button
                type="submit"
                disabled
                className="w-full rounded-xl bg-brand px-6 py-3.5 font-semibold text-white opacity-60"
              >
                {text.submit}
              </button>
              <p className="text-center text-sm text-ink-muted">
                Account services are not connected yet, so this form cannot be submitted.
              </p>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              {text.switchText}{" "}
              <Link to={text.switchTo} className="font-semibold text-brand hover:text-brand-dark">
                {text.switchLabel}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
