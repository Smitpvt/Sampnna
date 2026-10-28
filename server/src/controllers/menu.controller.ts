import type { Request, Response } from "express";
import { z } from "zod";
import { getClientIp, hashIp, sendFail, sendOk } from "../lib/http";
import { logger } from "../lib/logger";
import { burstLimit } from "../lib/rate-limit";
import {
  getCategoryBySlug,
  getFeaturedDishes,
  getMenu,
  listCategories,
  searchDishes,
} from "../services/menu.service";

const searchQuery = z.object({
  q: z.string().trim().min(2, "Search needs at least 2 characters.").max(60),
});

export async function handleGetMenu(_req: Request, res: Response) {
  try {
    const menu = await getMenu();
    return sendOk(res, menu, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" });
  } catch (err) {
    logger.error("api_menu_failed", err);
    return sendFail(res, 500, "server_error", "Could not load the menu.");
  }
}

export async function handleListCategories(_req: Request, res: Response) {
  try {
    const categories = await listCategories();
    return sendOk(res, categories, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" });
  } catch (err) {
    logger.error("api_categories_failed", err);
    return sendFail(res, 500, "server_error", "Could not load categories.");
  }
}

export async function handleGetCategoryBySlug(req: Request, res: Response) {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug || !/^[a-z0-9-]{1,80}$/.test(slug)) {
    return sendFail(res, 400, "invalid_slug", "Invalid category.");
  }
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return sendFail(res, 404, "not_found", "Category not found.");
    }
    return sendOk(res, category, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" });
  } catch (err) {
    logger.error("api_category_failed", err);
    return sendFail(res, 500, "server_error", "Could not load this category.");
  }
}

export async function handleGetFeaturedDishes(_req: Request, res: Response) {
  try {
    const featured = await getFeaturedDishes();
    return sendOk(res, featured, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" });
  } catch (err) {
    logger.error("api_featured_failed", err);
    return sendFail(res, 500, "server_error", "Could not load featured dishes.");
  }
}

export async function handleSearchDishes(req: Request, res: Response) {
  const parsed = searchQuery.safeParse({ q: req.query.q ?? "" });
  if (!parsed.success) {
    return sendFail(res, 400, "invalid_query", parsed.error.issues[0].message);
  }

  const ipHash = hashIp(getClientIp(req));
  if (!burstLimit(`search:${ipHash}`, 60, 60_000).allowed) {
    return sendFail(res, 429, "rate_limited", "Too many searches. Please slow down.");
  }

  try {
    const results = await searchDishes(parsed.data.q);
    return sendOk(res, results, 200, { "Cache-Control": "public, s-maxage=60" });
  } catch (err) {
    logger.error("api_search_failed", err);
    return sendFail(res, 500, "server_error", "Search is unavailable right now.");
  }
}
