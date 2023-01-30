import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { Op } from "sequelize";

export const ratingsController = new (class RatingsController {
  constructor() {}

  //add rating
  async addRatings(req, res) {
    const { username, movietitle, ratings, userId } = req.body;

    if (!username && !movietitle) {
      return res.status(400).send("");
    }
    const user = await db.user.findOne({ where: { username: username } });

    if (!user) {
      return res.status(400).send("");
    }
    const getratings = await db.Ratings.findOne({
      where: { [Op.and]: [{ userId: userId }, { movietitle: movietitle }] },
    });

    if (getratings) {
      const Rating = await db.Ratings.destroy({
        where: { [Op.and]: [{ userId: userId }, { movietitle: movietitle }] },
      });

      return responce({
        res,
        code: 200,
        message: "ok",
        data: Rating,
      });
    }

    if (getratings === null) {
      const Rating = await db.Ratings.create(req.body);
      return responce({
        res,
        code: 200,
        message: "ok",
        data: Rating,
      });
    }
  }

  //get rating
  async getAllRating(req, res) {
    const { movietitle } = req.query;
    if (!movietitle) {
      return res.status(400).send("");
    }
    const ratings = await db.Ratings.findAll({
      where: { movietitle: movietitle },
    });

    responce({
      res,
      code: 200,
      message: "ok",
      data: ratings,
    });
  }
})();
