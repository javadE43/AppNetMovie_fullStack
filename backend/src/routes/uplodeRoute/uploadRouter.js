import express from "express";
import { UplodeController } from "../../controllers/uplodeController.js";
import uploade from "../../middleware/uplode.js";
import {verifyToken}from "../../middleware/verifyToken.js"
import verifyRoles from "../../middleware/verifyRole.js"
import db from "../../model/index.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
const uploadRouter = express.Router();

const uplodeController = new UplodeController();

uploadRouter.post("/",verifyToken,verifyRoles(db.ROLES), verifyAdmin, uploade, uplodeController.addFile);

export default uploadRouter;
