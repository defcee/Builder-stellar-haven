import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
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
