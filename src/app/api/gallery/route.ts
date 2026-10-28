import type { NextRequest } from "next/server";
import { z } from "zod";
import { PUBLIC_CACHE, fail, ok } from "@/lib/http";
import { logger } from "@/lib/logger";
import { getGalleryImages } from "@/services/gallery";

const query = z.object({ category: z.enum(["FOOD", "DRINKS", "AMBIENCE", "KITCHEN"]).optional() });

/** GET /api/gallery?category= — published gallery images. */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("category")?.toUpperCase();
  const parsed = query.safeParse({ category: raw || undefined });
  if (!parsed.success) return fail(400, "invalid_category", "Unknown gallery category.");
  try {
    return ok(await getGalleryImages(parsed.data.category), { cache: PUBLIC_CACHE });
  } catch (err) {
    logger.error("api_gallery_failed", err);
    return fail(500, "server_error", "Could not load the gallery.");
  }
}
