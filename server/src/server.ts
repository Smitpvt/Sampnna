import dotenv from "dotenv";
import { createApp } from "./app";
import { logger } from "./lib/logger";

dotenv.config();

const app = createApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  logger.info("server_started", { port: PORT, env: process.env.NODE_ENV || "development" });
  console.log(`> Sampanna API server listening on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  logger.info("sigterm_received");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("sigint_received");
  server.close(() => {
    process.exit(0);
  });
});

