import { allowOrigins } from "../../config/allowOrigins.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
