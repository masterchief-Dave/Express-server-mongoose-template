import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { AuthenticatedUser } from "../modules/user/user.interface.js";
import { ApiError } from "../utils/handler/api-response.js";
import { env } from "./env.config.js";

interface CustomJwtPayload extends JWTPayload, AuthenticatedUser {}

interface TokenPayload {
  [key: string]: unknown;
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN_SECONDS = 24 * 60 * 60; // 24 hours

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// jose requires the secret as Uint8Array
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * Generate JWT
 */
export const generateToken = async (payload: TokenPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRES_IN_SECONDS}s`)
    .sign(secretKey);
};

/**
 * Verify JWT
 */
export const verifyToken = async (token: string): Promise<CustomJwtPayload> => {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return payload as CustomJwtPayload;
  } catch (error: any) {
    /**
     * jose throws typed errors with a `code`
     */
    if (error.code === "ERR_JWT_EXPIRED") {
      throw ApiError.unauthorized("Token Expired");
    }

    if (
      error.code === "ERR_JWT_INVALID" ||
      error.code === "ERR_JWT_CLAIM_VALIDATION_FAILED" ||
      error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"
    ) {
      throw ApiError.unauthorized("Invalid Token");
    }

    throw error;
  }
};
