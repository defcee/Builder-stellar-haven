import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./api";

export interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  role: "farmer" | "business" | "buyer" | "admin";
  country_code: string;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiRequest<{ user: CurrentUser }>("/auth/me"),
    retry: false,
    staleTime: 60_000,
  });
}