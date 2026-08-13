import { User, IUser } from "../../../models/user.model.js";
import { CustomError } from "../../../error-formates/error-formates.js";
import crypto from "crypto";

export function hashPassword(password: string) {
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

export const getUserByEmailOrName = async (identifier: string) => {
  if (!identifier) {
    throw new CustomError("Please Provide a valid user", 400);
  }
  const cleanIdentifier = identifier.trim();
  const user = await User.findOne({
    $or: [{ email: cleanIdentifier.toLowerCase() }, { name: cleanIdentifier }],
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

export const createUser = async ({ ...user }: Partial<IUser> & { name?: string; email: string; password: string }) => {
  const email = user.email.trim().toLowerCase();
  const name = (user.name || email.split("@")[0]).trim();
  const exists = await User.findOne({ email });
  if (exists) throw new CustomError("User with this email already exists", 400);

  const hash = hashPassword(user.password);
  return await User.create({ ...user, name, email, password: hash });
};

