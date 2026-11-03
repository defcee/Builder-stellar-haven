import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { CreateListing } from "./pages/CreateListing";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ListingDetail } from "./pages/ListingDetail";
import { Marketplace } from "./pages/Marketplace";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { Storefront } from "./pages/Storefront";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:slug" element={<ListingDetail />} />
        <Route path="/storefront/:slug" element={<Storefront />} />
        <Route path="/sign-up" element={<Auth mode="sign-up" />} />
        <Route path="/sign-in" element={<Auth mode="sign-in" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/listings/new" element={<CreateListing />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-6xl px-4 py-24 text-center">
              <h1 className="text-2xl font-bold text-ink">Page not found</h1>
              <a href="/" className="mt-4 inline-block font-semibold text-brand hover:text-brand-dark">
                Back to home
              </a>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
