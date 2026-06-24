import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./lib/db.js";
import logger from "./lib/logger.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import {
  corsOptions,
  JSON_BODY_LIMIT,
  PORT,
  SERVE_FRONTEND,
  TRUST_PROXY,
} from "./lib/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");
const frontendDistPath = path.join(rootDir, "frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");
const shouldServeFrontend = SERVE_FRONTEND && existsSync(frontendIndexPath);

app.set("trust proxy", TRUST_PROXY);
app.use(cors(corsOptions));
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(cookieParser());

app.get("/api/health", (_, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api", (_, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

if (shouldServeFrontend) {
  app.use(express.static(frontendDistPath));

  app.get("*", (_, res) => {
    res.sendFile(frontendIndexPath);
  });
} else {
  if (SERVE_FRONTEND) {
    logger.warn(
      { frontendIndexPath },
      "SERVE_FRONTEND is true, but frontend build was not found. Running API-only mode."
    );
  }

  app.get("/", (_, res) => {
    res.status(200).json({ success: true, message: "Toki API is running" });
  });
}

if (!shouldServeFrontend) {
  app.get("*", (_, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });
}

server.on("error", (error) => {
  logger.error(error, "Server error");
  process.exit(1);
});

const startServer = async () => {
  try {
    await dbConnect();

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
};

startServer();
