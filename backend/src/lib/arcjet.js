import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ARCJET_KEY, ARCJET_MODE } from "./config.js";
import logger from "./logger.js";

const aj = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      log: logger,
      rules: [
        shield({ mode: ARCJET_MODE }),
        detectBot({
          mode: ARCJET_MODE,
          allow: [
            "CATEGORY:SEARCH_ENGINE",
            // "CATEGORY:MONITOR",
            // "CATEGORY:PREVIEW",
          ],
        }),
        slidingWindow({
          mode: ARCJET_MODE,
          max: 100,
          interval: 60,
        }),
      ],
    })
  : null;

export default aj;
