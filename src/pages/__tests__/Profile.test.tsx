// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../components/SiteHeader", () => ({ SiteHeader: () => null }));
vi.mock("../../lib/api", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "../../lib/api";
import { Profile } from "../Profile";

const profile = {
  user: {
    full_name: "Amina Farmer",
    email: "amina@example.com",
    phone: "08012345678",
    role: "farmer",
  },
  farmerProfile: {
    farm_name: "Amina Farm",
    description: "Fresh local produce",
    city: "Enugu",
    region: "Enugu",
    public_contact_preferences: { email: true, phone: false },
  },
  businessProfile: null,
};

beforeEach(() => {
  vi.mocked(apiRequest).mockReset();
  vi.mocked(apiRequest).mockImplementation(async (path, init) => {
    if (path === "/auth/me") {
      return {
        user: {
          id: "user-1",
          full_name: "Amina Farmer",
          email: "amina@example.com",
          role: "farmer",
          country_code: "NG",
        },
      } as never;
    }

    if (path === "/profile/me" && init?.method !== "PATCH") {
      return { profile } as never;
    }

    if (path === "/profile/me" && init?.method === "PATCH") {
      throw new Error("Profile could not be saved");
    }

    throw new Error(`Unexpected API request: ${path}`);
  });
});

afterEach(() => {
  cleanup();
});

function renderProfile() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/profile"]}>
        <Profile />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Profile page", () => {
  it("submits edited account and farm details and displays the save error", async () => {
    const user = userEvent.setup();
    renderProfile();

    const fullName = await screen.findByLabelText("Full name");
    await user.clear(fullName);
    await user.type(fullName, "Amina Okafor");
    await user.clear(screen.getByLabelText("Farm name"));
    await user.type(screen.getByLabelText("Farm name"), "Green Valley Farm");
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(apiRequest).toHaveBeenCalledWith(
      "/profile/me",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          fullName: "Amina Okafor",
          phone: "08012345678",
          farmName: "Green Valley Farm",
          description: "Fresh local produce",
          city: "Enugu",
          region: "Enugu",
          shareEmail: true,
          sharePhone: false,
        }),
      }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Profile could not be saved",
    );
  });
});
