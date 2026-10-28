import { createHash } from "node:crypto";
import type { Request, Response } from "express";
import type { FieldErrors } from "./validation";

export type ApiError = { code: string; message: string; fields?: FieldErrors };
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export function sendOk<T>(res: Response, data: T, status = 200, headers?: Record<string, string>) {
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
  }
  return res.status(status).json({ ok: true, data });
}

export function sendFail(
  res: Response,
  status: number,
  code: string,
  message: string,
  fields?: FieldErrors,
  headers?: Record<string, string>,
) {
  res.setHeader("Cache-Control", "no-store");
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
  }
  return res.status(status).json({
    ok: false,
    error: { code, message, ...(fields ? { fields } : {}) },
  });
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return (req.headers["x-real-ip"] as string) || req.socket.remoteAddress || "unknown";
}

/** Salted hash so rate limiting works without storing raw IPs. */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "sampann";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

