import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/token.js";
import User from "../modules/user/user.model.js";
import { ApiError } from "../utils/handler/api-response.js";

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.cookies.accessToken;

  if (!authHeader) {
    throw ApiError.unauthorized("No Token Provided");
  }

  const token = authHeader;
  const payload = await verifyToken(token as string);

  if (!payload || !payload.userId) {
    throw ApiError.unauthorized("Unauthorized");
  }

  const user = await User.findById({ _id: payload.userId })
    .select("+passwordVersion")
    .populate("department");

  if (
    !user ||
    !user.isActive ||
    !user.isVerified ||
    user.passwordVersion !== payload.passwordVersion ||
    user.jwtVersion !== payload.jwtVersion
  ) {
    throw ApiError.unauthorized("Session expired, please login again");
  }

  const userPayload = {
    id: user.id as string,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
  };

  req.user = userPayload;
  next();
};

export { isAuth };
