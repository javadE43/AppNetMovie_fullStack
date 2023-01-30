import express from "express";
//
import cors from "cors";
import coockieparser from "cookie-parser";
import chalk from "chalk";
import config from "config";
import * as dotenv from "dotenv";
dotenv.config();
//
process.env.NODE_ENV = "production";

import { corsOption } from "./config/corsOrgin.js";
import { credentials } from "./src/middleware/credentials.js";
import { configMiddleware } from "./src/startup/configMiddleware.js";
// //
import { connectDB } from "./src/startup/db.js";
import router from "./src/routes/index.js";
import { logError } from "./src/util/logger.js";

// app
const app = express();

// connectDB
connectDB();
//middleware
app.use(credentials);
app.use(cors(corsOption));
configMiddleware(express, app);
app.use(coockieparser());
logError();
// define route
app.use("/api", router);
// listen server
const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORTSR || 80 : 3500;
const HOSTNAME =
  process.env.NODE_ENV === "production"
    ? process.env.HOSTNAMESERVER || "127.0.0.1": "127.0.0.1";
app.listen(PORT, HOSTNAME, () => {
  console.log(chalk.bgYellow(app.get("env")));
  console.log(chalk.bgGreen(`connected server${HOSTNAME}:${PORT}`));
});
