import express from "express"

import {getTransaction} from "../../controllers/transAction.js";

const transRoute=express.Router();

transRoute.get('/',getTransaction)





export default transRoute;