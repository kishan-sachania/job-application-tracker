import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../../../utils/api-response.js";
import { CustomError } from "../../../error-formates/error-formates.js";
import { verifyAccessToken } from "../services/auth.service.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    sub?: string;
    email?: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Authorization header with Bearer token is required", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new CustomError("Access token is required", 401);
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtErr) {
      throw new CustomError("Invalid or expired access token", 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};
