import { Request, Response } from "express";
import ApiResponse from "../../../../utils/api-response.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByEmailOrUsername,
  hashPassword,
  sanitizeUser,
} from "../services/user.service.js";
import { IUser } from "../../../models/user.model.js";
import { CustomError } from "../../../error-formates/error-formates.js";
import { generateTokens, createAccessToken, verifyRefreshToken } from "../services/auth.service.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateRefreshTokenInput,
} from "../validators/auth.validator.js";

const getCookieValue = (req: Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = validateRegisterInput(req.body);

    const user = await createUser(validatedData as IUser);
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("job_tracker_token", accessToken, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });

    res.cookie("job_tracker_refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, "User registered successfully", 201, {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = validateLoginInput(req.body);

    const user = await getUserByEmailOrUsername(identifier);
    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const hash = hashPassword(password);
    if (user.password !== hash) {
      throw new CustomError("Invalid credentials", 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("job_tracker_token", accessToken, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });

    res.cookie("job_tracker_refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, "User logged in successfully", 200, {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = getCookieValue(req, "job_tracker_refresh_token");
    const bodyToken = req.body?.refreshToken;
    const tokenToVerify = tokenFromCookie || bodyToken;

    const { refreshToken: token } = validateRefreshTokenInput({ refreshToken: tokenToVerify });

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (jwtErr) {
      throw new CustomError("Invalid or expired refresh token", 401);
    }

    const userId = decoded.id || decoded.sub;

    let user;
    if (userId) {
      user = await getUserById(userId);
    } else if (decoded.email) {
      user = await getUserByEmail(decoded.email);
    } else {
      throw new CustomError("Invalid token payload", 401);
    }

    const accessToken = createAccessToken(user);

    res.cookie("job_tracker_token", accessToken, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });

    return ApiResponse.success(res, "Access token refreshed successfully", 200, {
      accessToken,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("job_tracker_token", { path: "/" });
    res.clearCookie("job_tracker_refresh_token", { path: "/" });
    return ApiResponse.success(res, "User logged out successfully", 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};

export { registerUser, loginUser, refreshToken, logout };

