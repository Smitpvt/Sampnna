import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { burstLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/http";
import { searchDishes } from "@/services/menu";

const query = z.object({ q: z.string().trim().min(2, "Search needs at least 2 characters.").max(60) });

/** GET /api/menu/search?q= — dishes whose name or description match. */
export async function GET(req: NextRequest) {
  const parsed = query.safeParse({ q: req.nextUrl.searchParams.get("q") ?? "" });
  if (!parsed.success) return fail(400, "invalid_query", parsed.error.issues[0].message);

  if (!burstLimit(`search:${hashIp(clientIp(req))}`, 60, 60_000).allowed) {
    return fail(429, "rate_limited", "Too many searches. Please slow down.");
  }
  try {
    return ok(await searchDishes(parsed.data.q), { cache: "public, s-maxage=60" });
  } catch (err) {
    logger.error("api_search_failed", err);
    return fail(500, "server_error", "Search is unavailable right now.");
  }
}
