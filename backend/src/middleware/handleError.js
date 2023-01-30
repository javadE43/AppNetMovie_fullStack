import {createRequire}from "module";
const require=createRequire(import.meta.url)
const winston = require('winston');

export const handlerError=(err,req,res,next)=>{
    winston.error(err.message, err);
    res.status(500).json({message:"(server error) something failed" })
}