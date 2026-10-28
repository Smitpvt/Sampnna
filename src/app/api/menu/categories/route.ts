import { PUBLIC_CACHE, fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { listCategories } from "@/services/menu";

export const revalidate = 300;

/** GET /api/menu/categories — active menu categories with dish counts. */
export async function GET() {
  try {
    return ok(await listCategories(), { cache: PUBLIC_CACHE });
  } catch (err) {
    logger.error("api_categories_failed", err);
    return fail(500, "server_error", "Could not load the menu.");
  }
}
