import { allowOrigins } from "./allowOrigins.js";

export const corsOption = {
  origin: (origin, callback) => {
    if (allowOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
      // console.log(origin)
    } else {
      callback(new Error("not allowed by cors"));
    }
  },
  optionsSuccessStatus:200,

};
