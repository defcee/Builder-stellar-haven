import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { SiteHeader } from "../components/SiteHeader";
import { apiRequest } from "../lib/api";

interface ReadinessData {
  database: string;
}

const heroSlides = [
  {
    image: "/assets/heroimage_slide1.png",
    eyebrow: "For farmers",
    title: "Sell your harvest to buyers nearby",
    body: "List produce and farm services, describe your farm, set prices in naira, and show what is in stock. Buyers can find you in the marketplace and reach you by phone or email.",
  },
  {
    image: "/assets/heroimage_slide2.png",
    eyebrow: "For small businesses",
    title: "Build a storefront customers can trust",
    body: "Create a business profile with your logo, location, opening hours and contact details. Publish your products and services, and manage the listings that buyers see.",
  },
  {
    image: "/assets/heroimage_slide3.png",
    eyebrow: "For buyers",
    title: "Find what you need and contact the seller",
    body: "Browse listings without signing in, search by keyword, and compare prices in naira. Call or email a seller directly, and create an account to save favourites.",
  },
  {
    image: "/assets/heroimage_slide4.png",
    eyebrow: "One marketplace",
    title: "Farmers, businesses and buyers in one place",
    body: "Farmers and small businesses publish products and services, buyers discover and contact them, and administrators review listings and reports to keep the marketplace trustworthy.",
  },
];

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

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-warm-cream via-white to-brand/10">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            aria-hidden="true"
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40"
        />
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24" aria-live="polite">
          <p className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-card">
            {heroSlides[activeSlide].eyebrow}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-6xl">
            {heroSlides[activeSlide].title}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-ink-muted sm:text-lg">
            {heroSlides[activeSlide].body}
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
              <ImagePlaceholder label={item.title} className="h-40 rounded-xl" />
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
