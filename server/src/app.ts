import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import apiRouter from "./routes";

export function createApp() {
  const app = express();

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
        .map((o) => o.trim())
        .filter((o) => o.length > 0 && o !== "*")
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (such as server-to-server, health-check probes, or curl)
        if (!origin) {
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        // Disallowed origin: deny by omitting CORS response headers
        return callback(null, false);
      },
      credentials: true,
    }),
  );

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use(express.json({ limit: "16kb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Sampann API is healthy" });
  });

  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
}

