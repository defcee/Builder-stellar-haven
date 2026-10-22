import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";

interface ReadinessData {
  database: string;
}

const highlights = [
  {
    title: "Browse local products",
    description: "Explore fresh produce and goods published by farmers and small businesses.",
  },
  {
    title: "Find services",
    description: "Discover service providers and see what they offer, where they operate, and how to reach them.",
  },
  {
    title: "Contact sellers directly",
    description: "Call or email a seller from their listing without creating an account.",
  },
];

export function Home() {
  const readiness = useQuery({
    queryKey: ["health", "ready"],
    queryFn: () => apiRequest<ReadinessData>("/health/ready"),
    retry: 1,
  });

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-warm-cream via-white to-brand/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-90 md:bg-right-top"
          style={{ backgroundImage: "url(/assets/hero-background.png)" }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-card">
            Your business. Your storefront. Your next opportunity.
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-6xl">
            Fresh opportunities for <span className="text-brand">farmers</span> and{" "}
            <span className="text-warm-clay">small businesses</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-ink-muted sm:text-lg">
            Discover products and services from local sellers, and reach them directly to start a conversation.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
            >
              Get started for free
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center rounded-xl border border-brand bg-white px-7 py-3.5 text-base font-semibold text-brand-dark shadow-card transition hover:bg-brand/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
            >
              Visit the marketplace
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="highlights-heading" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="highlights-heading" className="text-2xl font-bold text-ink sm:text-3xl">
          Everything you need to get started
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <li key={item.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <span aria-hidden="true" className="block h-1.5 w-12 rounded-full bg-warm-sun" />
              <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>BizzLeap SME</p>
          <p className={readiness.isSuccess ? "text-success" : readiness.isError ? "text-danger" : ""}>
            {readiness.isPending && "Checking service status..."}
            {readiness.isSuccess && "Service is online."}
            {readiness.isError && `${readiness.error.message}`}
          </p>
        </div>
      </footer>
    </div>
  );
}
