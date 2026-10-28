import type { Request, Response } from "express";
import { z } from "zod";
import { sendFail, sendOk } from "../lib/http";
import { logger } from "../lib/logger";
import { getGalleryImages } from "../services/gallery.service";

const querySchema = z.object({
  category: z.enum(["FOOD", "DRINKS", "AMBIENCE", "KITCHEN"]).optional(),
});

export async function handleGetGallery(req: Request, res: Response) {
  const raw = (req.query.category as string | undefined)?.toUpperCase();
  const parsed = querySchema.safeParse({ category: raw || undefined });
  if (!parsed.success) {
    return sendFail(res, 400, "invalid_category", "Unknown gallery category.");
  }

  try {
    const images = await getGalleryImages(parsed.data.category);
    return sendOk(res, images, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" });
  } catch (err) {
    logger.error("api_gallery_failed", err);
    return sendFail(res, 500, "server_error", "Could not load the gallery.");
  }
}

