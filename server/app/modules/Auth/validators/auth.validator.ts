import { CustomError } from "../../../error-formates/error-formates.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterInput {
  name?: string;
  userName?: string;
  email?: string;
  password?: string;
}

export interface LoginInput {
  email?: string;
  name?: string;
  userName?: string;
  password?: string;
}

export interface RefreshTokenInput {
  refreshToken?: string;
}

export function validateRegisterInput(input: RegisterInput) {
  const name = (input.name || input.userName)?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!name || !email || !password) {
    throw new CustomError("All fields (name, email, password) are required", 400);
  }

  if (name.length < 2 || name.length > 50) {
    throw new CustomError("Name must be between 2 and 50 characters long", 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new CustomError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters long", 400);
  }

  return { name, email, password };
}

export function validateLoginInput(input: LoginInput) {
  const rawIdentifier = input.email || input.name || input.userName;
  const password = input.password;

  if (!rawIdentifier || !password) {
    throw new CustomError("Email and password are required", 400);
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
