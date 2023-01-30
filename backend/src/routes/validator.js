import autoBind from "auto-bind"
import { json } from "sequelize"

import db from "../model/index.js"


export class Validatore{

    constructor(){
     autoBind(this)
     this.model=db
    }

}





