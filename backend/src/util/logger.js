import { createRequire } from "module";
const require = createRequire(import.meta.url);
const winston = require("winston");
const debug = require("debug")("app:main");

export const logError = function () {
  process.on("uncaughtException", (ex) => {
    debug(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    debug(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
