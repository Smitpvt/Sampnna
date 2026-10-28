import type { Request, Response } from "express";
import { getClientIp, hashIp, sendFail, sendOk } from "../lib/http";
import { logger } from "../lib/logger";
import { MIN_FILL_MS, burstLimit } from "../lib/rate-limit";
import { contactSchema, fieldErrors } from "../lib/validation";
import { createContactEnquiry, recentSubmissionCount } from "../services/submissions.service";

export async function handleCreateContact(req: Request, res: Response) {
  const ipHash = hashIp(getClientIp(req));
  const burst = burstLimit(`contact:${ipHash}`, 6, 60_000);
  if (!burst.allowed) {
    return sendFail(
      res,
      429,
      "rate_limited",
      "Too many attempts. Please wait a minute and try again.",
      undefined,
      { "Retry-After": String(burst.retryAfter) },
    );
  }

  const probe = req.body as { website?: unknown; startedAt?: unknown };
  if (
    (typeof probe?.website === "string" && probe.website.length > 0) ||
    Date.now() - Number(probe?.startedAt) < MIN_FILL_MS
  ) {
    logger.warn("contact_spam_blocked");
    return sendOk(res, { id: "received", status: "PENDING" }, 202);
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendFail(res, 422, "validation_failed", "Please check the highlighted fields.", fieldErrors(parsed.error));
  }

  try {
    const recent = await recentSubmissionCount("contact", ipHash);
    if (recent.limited) {
      return sendFail(
        res,
        429,
        "rate_limited",
        "We've received several requests from you recently. Please call us instead.",
      );
    }

    const result = await createContactEnquiry(parsed.data, ipHash);
    logger.info("contact_created", { id: result.id });
    return sendOk(res, { id: result.id, status: result.status }, 201);
  } catch (err) {
    logger.error("contact_save_failed", err);
    return sendFail(res, 500, "server_error", "Something went wrong on our side. Please try again, or call us.");
  }
}

