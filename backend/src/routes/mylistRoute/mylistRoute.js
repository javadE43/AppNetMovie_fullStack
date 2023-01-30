import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import verifyRoles from "../../middleware/verifyRole.js";
import db from "../../model/index.js";
import { validator } from "./validator.js";
import { mylistController } from "../../controllers/mylistController.js";
const mylistRoute = express.Router();

mylistRoute.post(
  "/",
  validator.movieValid(),
  verifyToken,
  verifyRoles(db.ROLES),
  mylistController.inserList
);
mylistRoute.get(
  "/count/:id",
  verifyToken,
  verifyRoles(db.ROLES),
  mylistController.getMylistCount
  );
  mylistRoute.get(
    "/:id",
    verifyToken,
    verifyRoles(db.ROLES),
    mylistController.getAllList
  );
mylistRoute.delete(
  "/",
  verifyToken,
  verifyRoles(db.ROLES),
  mylistController.removeMovie
);

export default mylistRoute;
