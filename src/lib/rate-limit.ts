import "server-only";

/**
 * Two-layer rate limiting for public forms:
 *  1. In-memory sliding window — cheap burst protection per warm instance.
 *  2. Database count of recent submissions by hashed IP — durable across
 *     serverless instances (see services/*.ts), no extra infrastructure.
 */
const buckets = new Map<string, number[]>();

export function burstLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { allowed: true, retryAfter: 0 };
}

/** Forms submitted faster than a person could type are treated as bots. */
export const MIN_FILL_MS = 2500;
