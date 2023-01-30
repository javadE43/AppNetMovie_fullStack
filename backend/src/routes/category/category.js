import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import verifyRoles from "../../middleware/verifyRole.js";
import db from "../../model/index.js";
import upload from "../../middleware/uploadFile.js";
import { categoryController } from "../../controllers/categoryController.js";
import { validatoreCategory } from "./validate.js";
const cateRouter = express.Router();

cateRouter.post(
  "/",
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
  validatoreCategory.createCategory(),
  categoryController.insertCategory
);
cateRouter.get("/count", categoryController.getCountCategory);
cateRouter.get("/", categoryController.getCategory);
cateRouter.put(
  "/",
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
  validatoreCategory.editeCategory(),
  categoryController.updateCategory
);
cateRouter.delete(
  "/",
  verifyToken,
  verifyRoles(db.ROLES),
  categoryController.removeCategory
);

export default cateRouter;
