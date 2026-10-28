import { PUBLIC_CACHE, fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { getFeaturedDishes } from "@/services/menu";

export const revalidate = 300;

/** GET /api/menu/featured — dishes marked as featured. */
export async function GET() {
  try {
    return ok(await getFeaturedDishes(), { cache: PUBLIC_CACHE });
  } catch (err) {
    logger.error("api_featured_failed", err);
    return fail(500, "server_error", "Could not load featured dishes.");
  }
}
