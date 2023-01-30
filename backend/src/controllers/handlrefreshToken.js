import db from "../model/index.js";
import { createRequire } from "module";
import * as dotenv from "dotenv";
import { Op } from "sequelize";
import { responce } from "../util/configResponce.js";
dotenv.config();
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return responce({
      res,
      code: 401,
      message: "The cookie is not set in the url",
    });
  }

  const refreshToken = cookies.jwt;

  const TokensRefresh = await db.Token.findOne({where: { name: refreshToken }});

  if (!TokensRefresh ) {
    jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) {
          return responce({
            res,
            code: 401,
            message: "The token has expired",
          });
        }

        const hackedUser = await db.user.findOne({
          username: decoded.username,
        });
        const remove=  await db.Token.destroy({
            where: {[Op.and]:[{ userId: hackedUser.toJSON().id},{name:refreshToken}] },
          });
      }
    );
    return responce({
      res,
      code: 403,
      message: "There are no users with this token",
    });
  }
  // res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax" });

  const foundUser = await db.user.findOne({where: { id: TokensRefresh?.toJSON().userId }});

  if (!foundUser ) {
    jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) {
          return responce({
            res,
            code: 401,
            message: "The token has expired",
          });
        }

        const hackedUser = await db.user.findOne({
          username: decoded.username,
        });
        const remove=  await db.Token.destroy({
            where: { userId: hackedUser.toJSON().id },
          });
      }
    );
    return responce({
      res,
      code: 403,
      message: "There are no users with this token",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.SECRET_KEY_REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return responce({
          res,
          code: 403,
          message: "The token has expired",
        });
      }
      if (err || foundUser.toJSON().username !== decoded.username)
        return res.sendStatus(403);
      const roles = await db.RoleHasUser.findOne({
        where: { userId: foundUser.toJSON().id },
      });
      if (!roles?.toJSON()?.roleId) {
        return;
      }

      const newRole = await db.Role.findOne({ where: { id: roles.roleId } });
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            role: newRole.toJSON().name,
          },
        },
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: "30s" }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.toJSON().username, id: decoded.id },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: "1d" }
      );
      try {

        let newToken = await db.Token.findOne({where: { name: refreshToken }});

        if(newToken?.toJSON().name === refreshToken){
          newToken.set({
            name:newRefreshToken
          })
          newToken=await newToken.save()
        }

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          // secure: false,
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000,
        });
        const user=await db.user.findOne({where:{id:decoded.id}})
        const userInfo = {
          role: newRole.toJSON().name,
          username: decoded.username,
          image:user.toJSON()?.image,
          id: decoded.id,
        };
        responce({
          res,
          code: 200,
          message: "The token has been updated",
          data: { userInfo, accessToken },
        });
      } catch (error) {
        responce({
          res,
          code: 500,
          message: "Request Blocked",
        });
      }
    }
  );
};

export default handleRefreshToken;
