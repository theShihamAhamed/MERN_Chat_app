import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../lib/logger.js";

const getCookieValue = (cookieHeader, cookieName) =>
  cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=");

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const rawToken = getCookieValue(socket.handshake.headers.cookie, "token");
    const token = rawToken ? decodeURIComponent(rawToken) : null;

    if (!token) {
      return next(new Error("Unauthorized - No Token Provided"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return next(new Error("Unauthorized - Invalid Token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    logger.warn({ err: error }, "Socket authentication failed");
    next(new Error("Unauthorized - Authentication failed"));
  }
};
