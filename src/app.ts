import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { handleAllowedOrigins } from "./middleware/allowed-origins.middleware";
import { limiter } from "./middleware/api-limiter.middleware";
import notFound from "./middleware/not-found.middleware";
import apiRouter from "./routes";
import { errorMiddleware } from "./utils/handler/error-handler";

export const createApp = () => {
  const app = express();

  app.use(limiter);
  app.set("trust proxy", true);
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(
    cors({
      origin: handleAllowedOrigins,
      credentials: true,
    }),
  );

  app.get("/", (_req, res) => {
    res.send("Hello from the server!");
  });
  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorMiddleware);

  return app;
};
