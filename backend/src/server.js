import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./lib/db.js";
import logger from "./lib/logger.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import { corsOptions, JSON_BODY_LIMIT, PORT, TRUST_PROXY } from "./lib/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

app.set("trust proxy", TRUST_PROXY);
app.use(cors(corsOptions));
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(cookieParser());

app.get("/api/health", (_, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(rootDir, "frontend/dist/index.html"));
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
