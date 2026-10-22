const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { Accept: "application/json", ...init.headers },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(0, "We could not reach BizzLeap. Check your connection and try again.");
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !body?.success) {
    throw new ApiError(response.status, body?.message ?? "Something went wrong. Please try again.");
  }

  return body.data as T;
}
