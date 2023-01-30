import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import sequelize from "sequelize";
import { paginate } from "../helper/paginate.js";
export const mylistController = new (class MylistController {
  constructor() {}

  async inserList(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return responce({
        res,
        code: 401,
        message: "error validate",
        data: error.array(),
      });
    }
    const user = await db.user.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(400).send("");
    }

    const dublicateMovie = await db.Mylist.findOne({
      where: {
        [Op.and]: [{ userId: user.toJSON().id }, { title: req.body.title }],
      },
    });
    if (dublicateMovie) {
      return responce({
        res,
        code: 409,
        message: "already movie",
      });
    }

    const catTitle = await db.Category.findOne({
      attributes: ["title"],
      where: { bits: req.body.genre_ids[0] },
    });

    if (!catTitle) {
      return responce({
        res,
        code: 400,
        message: "already movie",
      });
    }
    try {
      const newList = await db.Mylist.create({
        username: req.body.username,
        userId: user.toJSON().id,
        adult: req.body.adult ? req.body.adult : false,
        backdrop_path: req.body.backdrop_path ? req.body.backdrop_path : null,
        genre_ids: req.body.genre_ids
          ? JSON.stringify(req.body.genre_ids)
          : null,
        original_language: req.body.original_language
          ? req.body.original_language
          : null,
        original_title: req.body.original_title
          ? req.body.original_title
          : null,
        overview: req.body.overview ? req.body.overview : null,
        popularity: req.body.popularity ? req.body.popularity : null,
        poster_path: req.body.poster_path ? req.body.poster_path : nll,
        release_date: req.body.release_date ? req.body.release_date : nul,
        title: req.body.title ? req.body.title : null,
        video: req.body.video ? req.body.video : false,
        vote_average: req.body.vote_average ? req.body.vote_average : null,
        vote_count: req.body.vote_count ? req.body.vote_count : null,
        media_type: req.body.media_type ? req.body.media_type : null,
        movieid: req.body.id ? req.body.id : null,
        categoryTitle: catTitle.toJSON().title,
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: newList,
      });
    } catch (error) {
      return responce({
        res,
        code: 500,
        message: "Request Blocked",
        data: newList,
      });
    }
  }

  //CountMylist

  async getMylistCount(req, res) {
    if (!req.params.id) {
      return responce({
        res,
        code: 400,
        message: "error",
      });
    }

    try {
      const mylistCount = await db.Mylist.findAll({
        attributes: ["createdAt", "id"],
        where: { userId: req.params.id },
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: mylistCount,
      });
    } catch (error) {
      // console.log(error);
      return responce({
        res,
        code: 500,
        message: "fail",
        data: error,
      });
    }
  }

  //getAllmylist
  async getAllList(req, res) {
    const { id } = req.params;
    if (!id) {
      return responce({
        res,
        code: 400,
        message: "error",
      });
    }

    if (req.query?.category && req.query?.all) {
      try {
        const category = Number(req.query.category);
        const page = req.query?.page ? Number(req.query.page) : 1;
        const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 100;

        const cat = await db.Category.findOne({ where: { bits: category } });

        if (!cat) {
          return responce({
            res,
            code: 400,
            message: "error",
          });
        }
        const movies = await db.Mylist.findAll(
          paginate(
            {
              where: {
                [Op.and]: [
                  { userId: id },
                  { categoryTitle: cat.toJSON().title },
                ],
              },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Mylist.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
          where: {
            [Op.and]: [{ userId: id }, { categoryTitle: cat.toJSON().title }],
          },
        });
        if (movies?.length < 1 && !count) {
          return responce({
            res,
            code: 200,
            message: "ok",
            data: { movies: movies, count: 0 },
          });
        }
        return responce({
          res,
          code: 200,
          message: "ok",
          data: { movies: movies, count: count.countMovies },
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
    }
    if (req.query?.search) {
      try {
        const page = req.query?.page ? Number(req.query.page) : 1;
        const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 100;
        const movies = await db.Mylist.findAll(
          paginate(
            {
              where: {
                [Op.and]: [
                  { userId: id },
                  {
                    title: {
                      [Op.substring]: req.query.search,
                    },
                  },
                ],
              },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Mylist.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
          where: { userId: id },
        });
        if (movies?.length < 1 && !count) {
          return responce({
            res,
            code: 200,
            message: "ok",
            data: { movies: movies, count: 0 },
          });
        }
        return responce({
          res,
          code: 200,
          message: "ok",
          data: { movies: movies, count: count.countMovies },
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
    }

    if (req.query?.category) {
      try {
        const category = Number(req.query.category);
        const page = req.query?.page ? Number(req.query.page) : 1;
        const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 100;

        const cat = await db.Category.findOne({
          where: { bits: Number(category) },
        });

        if (!cat) {
          return responce({
            res,
            code: 400,
            message: "error",
          });
        }

        const movies = await db.Mylist.findAll(
          paginate(
            {
              where: {
                [Op.and]: [
                  { userId: id },
                  { categoryTitle: cat.toJSON().title },
                ],
              },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Mylist.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
          where: {
            [Op.and]: [{ userId: id }, { categoryTitle: cat.toJSON().title }],
          },
        });
        if (movies?.length < 1 && !count) {
          return responce({
            res,
            code: 200,
            message: "ok",
            data: { movies: movies, count: 0 },
          });
        }
        return responce({
          res,
          code: 200,
          message: "ok",
          data: { movies: movies, count: count.countMovies },
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
    }
    if (req.query?.page && req.query?.pageSize) {
      try {
        const page = req.query?.page ? Number(req.query.page) : 1;
        const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 100;
        const movies = await db.Mylist.findAll(
          paginate(
            {
              where: { userId: Number(id) },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Mylist.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
          where: { userId: Number(id) },
        });
        if (movies?.length < 1 && !count) {
          return responce({
            res,
            code: 200,
            message: "ok",
            data: { movies: movies, count: 0 },
          });
        }
        return responce({
          res,
          code: 200,
          message: "ok",
          data: { movies: movies, count: count.countMovies },
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
    } else {
      try {
        const movies = await db.Mylist.findAll({
          where: { userId: id },
          order: [["id", "DESC"]],
        });

        const count = await db.Mylist.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
          where: { userId: id },
        });
        if (movies?.length < 1 && !count) {
          return responce({
            res,
            code: 200,
            message: "ok",
            data: { movies: movies, count: 0 },
          });
        }
        return responce({
          res,
          code: 200,
          message: "ok",
          data: { movies: movies, count: count.countMovies },
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
    }
  }

  //remove
  async removeMovie(req, res) {
    const { userid, movieid } = req.query;
    if (!userid || !movieid) {
      responce({
        res,
        code: 400,
        message: "fail",
      });
    }
    try {
      const mylist = await db.Mylist.destroy({
        where: {
          [Op.and]: [{ userId: Number(userid) }, { id: Number(movieid) }],
        },
      });
      if (!mylist) {
        return responce({
          res,
          code: 400,
          message: `error`,
        });
      }
      return responce({
        res,
        code: 200,
        message: `remove movie by id ${movieid}`,
      });
    } catch (error) {
      return responce({
        res,
        code: 500,
        message: "",
      });
    }
  }
})();
