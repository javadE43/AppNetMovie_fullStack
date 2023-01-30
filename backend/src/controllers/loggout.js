import db from "../model/index.js";
import { createRequire } from "module";
import * as dotenv from "dotenv";
dotenv.config();
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204);

    const refreshToken = cookies.jwt;
    const foundUser = await db.Token.findOne({ where:{name:refreshToken} })
    
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      return res.sendStatus(204);
    }

    jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN,async(err,decoded)=>{
     if (err) {
        return res.status(403)
     }
     const username=decoded.username
     const user= await db.user.findOne({where:{username:username}})
     await db.Token.destroy({where:{[Op.and]:[{UserId:user.id},{name:refreshToken}]}})
    })
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  };

  export default handleLogout;