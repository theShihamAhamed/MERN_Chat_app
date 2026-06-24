import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { corsOptions } from "./config.js";
import logger from "./logger.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

const userSocketMap = new Map(); // userId -> Set<socketId>

export function getReceiverSocketId(userId) {
  return getReceiverSocketIds(userId)[0];
}

export function getReceiverSocketIds(userId) {
  return Array.from(userSocketMap.get(userId.toString()) || []);
}

const getOnlineUserIds = () => Array.from(userSocketMap.keys());

io.on("connection", (socket) => {
  const userId = socket.userId;
  const existingSockets = userSocketMap.get(userId) || new Set();

  existingSockets.add(socket.id);
  userSocketMap.set(userId, existingSockets);

  logger.info({ userId }, "Socket connected");
  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("disconnect", () => {
    const sockets = userSocketMap.get(userId);

    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }

    logger.info({ userId }, "Socket disconnected");
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };
