import {responce} from "../util/configResponce.js"
export const verifyAdmin=(req,res,next)=>{
    const role=req.roles;

    if (role !== "admin" || role !== "editor") {
        return responce({
            res,
            code:401,
            message:"You do not have access permission",
        })
    }
    next()
}