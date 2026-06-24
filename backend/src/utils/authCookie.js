import { COOKIE_SAME_SITE, COOKIE_SECURE } from "../lib/config.js";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const buildAuthCookieOptions = ({
  isProductionMode,
  secure,
  sameSite,
} = {}) => {
  const resolvedSecure =
    secure ?? (isProductionMode === undefined ? false : isProductionMode);
  const resolvedSameSite =
    sameSite ?? (isProductionMode ? "none" : "lax");

  return {
    httpOnly: true,
    secure: resolvedSecure,
    sameSite: resolvedSameSite,
    path: "/",
  };
};

export const buildAuthCookieSetOptions = (options) => ({
  ...buildAuthCookieOptions(options),
  maxAge: COOKIE_MAX_AGE_MS,
});

export const getAuthCookieOptions = () =>
  buildAuthCookieOptions({
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
  });

export const getAuthCookieSetOptions = () =>
  buildAuthCookieSetOptions({
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
  });
