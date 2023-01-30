import express from "express";
import upload from "../../middleware/uploadFile.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import db from "../../model/index.js";
import {
  updateUser,
  deleteuser,
  getUser,
  getAllUser,
  createUser,
  getUserStats,
  getCountUsersByRole,
} from "../../controllers/user.js";
import verifyRoles from "../../middleware/verifyRole.js";
import { validatoreUser } from "./validate.js";

const userRouter = express.Router();

//UPDATE
userRouter.put(
  "/:id",
  verifyToken,
  verifyRoles(db.ROLES),
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
      req.body.image = null;
    } else {
      req.body.image = req.file.filename;
    }
    next();
  },
  validatoreUser.editeuser(),
  updateUser
);

// //create  USER
userRouter.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
      req.body.image = null;
    } else {
      req.body.image = req.file.filename;
    }
    next();
  },
  validatoreUser.createuser(),
  createUser
);
// //DELETE
userRouter.delete(
  "/:id",
  verifyToken,
  verifyRoles(db.ROLES),
  deleteuser
);

// //GET USER
userRouter.get("/find/:id", getUser);

//countUserByRole
userRouter.get("/count",
verifyToken,
verifyRoles(db.ROLES),
 getCountUsersByRole);

// //GET ALL USER
userRouter.get("/",
verifyToken,
verifyRoles(db.ROLES),
 getAllUser);

// //GET USER STATS

userRouter.get("/stats", verifyToken, getUserStats);

export default userRouter;
