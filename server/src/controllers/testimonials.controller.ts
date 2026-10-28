import type { Request, Response } from "express";
import { sendFail, sendOk } from "../lib/http";
import { logger } from "../lib/logger";
import { getGoogleSummary, getPublishedTestimonials } from "../services/reviews.service";

export async function handleGetTestimonials(_req: Request, res: Response) {
  try {
    const [google, testimonials] = await Promise.all([getGoogleSummary(), getPublishedTestimonials()]);
    return sendOk(
      res,
      { google, testimonials },
      200,
      { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    );
  } catch (err) {
    logger.error("api_testimonials_failed", err);
    return sendFail(res, 500, "server_error", "Could not load reviews.");
  }
}

