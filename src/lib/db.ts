import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * One PrismaClient per server instance. In development, reuse across hot
 * reloads; in serverless production each warm instance keeps one client and
 * Supabase's transaction pooler (DATABASE_URL, port 6543) fans connections in.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
