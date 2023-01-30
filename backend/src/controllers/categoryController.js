import { validationResult } from "express-validator";
import * as dotenv from "dotenv";
dotenv.config();

import db from "../model/index.js";
import { responce } from "../util/configResponce.js";
import { Op } from "sequelize";
import sequelize from "sequelize";
import { paginate } from "../helper/paginate.js";
import { categoryMovies } from "../util/categoryData.js";

export const categoryController = new (class CategoryController {
  constructor() {}

  async insertCategory(req, res) {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return responce({
        res,
        code: 400,
        message: "The information entered is incorrect",
        data: error.array(),
      });
    }

    if (!req.query.userid) {
      return responce({
        res,
        message: "Your authentication was not approved to create a category ",
        code: 400,
      });
    }
    const user = await db.user.findOne({
      where: { id: Number(req.query.userid) },
    });
    if (!user) {
      return responce({
        res,
        message: "There is no user",
        code: 400,
      });
    }
    const { bits, content, image, title } = req.body;
    if (!bits && !title) {
      return responce({
        res,
        message: "There is no title",
        code: 400,
      });
    }
    const dublicateCategory = await db.Category.findOne({
      where: { title: title },
    });
    if (dublicateCategory) {
      return responce({
        res,
        message: "already category",
        code: 409,
      });
    }
    const dataimg = {};
    if (req.file !== undefined && req.file !== null) {
      dataimg.image = req.file.path.replace(/\\/g, "/").substring(6);
      req.body.image = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${dataimg.image}`;
    } else {
      req.body.image = null;
    }
    try {
      const newcategory = await db.Category.create({
        ...req.body,
        username: user.toJSON().username,
        userid: user.toJSON().id,
      });
      if (newcategory) {
        return responce({
          res,
          message: `The ${title} category was created`,
          code: 201,
          data: newcategory,
        });
      }
    } catch (error) {
      responce({
        res,
        message: "line in creating a new category",
        code: 500,
        data: error,
      });
    }
  }
  async getCategory(req, res) {
    //Category filter based on username and category ID
    if (req.query?.userid && req.query.bits) {
      const page = req.query?.page ? Number(req.query?.page) : 1;
      const pageSize = req.query?.pageSize ? Number(req.query?.pageSize) : 1;
      const userid = Number(req.query?.userid);
      const bits = Number(req.query?.bits);
      try {
        const categorys = await db.Category.findAll(
          paginate(
            {
              where: { [Op.and]: [{ userid: userid }, { bits: bits }] },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          include: [
            {
              model: db.Movies,
              where: { userid: userid },
              required: true,
              through: { attributes: [] },
            },
          ],
          raw: true,
          where: { [Op.and]: [{ userid: userid }, { bits: bits }] },
        });
        return responce({
          res,
          message: "The request was made successfully",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        responce({
          res,
          message: "The request was blocked",
          code: 500,
        });
      }
    }
    //Filter by Category ID
    else if (req.query?.bits) {
      const page = 1;
      const pageSize = 1;
      const bits = Number(req.query?.bits);
      try {
        const categorys = await db.Category.findAll(
          paginate(
            {
              where: { bits: bits },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        if (!categorys) {
          return responce({
            res,
            message: "There are no categories",
            code: 403,
          });
        }
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          raw: true,
          where: { bits: bits },
        });
        return responce({
          res,
          message: "The request was made successfully ",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        return responce({
          res,
          message: "Blocked request",
          code: 500,
        });
      }
    }
    //Filter by Category ID
    else if (req.query?.userid && !req.query?.bits) {
      const page = req.query?.page ? Number(req.query?.page) : 1;
      const pageSize = req.query?.pageSize ? Number(req.query?.pageSize) : 1;
      const userid = Number(req.query?.userid);
      try {
        const categorys = await db.Category.findAll(
          paginate(
            {
              where: { userid: userid },
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        if (!categorys) {
          return responce({
            res,
            message: "There are no categories",
            code: 403,
          });
        }
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          raw: true,
          where: { userid: userid },
        });
        return responce({
          res,
          message: "The request was made successfully ",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        responce({
          res,
          message: "Blocked request",
          code: 500,
        });
      }
    }
    //Filter by category search
    else if (req.query?.search) {
      const page = req.query?.page ? Number(req.query?.page) : 1;
      const pageSize = req.query?.pageSize ? Number(req.query?.pageSize) : 1000;
      try {
        const categorys = await db.Category.findAll(
          paginate(
            {
              where: {
                title: {
                  [Op.substring]: req.query.search,
                },
              },
              order: [["id", "DESC"]],
              include: [{ model: db.Movies }],
            },
            { page, pageSize }
          )
        );
        if (!categorys) {
          return responce({
            res,
            message: "There are no categories",
            code: 403,
          });
        }
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          raw: true,
          where: {
            title: {
              [Op.substring]: req.query.search,
            },
          },
        });
        return responce({
          res,
          message: "The request was made successfully ",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        responce({
          res,
          message: "Blocked request",
          code: 500,
        });
      }
    } else if (
      req.query?.page &&
      req.query?.pageSize &&
      !req.query?.bits &&
      !req.query?.userid
    ) {
      try {
        const page = req.query?.page ? Number(req.query?.page) : 1;
        const pageSize = req.query?.pageSize
          ? Number(req.query?.pageSize)
          : 1000;
        const categorys = await db.Category.findAll(
          paginate(
            {
              include: [{ model: db.Movies }],
              order: [["id", "DESC"]],
            },
            { page, pageSize }
          )
        );
        if (!categorys) {
          return responce({
            res,
            message: "There are no categories",
            code: 403,
          });
        }
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          raw: true,
        });
        responce({
          res,
          message: "The request was made successfully ",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        return responce({
          res,
          message: "Blocked request",
          code: 500,
          data: error,
        });
      }
    }
    //General filter
    else if (!req.query?.page && !req.query?.pageSize && !req.query?.search) {
      try {
        const categorys = await db.Category.findAll({
          include: [{ model: db.Movies }],
          order: [["id", "DESC"]],
        });
        if (!categorys) {
          return responce({
            res,
            message: "There are no categories",
            code: 403,
          });
        }
        const count = await db.Category.findOne({
          attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
          raw: true,
        });
        return responce({
          res,
          message: "The request was made successfully ",
          code: 200,
          data: { categorys: categorys, count: count },
        });
      } catch (error) {
        responce({
          res,
          message: "Blocked request",
          code: 500,
          data: error,
        });
      }
    }
  }

  //Edit category
  async updateCategory(req, res) {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return responce({
        res,
        code: 400,
        message: "The information entered is incorrect",
        data: error.array(),
      });
    }
    if (!req.query.userid && !req.query?.bits) {
      return responce({
        res,
        message: "Blocked request(userid)&(category.bits)",
        code: 400,
      });
    }

    const user = await db.user.findOne({
      where: { id: Number(req.query.userid) },
    });

    const cat = await db.Category.findOne({
      where: { bits: Number(req.query.bits) },
    });

    if (!user || !cat) {
      return responce({
        res,
        message: "Category and user not found",
        code: 400,
      });
    }

    const { bits, content, image, title } = req.body;

    if (!bits) {
      return responce({
        res,
        message: "There is no category ID",
        code: 400,
      });
    }
    const dataimg = {};
    if (req.file !== undefined && req.file !== null) {
      dataimg.backdrop_path = req.file.path.replace(/\\/g, "/").substring(6);
      req.body.image = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${dataimg.backdrop_path}`;
    } else {
      req.body.image = null;
    }
    if (title) {
      const dublicate = await db.Category.findAll({
        where: {
          bits: [100, 1],
        },
      });
      if (
        dublicate[1].bits === Number(req.query.bits) ||
        dublicate[0].bits === Number(req.query.bits)
      ) {
        return responce({
          res,
          message: "You cannot delete this category",
          code: 409,
        });
      }

      const dublicateCategory = await db.Category.findOne({
        where: {
          title: title,
          [Op.not]: {
            bits: Number(bits),
          },
        },
      });
      if (dublicateCategory) {
        return responce({
          res,
          message: "already category",
          code: 409,
        });
      }
      try {
        const updateCategory = await db.Category.update(
          {
            ...req.body,
            username: user.toJSON().username,
            userid: user.toJSON().id,
          },
          { where: { bits: Number(bits), userid: Number(req.query.userid) } }
        );
        if (updateCategory) {
          return responce({
            res,
            message: "Category edited successfully",
            code: 201,
            data: updateCategory,
          });
        }
      } catch (error) {
        responce({
          res,
          message: "line in category editing",
          code: 500,
          data: error,
        });
      }
    } 
      try {
        const updateCategory = await db.Category.update(
          {
            ...req.body,
            username: user.toJSON().username,
            userid: user.toJSON().id,
          },
          { where: { bits: Number(bits), userid: Number(req.query.userid) } }
        );
        return responce({
            res,
            message: "Category edited successfully",
            code: 200,
            data: updateCategory,
          });
        
      } catch (error) {
        responce({
          res,
          message: "line in category editing",
          code: 500,
          data: error,
        });
      }
  }

  //Remove category
  async removeCategory(req, res) {
    if (!req.query.userid && !req.query?.bits) {
      return responce({
        res,
        message: "There was a problem deleting the category",
        code: 400,
      });
    }
    const user = await db.user.findOne({
      where: { id: Number(req.query.userid) },
    });
    const cat = await db.Category.findOne({
      where: { bits: Number(req.query.bits) },
    });
    if (!user || !cat) {
      return responce({
        res,
        message: "User and category not found",
        code: 400,
      });
    }
    const dublicateCategory = await db.Category.findAll({
      where: {
        bits: [100, 1],
      },
    });
    if (
      dublicateCategory[1].bits === Number(req.query.bits) ||
      dublicateCategory[0].bits === Number(req.query.bits)
    ) {
      return responce({
        res,
        message: "You cannot delete this category",
        code: 409,
      });
    }
    const Bits = Number(req.query?.bits);
    const movies = await db.Movies.findAll({});

    let categoryDefault = await db.Category.findOne({
      where: { bits: categoryMovies.default },
    });

    const arrayMovie = [];
    const userCat = movies.map((item, index) => {
      if (item.genre_ids[0] === Number(Bits)) {
        arrayMovie.push(item.id);
      }
    });

    if (!categoryDefault) {
      categoryDefault = await db.Category.create({
        title: "تعریف نشده",
        bits: categoryMovies?.default,
        image: "عکس وجود ندارد",
        content: "توضیحات",
        username: "پیش فرض",
        userid: 0,
      });
    }

    try {
      const changeCategory = await db.CategoryHasMovies.update(
        { categoryId: categoryDefault.toJSON().id },
        { where: { movieId: arrayMovie } }
      );
      const deleteCategory = await db.Category.destroy({
        where: { bits: Bits },
      });
      if (deleteCategory) {
        return responce({
          res,
          message: `The ${cat.toJSON().title} category has been removed`,
          code: 200,
          data: deleteCategory,
        });
      }
    } catch (error) {
      responce({
        res,
        message: "The request was blocked",
        code: 500,
      });
    }
  }

  //
  async getCountCategory(req, res) {
    try {
      const user = await db.Category.findAll({
        attributes: ["username", "id"],
      });
      const category = await db.Category.findAll({});

      const userCat = user.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => {
            return t.username === item.username;
          })
      );
      return responce({
        res,
        code: 200,
        message: "The request was made successfully",
        data: { userCat, category },
      });
    } catch (error) {
      return responce({
        res,
        code: 500,
        message: "The request was blocked",
        data: error,
      });
    }
  }
})();
