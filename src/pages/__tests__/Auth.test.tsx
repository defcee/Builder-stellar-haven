// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../components/SiteHeader", () => ({ SiteHeader: () => null }));
vi.mock("../../lib/api", () => ({ apiRequest: vi.fn() }));

import { Auth } from "../Auth";
import { apiRequest } from "../../lib/api";

function CurrentPath() {
  const { pathname } = useLocation();
  return <output data-testid="path">{pathname}</output>;
}

function renderAuth(mode: "sign-up" | "sign-in") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[mode === "sign-up" ? "/sign-up" : "/sign-in"]}
      >
        <Auth mode={mode} />
        <CurrentPath />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.mocked(apiRequest).mockReset();
});

afterEach(() => {
  cleanup();
});

describe("Auth page", () => {
  it("submits registration fields and navigates to the dashboard", async () => {
    const user = userEvent.setup();
    vi.mocked(apiRequest).mockResolvedValue({ user: { id: "user-1" } });
    renderAuth("sign-up");

    await user.type(screen.getByLabelText("Full name"), "Amina Farmer");
    await user.type(
      screen.getByLabelText("Email address"),
      "amina@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "StrongPassword42");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/sign-up",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          fullName: "Amina Farmer",
          email: "amina@example.com",
          password: "StrongPassword42",
          phone: "",
          role: "buyer",
          countryCode: "NG",
          shareContact: false,
        }),
      }),
    );
    expect(await screen.findByTestId("path")).toHaveTextContent("/dashboard");
  });

  it("renders a sign-in request error", async () => {
    const user = userEvent.setup();
    vi.mocked(apiRequest).mockRejectedValue(
      new Error("Email or password is incorrect"),
    );
    renderAuth("sign-in");

    await user.type(
      screen.getByLabelText("Email address"),
      "amina@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "WrongPassword42");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email or password is incorrect",
    );
  });

  it("prevents submitting a malformed email using native form validation", () => {
    renderAuth("sign-in");
    const email = screen.getByLabelText("Email address");
    fireEvent.change(email, { target: { value: "not-an-email" } });

    expect((email as HTMLInputElement).checkValidity()).toBe(false);
    expect(apiRequest).not.toHaveBeenCalled();
  });
});
