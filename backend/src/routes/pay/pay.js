import express from "express";

import {Pay} from "../../controllers/payController.js";

const payRouter =express.Router();
const paycontroller=new Pay();




payRouter.post("/",paycontroller.pay)
payRouter.get("/",paycontroller.payCallbak)


export default payRouter;