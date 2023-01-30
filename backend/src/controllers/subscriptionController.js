import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { Op } from "sequelize";

export const subscription = new (class Subscription {
  constructor() {}

  async insert(req, res) {
    const { userid } = req.params;
    const { username, mobile, email, account } = req.body;

    if (!username) {
      return res.status(400).send("");
    }
    const user = await db.user.findOne({
      where: { id: userid },
    });

    if (!user) {
      return res.status(400).send("");
    }
    const subscr = await db.Subscription.findOne({
      where: { username: username },
    });

    if (!subscr) {
      try {
        const newSubs = await db.Subscription.create({
          username: username,
          email: email,
          mobile: mobile,
          userid: Number(userid),
          account: account,
        });

        return responce({
          res,
          code: 201,
          message: "ok",
          data: newSubs,
        });
      } catch (error) {
        return responce({
          res,
          code: 400,
          message: "ok",
          data: error,
        });
      }
    }
    try {
      const updateSubs = await db.Subscription.update(
        {
          username: username,
          email: email,
          mobile: mobile,
          userid: userid,
          account: account,
        },
        { where: { userid: userid } }
      );
      if (updateSubs) {
        const subscrib = await db.Subscription.findOne({
          where: { userid: userid },
        });
        return responce({
          res,
          code: 200,
          message: "ok",
          data: subscrib,
        });
      }
    } catch (error) {
      return responce({
        res,
        code: 400,
        message: "ok",
        data: error,
      });
    }
  }
  async getSubscrip(req, res) {
    const { username } = req.query;
    const subs = await db.Subscription.findAll({
      where: { username: username },
    });
    responce({
      res,
      code: 200,
      message: "ok",
      data: subs,
    });
  }
})();
