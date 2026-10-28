import type { FieldErrors } from "@/lib/validation";

type Result<T> = { ok: true; data: T } | { ok: false; message: string; fields?: FieldErrors };

/** Client helper: POST JSON to our API and normalise the structured response. */
export async function postJson<T>(url: string, body: unknown): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (json?.ok) return { ok: true, data: json.data as T };
    return {
      ok: false,
      message: json?.error?.message ?? "Something went wrong. Please try again.",
      fields: json?.error?.fields,
    };
  } catch {
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
  }
}
