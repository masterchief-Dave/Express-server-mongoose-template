/* eslint-disable */
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { env } from "../../config/env.config";
import { logger } from "../logger.utils";

const excludedCodes = [405];
export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (env.NODE_ENV !== "production") {
    if (err instanceof Error) {
      const apiErr = err as any;

      logger.fatal(
        excludedCodes.includes(apiErr.statusCode)
          ? err.message
          : err.stack || err.message,
      );
    } else {
      logger.fatal({ err }, "Unknown error type thrown");
    }
  }

  console.log(err);

  if (err instanceof Error && "statusCode" in err) {
    const apiErr = err as any;
    const status_code: number = apiErr.statusCode;
    const message: string = apiErr.message;
    const statusText: string = apiErr.status;

    return void res.status(status_code).json({
      success: false,
      status: statusText,
      status_code,
      message,

      stack: env.NODE_ENV === "production" ? undefined : apiErr.stack,
    });
  }

  const anyErr = err as any;
  // Example: handle Mongo “duplicate key” (11000)
  if (anyErr.code === 11000 && anyErr.keyValue) {
    const status_code = 409;
    let message =
      env.NODE_ENV === "production" ? "Conflict" : "Duplicate key error";
    if (anyErr.keyValue.email) {
      message = "User with this email already exists";
    }
    return void res.status(status_code).json({
      success: false,
      status: "Conflict",
      status_code,
      message,
      stack: env.NODE_ENV === "production" ? undefined : anyErr.stack,
    });
  }

  // Fallback to generic 500
  const fallbackMessage =
    (err instanceof Error && err.message) || "Internal Server Error";
  return void res.status(500).json({
    success: false,
    status: "Error",
    status_code: 500,
    message: fallbackMessage,
    stack: env.NODE_ENV === "production" ? undefined : (err as any).stack,
  });
};
