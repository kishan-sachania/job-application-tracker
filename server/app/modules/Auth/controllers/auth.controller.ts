import { Request, Response } from "express";
import ApiResponse from "../../../../utils/api-response.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByEmailOrName,
  hashPassword,
} from "../services/user.service.js";
import { IUser } from "../../../models/user.model.js";
import { CustomError } from "../../../error-formates/error-formates.js";
import { generateTokens, createAccessToken, verifyRefreshToken } from "../services/auth.service.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateRefreshTokenInput,
} from "../validators/auth.validator.js";

const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = validateRegisterInput(req.body);

    const user = await createUser(validatedData as IUser);
    const { accessToken, refreshToken } = generateTokens(user);

    return ApiResponse.success(res, "User registered successfully", 201, {
      user,
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

    const user = await getUserByEmailOrName(identifier);
    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const hash = hashPassword(password);
    if (user.password !== hash) {
      throw new CustomError("Invalid credentials", 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return ApiResponse.success(res, "User logged in successfully", 200, {
      user,
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
    const tokenToVerify = req.body?.refreshToken;

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
    return ApiResponse.success(res, "User logged out successfully", 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ApiResponse.error(res, error.message, error.statusCode);
    }
    return ApiResponse.error(res, "Internal server error", 500);
  }
};

export { registerUser, loginUser, refreshToken, logout };

