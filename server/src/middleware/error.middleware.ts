import type { NextFunction, Request, Response } from "express";
import { sendFail } from "../lib/http";
import { logger } from "../lib/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error("unhandled_server_error", err);
  return sendFail(res, 500, "internal_error", "An unexpected server error occurred.");
}

