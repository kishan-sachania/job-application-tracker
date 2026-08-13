import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../../../models/user.model.js";
import config from "../../../../config/config.js";

export interface TokenPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
}

const ACCESS_OPTS: SignOptions = {
  expiresIn: "15m",
};

const REFRESH_OPTS: SignOptions = {
  expiresIn: "7d",
};

const toPayload = (user: IUser) => ({
  sub: user._id.toString(),
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

const createAccessToken = (user: IUser) =>
  jwt.sign(toPayload(user), config.JWT_ACCESS_SECRET, ACCESS_OPTS);

const createRefreshToken = (user: IUser) =>
  jwt.sign(toPayload(user), config.JWT_REFRESH_SECRET, REFRESH_OPTS);

const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;

const rotateRefreshToken = (oldToken: string) => {
  const decoded = verifyRefreshToken(oldToken);
  return jwt.sign(
    { sub: decoded.sub, id: decoded.id || decoded.sub, email: decoded.email, role: decoded.role },
    config.JWT_REFRESH_SECRET,
    REFRESH_OPTS,
  );
};

function generateTokens(user: IUser) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return { accessToken, refreshToken };
}

export {
  generateTokens,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  rotateRefreshToken,
};

