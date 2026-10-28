import { PUBLIC_CACHE, fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { getGoogleSummary, getPublishedTestimonials } from "@/services/reviews";

export const revalidate = 300;

/**
 * GET /api/testimonials — verified Google reviews (when configured) and
 * published testimonials, kept in separate lists so they can't be confused.
 */
export async function GET() {
  try {
    const [google, testimonials] = await Promise.all([getGoogleSummary(), getPublishedTestimonials()]);
    return ok({ google, testimonials }, { cache: PUBLIC_CACHE });
  } catch (err) {
    logger.error("api_testimonials_failed", err);
    return fail(500, "server_error", "Could not load reviews.");
  }
}
