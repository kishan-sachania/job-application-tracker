import { User, IUser } from "../../../models/user.model.js";
import { CustomError } from "../../../error-formates/error-formates.js";
import crypto from "crypto";

export function sanitizeUser(user: any) {
  if (!user) return user;
  const userObj = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete userObj.password;
  return userObj;
}

export function hashPassword(password: string): string {
  return crypto.scryptSync(password, "salt", 64).toString("hex");
}

export const getUserByEmail = async (userEmail: string) => {
  if (!userEmail) {
    throw new CustomError("Please Provide a valid user", 400);
  }
  const cleanEmail = userEmail.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw new CustomError("User not Found!", 404);
  }
  return user;
};

export const getUserByEmailOrUsername = async (identifier: string) => {
  if (!identifier) {
    throw new CustomError("Please Provide a valid user", 400);
  }
  const cleanIdentifier = identifier.trim();
  const user = await User.findOne({
    $or: [{ email: cleanIdentifier.toLowerCase() }, { userName: cleanIdentifier }],
  });
  return user;
};

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new CustomError("Please Provide a valid user ID", 400);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not Found!", 404);
  }
  return user;
};

export const createUser = async ({ ...user }: IUser) => {
  const email = user.email.trim().toLowerCase();
  const userName = user.userName.trim();
  const exists = await User.findOne({ $or: [{ email }, { userName }] });
  if (exists) throw new CustomError("User exists", 400);

  const hash = hashPassword(user.password);
  return await User.create({ ...user, userName, email, password: hash });
};

