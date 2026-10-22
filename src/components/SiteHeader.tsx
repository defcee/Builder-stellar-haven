import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.svg" alt="" width={36} height={36} />
          <span className="text-lg font-bold text-brand-dark">BizzLeap SME</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/marketplace" className="text-ink hover:text-brand">
            Marketplace
          </Link>
        </nav>
      </div>
    </header>
  );
}
