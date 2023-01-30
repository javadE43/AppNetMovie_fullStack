import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { Op } from "sequelize";

export const reviewController = new (class ReviewController {
  constructor() {}

  async addcamment(req, res) {
    const { userId, movieid, movietitle, content, ratings } = req.body;

    if (!userId || !movietitle || !content) {
      return responce({
        res,
        code: 400,
        message: "Bad request",
      });
    }
    const user = await db.user.findOne({ where: { id: userId } });

    if (!user) {
      return responce({
        res,
        code: 400,
        message: "Bad request",
      });
    }

    try {
      const newComent = await db.Review.create({
        ...req.body,
        userId: user.toJSON().id,
      });
      return responce({
        res,
        code: 201,
        message: "success",
        data: newComent,
      });
    } catch (error) {
      responce({
        res,
        code: 500,
        message: "Blocked Request",
      });
    }
  }
  // getAllComment
  async getAllcamment(req, res) {
    const { movieid, movietitle } = req.query;
    if (!movieid && !movietitle) {
      responce({
        res,
        code: 400,
        message: "Bad Request",
      });
    }
    try {
      const comment = await db.Review.findAll({
        where: {
          [Op.or]: [{ movietitle: movietitle }, { movieid: Number(movieid) }],
        },
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: comment,
      });
    } catch (error) {
      responce({
        res,
        code: 500,
        message: "Blocked Request",
      });
    }
  }
  // RemoveCommentByUser
  async removeCommentByUser(req, res) {
    const { userid, movieid, createdAt } = req.query;
    if (!movieid || !userid) {
      responce({
        res,
        code: 400,
        message: "Bad Request",
      });
    }
    try {
      const comment = await db.Review.destroy({
        where: {
          [Op.and]: [
            { userId: userid },
            { movieid: movieid },
            { createdAt: createdAt },
          ],
        },
      });
      responce({
        res,
        code: 200,
        message: "success",
      });
    } catch (error) {
      responce({
        res,
        code: 500,
        message: "Blocked Request",
      });
    }
  }
})();
