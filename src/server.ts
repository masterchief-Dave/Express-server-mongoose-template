import { createApp } from "./app";
import db from "./config/db";
import http from "http";
import { env } from "./config/env.config";
import { logger } from "./utils/logger.utils";

const main = async () => {
  logger.info("🚀 Starting server...");
  await db();
  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`✅ Server is listening on PORT: ${env.PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  main().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}
