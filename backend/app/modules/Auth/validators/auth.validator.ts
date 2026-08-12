import { CustomError } from "../../../error-formates/error-formates.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterInput {
  userName?: string;
  email?: string;
  password?: string;
}

export interface LoginInput {
  email?: string;
  userName?: string;
  password?: string;
}

export interface RefreshTokenInput {
  refreshToken?: string;
}

export function validateRegisterInput(input: RegisterInput) {
  const userName = input.userName?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!userName || !email || !password) {
    throw new CustomError("All fields (userName, email, password) are required", 400);
  }

  if (userName.length < 3 || userName.length > 30) {
    throw new CustomError("Username must be between 3 and 30 characters long", 400);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(userName)) {
    throw new CustomError("Username can only contain letters, numbers, underscores, and hyphens", 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new CustomError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters long", 400);
  }

  return { userName, email, password };
}

export function validateLoginInput(input: LoginInput) {
  const rawIdentifier = input.email || input.userName;
  const password = input.password;

  if (!rawIdentifier || !password) {
    throw new CustomError("Identifier (email or username) and password are required", 400);
  }

  const identifier = rawIdentifier.trim().toLowerCase();

  return { identifier, password };
}

export function validateRefreshTokenInput(input: RefreshTokenInput) {
  const token = input.refreshToken?.trim();

  if (!token) {
    throw new CustomError("Refresh token is required", 400);
  }

  return { refreshToken: token };
}
