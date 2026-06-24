import jwt from "jsonwebtoken";
import { getAuthCookieSetOptions } from "./authCookie.js";

export const generateTokenAndSetCookie = (res, userId) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, getAuthCookieSetOptions());

  return token;
};
