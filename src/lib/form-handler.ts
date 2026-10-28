import "server-only";
import type { NextRequest } from "next/server";
import type { z } from "zod";
import { clientIp, fail, hashIp, isSameOrigin, ok, readJson } from "@/lib/http";
import { logger } from "@/lib/logger";
import { MIN_FILL_MS, burstLimit } from "@/lib/rate-limit";
import { fieldErrors } from "@/lib/validation";
import { recentSubmissionCount } from "@/services/submissions";

type Kind = "reservation" | "contact";

/**
 * Shared pipeline for public form submissions:
 * origin check → burst limit → parse → honeypot/timing → validate → durable limit → save.
 */
export async function handleFormPost<S extends z.ZodType, R extends { id: string }>(
  req: NextRequest,
  kind: Kind,
  schema: S,
  save: (data: z.infer<S>, ipHash: string) => Promise<R>,
) {
  if (!isSameOrigin(req)) return fail(403, "forbidden_origin", "This form can only be submitted from the Sampann website.");

  const ipHash = hashIp(clientIp(req));
  const burst = burstLimit(`${kind}:${ipHash}`, 6, 60_000);
  if (!burst.allowed) {
    return fail(429, "rate_limited", "Too many attempts. Please wait a minute and try again.", undefined, {
      "Retry-After": String(burst.retryAfter),
    });
  }

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return fail(400, "invalid_body", "We couldn't read that request. Please try again.");
  }

  // Bots: honeypot filled, or submitted impossibly fast. Respond as if
  // accepted so they learn nothing, but store nothing.
  const probe = body as { website?: unknown; startedAt?: unknown };
  if ((typeof probe?.website === "string" && probe.website.length > 0) || Date.now() - Number(probe?.startedAt) < MIN_FILL_MS) {
    logger.warn(`${kind}_spam_blocked`);
    return ok({ id: "received", status: "PENDING" }, { status: 202 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "validation_failed", "Please check the highlighted fields.", fieldErrors(parsed.error));
  }

  try {
    const recent = await recentSubmissionCount(kind, ipHash);
    if (recent.limited) {
      return fail(429, "rate_limited", "We've received several requests from you recently. Please call us instead.");
    }
    const result = await save(parsed.data, ipHash);
    logger.info(`${kind}_created`, { id: result.id });
    return ok(result, { status: 201 });
  } catch (err) {
    logger.error(`${kind}_save_failed`, err);
    return fail(500, "server_error", "Something went wrong on our side. Please try again, or call us.");
  }
}
