import "server-only";
import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { FieldErrors } from "@/lib/validation";

export type ApiError = { code: string; message: string; fields?: FieldErrors };
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export function ok<T>(data: T, init?: ResponseInit & { cache?: string }) {
  const headers = new Headers(init?.headers);
  if (init?.cache) headers.set("Cache-Control", init.cache);
  return NextResponse.json<ApiResponse<T>>({ ok: true, data }, { ...init, headers });
}

export function fail(status: number, code: string, message: string, fields?: FieldErrors, headers?: HeadersInit) {
  return NextResponse.json<ApiResponse<never>>(
    { ok: false, error: { code, message, ...(fields ? { fields } : {}) } },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

/** Public cache policy for read-only content endpoints. */
export const PUBLIC_CACHE = "public, s-maxage=300, stale-while-revalidate=3600";

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Salted hash so rate limiting works without storing raw IPs. */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "sampann";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Same-origin guard for form POSTs (no CORS: the site and API share an
 * origin). Rejects cross-site submissions that carry a foreign Origin.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still validated & rate limited
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

/** Parse JSON bodies defensively, with a size cap. */
export async function readJson(req: NextRequest, maxBytes = 16_384): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > maxBytes) throw new Error("payload_too_large");
  return JSON.parse(raw);
}
