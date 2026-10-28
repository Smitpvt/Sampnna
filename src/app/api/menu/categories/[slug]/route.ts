import { PUBLIC_CACHE, fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { getCategoryBySlug } from "@/services/menu";

/** GET /api/menu/categories/:slug — one category with its available dishes. */
export async function GET(_req: Request, ctx: RouteContext<"/api/menu/categories/[slug]">) {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return fail(400, "invalid_slug", "Invalid category.");
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return fail(404, "not_found", "Category not found.");
    return ok(category, { cache: PUBLIC_CACHE });
  } catch (err) {
    logger.error("api_category_failed", err);
    return fail(500, "server_error", "Could not load this category.");
  }
}
