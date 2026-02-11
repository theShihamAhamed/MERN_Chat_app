import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "Toki",
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(error, "Error connecting to MongoDB");
    throw error;
  }
};

export default dbConnect;
