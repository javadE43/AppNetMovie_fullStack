import express from "express";
import {verifyToken}from "../../middleware/verifyToken.js"
import verifyRoles from "../../middleware/verifyRole.js"
import db from "../../model/index.js";
import {subscription} from "../../controllers/subscriptionController.js"
const subsRoute = express.Router();

subsRoute.post("/:userid",verifyToken,verifyRoles(db.ROLES),subscription.insert);
subsRoute.get("/:userid",verifyToken,verifyRoles(db.ROLES),subscription.getSubscrip);

export default subsRoute;