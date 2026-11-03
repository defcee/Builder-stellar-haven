import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { NotificationCenter } from "./NotificationCenter";
import { apiRequest } from "../lib/api";
import { useCurrentUser } from "../lib/auth";

export function SiteHeader() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const signOut = useMutation({
    mutationFn: () => apiRequest<null>("/auth/sign-out", { method: "POST" }),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg" aria-hidden="true">
            <img src="/assets/logo.png" alt="" className="absolute left-[-31px] top-[-18px] max-w-none" width={110} height={110} />
          </span>
          <span className="text-xl font-bold text-brand-dark">BizzLeap</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/marketplace" className="text-ink hover:text-brand">
            Marketplace
          </Link>
          {currentUser.data?.user ? (
            <>
              <NotificationCenter />
              <Link to="/messages" className="text-ink hover:text-brand">Messages</Link>
              <Link to="/profile" className="text-ink hover:text-brand">Profile</Link>
              <Link to="/dashboard" className="text-ink hover:text-brand">
                Dashboard
              </Link>
              <button
                type="button"
                disabled={signOut.isPending}
                onClick={() => signOut.mutate()}
                className="text-ink-muted hover:text-brand disabled:opacity-60"
              >
                {signOut.isPending ? "Signing out..." : "Sign out"}
              </button>
              {signOut.isError && <span role="alert" className="text-xs font-normal text-danger">{signOut.error.message}</span>}
            </>
          ) : currentUser.isPending ? (
            <span className="text-ink-muted" role="status">Loading account...</span>
          ) : (
            <>
              <Link to="/sign-in" className="text-ink hover:text-brand">
                Sign in
              </Link>
              <Link to="/sign-up" className="rounded-lg bg-brand px-3 py-2 text-white hover:bg-brand-dark">
                Join BizzLeap
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
