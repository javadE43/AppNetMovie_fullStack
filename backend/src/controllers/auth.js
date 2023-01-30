import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { Op } from "sequelize";
import "dotenv/config";
const bcrypt = require("bcrypt");
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import db from "../model/index.js";
import { responce } from "../util/configResponce.js";

export const authController = new (class AuthController {
  async register(req, res) {
    const { username, email, password, role, mobile, confirm } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return responce({
        res,
        code: 400,
        message: "The information entered is incorrect",
        data: error.array(),
      });
    }
    if (confirm !== password) {
      return responce({
        res,
        code: 401,
        message: "پسورد مطابقت ندارد",
        data: error.array(),
      });
    }
    //
    const dublicateUsername = await db.user.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (dublicateUsername !== null) {
      return responce({
        res,
        code: 409,
        message: "There is a user with this username",
      });
    }
    //
    const dublicate = await db.user.findOne({
      where: {
        [Op.and]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (dublicate) {
      return responce({
        res,
        code: 409,
        message: "There is a user with this username",
      });
    }

    //
    const data = {};
    if (req.file) {
      data.img = req.file.path.replace(/\\/g, "/").substring(6);
    }
    try {
      const newUser = await db.user.create(
        {
          username: username,
          mobile: mobile,
          email: email,
          image: `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${data.img}`,
          password: password,
          roleuser: req.body.role ? req.body.role : null,
          role: [{}],
        },
        {
          include: db.Role,
        }
      );

      // check roles
      if (db.ROLES.includes(role)) {
        const Role = await db.Role.findOne({ where: { name: role } });
        await db.RoleHasUser.create({
          roleId: Role.toJSON().id,
          userId: newUser.toJSON().id,
        });
        await db.user.update(
          { roleuser: Role.toJSON().name },
          { where: { username: username } }
        );
      } else {
        const Role = await db.Role.findOne({ where: { name: db.ROLES[1] } });
        await db.RoleHasUser.create({
          roleId: Role.toJSON().id,
          userId: newUser.toJSON().id,
        });
        await db.user.update(
          { roleuser: Role.toJSON().name },
          { where: { username: username } }
        );
      }
      responce({
        res,
        code: 201,
        message: ` ثبت نام  با موفقیت انجام شد ${username}`,
        data: newUser,
      });
    } catch (error) {
      responce({
        res,
        code: 500,
        message: "please try again later",
      });
    }
  }

  async handleLogin(req, res) {
    const cookie = req.cookies;
    //Checking that the request body is not empty
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return responce({
        res,
        message: "The information entered is invalid",
        code: 400,
        data: error.array(),
      });
    }

    const { username, password } = req.body;
    //Checking the existence of the user in the database
    let fondUser = await db.user.findOne({
      where: { username: username },
      include: db.Role,
    });
    if (fondUser === null) {
      return responce({
        res,
        message: "There is no user with this profile",
        code: 401,
        data: {},
      });
    }

    fondUser = JSON.parse(JSON.stringify(fondUser));
    //match password
    const match = await bcrypt.compare(password, fondUser.password);
    if (!match) {
      return responce({
        res,
        message: "The password does not match",
        code: 401,
        data: {},
      });
    }
    // create access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: fondUser.username,
          role: fondUser?.roles?.[0]?.name,
        },
      },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "30s" }
    );
    // create refresh token
    const refreshToken = jwt.sign(
      {
        username: fondUser.username,
        id: fondUser.id,
        role: fondUser?.roles?.[0]?.name,
      },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    // check refresh token cookie
    let newreFreshToken = "";
    if (cookie?.jwt) {
      newreFreshToken = await db.Token.findOne({
        where: { [Op.and]: [{ name: cookie.jwt }, { userId: fondUser.id }] },
      });
      if (newreFreshToken) {
        const remove = await db.Token.destroy({
          where: {
            [Op.and]: [
              { name: newreFreshToken.toJSON().name },
              { userId: fondUser.id },
            ],
          },
        });
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Lax",
        // secure: false,
      });
    }
    try {
      const token = await db.Token.create({
        name: refreshToken,
        userId: fondUser.id,
      });
      // set refreshcookie in cookie client
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // secure: false,
        samsite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      const userInfo = {
        role: fondUser?.roles?.[0]?.name,
        username: fondUser.username,
        id: fondUser.id,
        image: fondUser?.image,
      };
      responce({
        res,
        message: `verify${fondUser.username}`,
        code: 200,
        data: { userInfo, accessToken },
      });
    } catch (error) {
      responce({
        res,
        message: `Request Blocked`,
        code: 500,
      });
    }
  }
})();
