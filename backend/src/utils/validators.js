import mongoose from "mongoose";
import { MAX_IMAGE_UPLOAD_BYTES } from "../lib/config.js";

const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|gif|webp);base64,/i;
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

export const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  if (typeof id === "string") {
    return new mongoose.Types.ObjectId(id).toString() === id.toLowerCase();
  }

  return true;
};

export const normalizeMessageText = (text) => {
  if (text === undefined || text === null) return "";
  if (typeof text !== "string") return null;
  return text.trim();
};

export const getBase64ByteSize = (base64) => {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

export const isValidImageDataUrl = (
  value,
  { maxBytes = MAX_IMAGE_UPLOAD_BYTES } = {}
) => {
  if (typeof value !== "string" || !DATA_IMAGE_PATTERN.test(value)) {
    return false;
  }

  const base64 = value.split(",")[1];
  if (!base64) return false;
  if (base64.length % 4 !== 0 || !BASE64_PATTERN.test(base64)) return false;
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return false;

  const estimatedBytes = getBase64ByteSize(base64);
  return estimatedBytes <= maxBytes;
};

export const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
