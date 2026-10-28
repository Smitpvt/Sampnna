export const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };

/**
 * Helper to fetch typed data from the backend API service.
 * Returns null if the backend is unreachable or returns an error response.
 */
export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    const body = (await res.json()) as ApiResponse<T>;
    if (body && body.ok) return body.data;
    return null;
  } catch {
    return null;
  }
}

