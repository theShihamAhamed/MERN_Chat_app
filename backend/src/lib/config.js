import dotenv from "dotenv";

dotenv.config();

const DEFAULT_CLIENT_URL = "http://localhost:5173";

const parseCsv = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];

const parseBoolean = (value) => {
  if (value === undefined) return undefined;

  const normalized = value.toLowerCase().trim();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;

  return undefined;
};

const parseSameSite = (value) => {
  const normalized = value?.toLowerCase().trim();
  return ["lax", "strict", "none"].includes(normalized)
    ? normalized
    : undefined;
};

const parseTrustProxy = (value) => {
  if (value === undefined) return undefined;

  const booleanValue = parseBoolean(value);
  if (booleanValue !== undefined) return booleanValue;

  const numericValue = Number(value);
  if (Number.isInteger(numericValue) && numericValue >= 0) return numericValue;

  return value;
};

export const NODE_ENV = process.env.NODE_ENV || "development";
export const isProduction = NODE_ENV === "production";
export const PORT = process.env.PORT || 5000;

const configuredClientUrls = parseCsv(
  process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || process.env.CORS_ORIGIN
);

export const CLIENT_URLS = [
  ...new Set(
    configuredClientUrls.length ? configuredClientUrls : [DEFAULT_CLIENT_URL]
  ),
];

export const ARCJET_KEY = process.env.ARCJET_KEY;
export const ARCJET_MODE =
  process.env.ARCJET_MODE || (isProduction ? "LIVE" : "DRY_RUN");

export const COOKIE_SECURE =
  parseBoolean(process.env.COOKIE_SECURE) ?? isProduction;
export const COOKIE_SAME_SITE =
  parseSameSite(process.env.COOKIE_SAME_SITE) ||
  (isProduction ? "none" : "lax");
export const TRUST_PROXY =
  parseTrustProxy(process.env.TRUST_PROXY) ?? (isProduction ? 1 : false);
export const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || "10mb";
export const SERVE_FRONTEND = parseBoolean(process.env.SERVE_FRONTEND) ?? false;

const configuredMaxImageUploadBytes = Number(process.env.MAX_IMAGE_UPLOAD_BYTES);

export const MAX_IMAGE_UPLOAD_BYTES =
  Number.isFinite(configuredMaxImageUploadBytes) &&
  configuredMaxImageUploadBytes > 0
    ? configuredMaxImageUploadBytes
    : 5 * 1024 * 1024;

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || CLIENT_URLS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};
