import { validationResult } from "express-validator";
import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { paginate } from "../helper/paginate.js";
import sequelize from "sequelize";
import { Op } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();
export const movieController = new (class MovieController {
  constructor() {}

  // insertMovie
  async insertMovie(req, res) {
    // chack valide movie
    // const error = validationResult(req);
    // if (!error.isEmpty()) {
    //   return responce({
    //     res,
    //     code: 401,
    //     message: "error validate",
    //     data: error.array(),
    //   });
    // }
    const dataimg = {};
    if (req.file !== undefined && req.file !== null) {
      dataimg.poster_path = req.file.path.replace(/\\/g, "/").substring(6);
      req.body.poster_path = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${dataimg.poster_path}`;
    } else {
      req.body.poster_path = null;
    }
    const data = {
      adult: Boolean(req.body?.adult),
      genre_ids: JSON.stringify([Number(req.body?.genre_ids)]),
      popularity: Number(req.body?.popularity),
      video: Boolean(req.body?.video),
      vote_average: Number(req.body?.vote_average),
      vote_count: Number(req.body?.vote_count),
    };

    const user = await db.user.findOne({
      where: { id: Number(req.query.userid) },
    });

    if (!user) {
      return responce({
        res,
        code: 400,
        message: "Blocked request (userid: undefined)",
      });
    }

    const dublicateMovie = await db.Movies.findOne({
      where: { title: req.body.title },
    });
    if (dublicateMovie) {
      return responce({
        res,
        code: 409,
        message: "already movie",
      });
    }

    let cat = await db.Category.findAll({
      attributes: ["id"],
      where: { bits: Number(req.body.genre_ids) },
    });

    if (!cat) {
      return responce({
        res,
        code: 400,
        message: "error",
      });
    }

    try {
      cat = JSON.parse(JSON.stringify(cat));
      const newMovie = await db.Movies.create({
        ...req.body,
        adult: data.adult,
        genre_ids: data.genre_ids,
        popularity: data.popularity,
        video: data.video,
        vote_count: data.vote_count,
        vote_average: data.vote_average,
        username: user.toJSON().username,
        roleuser: req.role,
        userId: user.toJSON().id,
      });

      await db.CategoryHasMovies.create({
        categoryId: cat[0].id,
        movieId: newMovie.toJSON().id,
      });
      return responce({
        res,
        code: 201,
        message: "ok : inser movie",
        data: newMovie,
      });
    } catch (error) {
      console.log(error)
      return responce({
        res,
        code: 500,
        message: "Request Blocked",
      });
    }
  }

  async deleteMovie(req, res) {
    const { username, movieid, movietitle } = req.query;
    if (movieid) {
      try {
        const upMovie = await db.Movies.destroy({
          where: { id: Number(movieid) },
        });
        return responce({
          res,
          code: 200,
          message: `ok : remove movie${movietitle}`,
          data: upMovie,
        });
      } catch (error) {
        return responce({
          res,
          code: 400,
          message: "error",
          data: error,
        });
      }
    }
  }
  async getAllmovies(req, res) {
    try {
      const Movie = await db.Movies.findAll();
      console.log(Movie)
      return responce({
        res,
        code: 200,
        message: `ok`,
        data: Movie,
      });
    } catch (error) {
      return responce({
        res,
        code: 400,
        message: "error",
        data: error,
      });
    }
  }

  async updateMovie(req, res) {
    const { userid, movieid, movietitle } = req.query;
    if (!movieid) {
      return responce({
        res,
        code: 400,
        message: `badrequest`,
      });
    }
    if (!userid) {
      return responce({
        res,
        code: 400,
        message: `badrequest`,
      });
    }

    const user = await db.user.findOne({ where: { id: Number(userid) } });
    if (!user) {
      return responce({
        res,
        code: 400,
        message: `badrequest`,
      });
    }

    const movie=await db.Movies.findOne({where:{id:movieid}})
    if (!movie) {
      return responce({
        res,
        code: 400,
        message: `badrequest`,
      });
    }
    if (req.body?.genre_ids && movieid) {
      try {
        const dataimg = {};
        if (req.file !== undefined && req.file !== null) {
          dataimg.poster_path = req.file.path.replace(/\\/g, "/").substring(6);
          req.body.poster_path = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${dataimg.poster_path}`;
        } else {
          req.body.poster_path = movie.toJSON().poster_path;
        }
        const data = {
          ...req.body,
          genre_ids: JSON.stringify([Number(req.body?.genre_ids)]),
          username: user.toJSON().username,
          userid: user.toJSON().id,
          roleuser: user.toJSON().roleuser,
        };
    
        let cat = await db.Category.findAll({
          attributes: ["id"],
          where: { bits: Number(req.body?.genre_ids) },
        });
        cat = JSON.parse(JSON.stringify(cat));
        if (!cat && cat?.length < 1) {
          return responce({
            res,
            code: 400,
            message: `error`,
          });
        }
        const upMovie = await db.Movies.update(data, {
          where: { id: movieid },
        });
        await db.CategoryHasMovies.update(
          {
            categoryId: cat[0].id,
            movieId: Number(movieid),
          },
          { where: { movieId: Number(movieid) } }
        );

        return responce({
          res,
          code: 200,
          message: `ok : update movie${movie?.toJSON().title}`,
          data: upMovie,
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: `error`,
        });
      }
    } else {
      const dataimg = {};
      if (req.file !== undefined && req.file !== null) {
        dataimg.poster_path = req.file.path.replace(/\\/g, "/").substring(6);
        req.body.poster_path = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${dataimg.poster_path}`;
      } else {
        req.body.poster_path = movie.toJSON().poster_path;
      }
      const data = {
        ...req.body,
        username: user.toJSON().username,
        userid: user.toJSON().id,
        roleuser: user.toJSON().roleuser,
      };
      try {
        const upMovie = await db.Movies.update(data, {
          where: { id: Number(movieid) },
        });

        return responce({
          res,
          code: 200,
          message: `ok : update movie${movie?.toJSON().title}`,
          data: upMovie,
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "error",
          data: error,
        });
      }
    }
  }

  async getCountMovie(req, res) {
    try {
      const movieusername = await db.Movies.findAll({
        attributes: ["username", "id"],
      });

      let user = [];
      if (movieusername) {
        let arr = null;
        movieusername?.map((item, i) => {
          arr = new Set();
          arr.add(item.username);
        });
        arr.forEach((element) => {
          user.push(element);
        });
      }
      return responce({
        res,
        code: 200,
        message: "ok",
        data: user,
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

  async getAllmovie(req, res) {
    // get all movie full option

    if (req.query?.category && req.query?.username && req.query?.all) {
      try {
        const category = req.query?.category;
        const username = req.query?.username;
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const movies = await db.Movies.findAll(
          paginate(
            {
              where: { username: username },
              include: [
                {
                  model: db.Category,
                  where: { bits: category },
                  required: true,
                },
              ],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          include: [
            {
              model: db.Category,
              where: { bits: category },
              required: true,
              through: { attributes: [] },
            },
          ],
          raw: true,
          where: { username: username },
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

    // get all movie __remove option.all
    else if (req.query?.category && req.query?.username) {
      try {
        const category = Number(req.query?.category);
        const username = req.query?.username;
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const movies = await db.Movies.findAll(
          paginate(
            {
              where: { username: username },
              include: [
                {
                  model: db.Category,
                  where: { bits: category },
                  required: true,
                },
              ],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          include: [
            {
              model: db.Category,
              where: { bits: category },
              required: true,
              through: { attributes: [] },
            },
          ],
          where: { username: username },
          raw: true,
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
    // get all movie ______ option.username
    else if (req.query?.username && !req.query?.category) {
      try {
        const pageSize = Number(req.query.pageSize);
        const page = Number(req.query.page);
        const username = req.query?.username;
        const movies = await db.Movies.findAll(
          paginate(
            {
              where: { username: username },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          where: { username: username },
          raw: true,
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

    // get all movie __option.category
    else if (req.query?.category && !req.query?.username) {
      try {
        const category = Number(req.query?.category);
        const pageSize = Number(req.query.pageSize);
        const page = Number(req.query.page);
        const movies = await db.Movies.findAll(
          paginate(
            {
              include: [
                {
                  model: db.Category,
                  where: { bits: category },
                  required: true,
                },
              ],
              order: [["id", "DESC"]],
              row: true,
            },
            { page, pageSize }
          )
        );
        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          include: [
            {
              model: db.Category,
              where: { bits: category },
              required: true,
              through: { attributes: [] },
            },
          ],
          raw: true,
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
    // get all movie __ option.page & pageSize
    else if (
      req.query.page &&
      req.query?.pageSize &&
      !req.query?.category | !req.query?.username
    ) {
      const pageSize = Number(req.query.pageSize);
      const page = Number(req.query.page);
      try {
        const movies = await db.Movies.findAll(
          paginate(
            {
              include: [{ model: db.Category }],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
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
        responce({
          res,
          code: 500,
          message: "fail",
          data: error,
        });
      }
      return;
    }
    //get all movie ___option.all
    else if (req.query?.all) {
      try {
        const page = 1;
        const pageSize = 1000;
        const movies = await db.Movies.findAll(
          paginate(
            {
              include: [{ model: db.Category }],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
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
    //get all movie ___option.search
    else if (req.query?.search) {
      try {
        const page = 1;
        const pageSize = 1000;
        const value = "%" + req.query.search + "%";
        const movies = await db.Movies.findAll(
          paginate(
            {
              where: {
                title: {
                  [Op.substring]: req.query.search,
                },
              },
              include: [{ model: db.Category }],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );

        const count = await db.Movies.findOne({
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
          ],
          raw: true,
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
    try {
      const movies = await db.Movies.findAll({
        include: [{ model: db.Category }],
      });
      const count = await db.Movies.findOne({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "countMovies"],
        ],
        order: [["id", "DESC"]],
        raw: true,
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
      responce({
        res,
        code: 500,
        message: "fail",
        data: error,
      });
    }
  }

  async getMovieByUser(req, res) {}
  async FilterMovies(req, res) {
    if (req.query?.search) {
      try {
        const movies = await db.Movies.findAll({
          where: {
            title: {
              [Op.substring]: req.query.search,
            },
          },
          include: [{ model: db.Category }],
          order: [["id", "DESC"]],
        });
        if (!movies) {
          return responce({
            res,
            code: 403,
            message: "notfound",
          });
        }
        return responce({
          res,
          code: 200,
          message: "success",
          data: movies,
        });
      } catch (error) {
        return responce({
          res,
          code: 500,
          message: "Blocked Request",
          data: error,
        });
      }
    }
  }
})();
