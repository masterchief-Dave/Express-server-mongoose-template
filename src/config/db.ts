import mongoose from "mongoose";
import { env } from "./env.config";
import { logger } from "../utils/logger.utils";

const db = async () => {
  try {
    logger.info("⏳ Connecting to Server database...");
    await mongoose.connect(env.DATABASE_URL, {
      dbName: env.APP_NAME,
    });
    logger.info("✅ Server database connection established successfully");
  } catch (error) {
    logger.error({ error }, "❌ Failed to connect to ERP database:");
    throw error;
  }
};

export default db;
