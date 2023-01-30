import express from "express";
import upload from "../../middleware/uploadFile.js";

import { authController } from "../../controllers/auth.js";
import { validatoreAuth } from "./validator.js";
import handleRefreshToken from "../../controllers/handlrefreshToken.js";
import handleLogout from "../../controllers/loggout.js";
const authRouter = express.Router();

// REGISTER
authRouter.post(
  "/regeister",
  validatoreAuth.register(),
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
      req.body.img = null;
    } else {
      req.body.img = req.file.filename;
    }
    next();
  },
  authController.register
);

// LOGIN
authRouter.post("/login",validatoreAuth.login(),authController.handleLogin);

// refreshToken
authRouter.get("/refreshtoken",handleRefreshToken );
authRouter.get("/logout",handleLogout );

export default authRouter;
