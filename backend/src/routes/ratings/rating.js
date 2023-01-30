import express from "express";
import {verifyToken}from "../../middleware/verifyToken.js"
import verifyRoles from "../../middleware/verifyRole.js"
import db from "../../model/index.js";
import {ratingsController} from "../../controllers/ratingsController.js"
const ratingsRoute = express.Router();

ratingsRoute.post("/",verifyToken,verifyRoles(db.ROLES),ratingsController.addRatings);
ratingsRoute.get("/",verifyToken,verifyRoles(db.ROLES),ratingsController.getAllRating);

export default ratingsRoute;