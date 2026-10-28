import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { GoogleSummary, ReviewDTO } from "@/types/content";

/**
 * Verified Google rating and reviews via the official Places API (New),
 * server-side only. Returns null unless GOOGLE_PLACES_API_KEY and
 * GOOGLE_PLACE_ID are configured — the UI then hides Google content entirely.
 * Cached for 24 h to respect quotas.
 */
export async function getGoogleSummary(): Promise<GoogleSummary | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) {
      logger.warn("google_places_failed", { status: res.status });
      return null;
    }
    const body = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: {
        name: string;
        rating?: number;
        publishTime?: string;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: { displayName?: string; uri?: string };
      }[];
    };
    if (typeof body.rating !== "number" || typeof body.userRatingCount !== "number") return null;

    return {
      rating: body.rating,
      reviewCount: body.userRatingCount,
      mapsUrl: body.googleMapsUri ?? null,
      reviews: (body.reviews ?? [])
        .filter((r) => r.text?.text || r.originalText?.text)
        .map((r) => ({
          id: r.name,
          authorName: r.authorAttribution?.displayName ?? "Google user",
          authorUrl: r.authorAttribution?.uri ?? null,
          rating: r.rating ?? null,
          text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
          date: r.publishTime ?? null,
          source: "GOOGLE" as const,
          sourceUrl: body.googleMapsUri ?? null,
        })),
    };
  } catch (err) {
    logger.error("google_places_error", err);
    return null;
  }
}

/** Published testimonials from the database, separated by source. */
export async function getPublishedTestimonials(): Promise<ReviewDTO[]> {
  const rows = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ reviewDate: "desc" }, { createdAt: "desc" }],
    take: 12,
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    text: r.reviewText,
    date: r.reviewDate?.toISOString() ?? null,
    // A row only counts as a Google review if it is marked verified and sourced.
    source: r.source === "GOOGLE" && r.isVerified ? "GOOGLE" : "ADMIN",
    sourceUrl: r.sourceUrl,
  }));
}
