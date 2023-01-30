import express from "express";
import {verifyToken}from "../../middleware/verifyToken.js"
import verifyRoles from "../../middleware/verifyRole.js"
import db from "../../model/index.js";
import {reviewController} from "../../controllers/reviewController.js"
const reviewRoute = express.Router();

reviewRoute.post("/",verifyToken,verifyRoles(db.ROLES),reviewController.addcamment);
reviewRoute.get("/",verifyToken,verifyRoles(db.ROLES),reviewController.getAllcamment);
reviewRoute.delete("/",verifyToken,verifyRoles(db.ROLES),reviewController.removeCommentByUser);


export default reviewRoute;