import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";

interface ReadinessData {
  database: string;
}

export function Home() {
  const readiness = useQuery({
    queryKey: ["health", "ready"],
    queryFn: () => apiRequest<ReadinessData>("/health/ready"),
    retry: 1,
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <img src="/assets/logo.svg" alt="" width={36} height={36} />
          <span className="text-lg font-bold text-brand-dark">BizzLeap SME</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Your business. Your storefront. Your next opportunity.</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-ink sm:text-5xl">
          Take Your Business Further with BizzLeap.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
          Create your digital storefront, showcase what you offer, and connect with customers beyond your immediate community.
        </p>

        <section aria-labelledby="status-heading" className="mt-10 max-w-md rounded-2xl bg-white p-5 shadow-card">
          <h2 id="status-heading" className="text-sm font-semibold text-ink">
            Platform status
          </h2>
          {readiness.isPending && <p className="mt-2 text-sm text-ink-muted">Checking connection...</p>}
          {readiness.isSuccess && <p className="mt-2 text-sm font-medium text-success">API and database are connected.</p>}
          {readiness.isError && (
            <div className="mt-2 text-sm">
              <p className="font-medium text-danger">{readiness.error.message}</p>
              <button
                type="button"
                onClick={() => readiness.refetch()}
                className="mt-3 rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
              >
                Try again
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
