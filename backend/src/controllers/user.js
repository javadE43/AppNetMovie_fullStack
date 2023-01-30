import { validationResult } from "express-validator";

import * as dotenv from "dotenv";
dotenv.config();
import db from "../model/index.js";
import { Op } from "sequelize";
import sequelize from "sequelize";
import { responce } from "../util/configResponce.js";
import { paginate } from "../helper/paginate.js";
import bcrypt from "bcrypt";

export const updateUser = async function (req, res) {

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return responce({
      res,
      code: 400,
      message: "The information entered is incorrect",
      data: error.array(),
    });
  }

  if (!req.body.username) {
    return responce({
      res,
      message: "data invalid",
      code: 400,
      data: {},
    });
  }
 
  if (req.body.confirm && req.body.password && req.body.confirm !== req.body.password ) {
    return responce({
      res,
      message: "رمز ورود مطابقت ندارد",
      code: 401,
    });
  }
  if (!req.body.confirm && req.body.password) {
    return responce({
      res,
      message: "رمز ورود مطابقت ندارد",
      code: 401,
    });
  }

  const user = await db.user.findOne({
    where: { id: req.params.id },
  });

  if (!user) {
    return responce({
      res,
      message: "There is no user",
      code: 403,
    });
  }

  const data = {};
  if (req.file !== undefined && req.file !== null) {
    data.image = req.file.path.replace(/\\/g, "/").substring(6);
    req.body.image = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}/${data.image}`;
  } else {
    req.body.image = user.image;
  }
  await db.RoleHasUser.destroy({ where: { userId: user.toJSON().id } });
  // check roles
  if (db.ROLES.includes(req.body.roleuser)) {
    const Role = await db.Role.findOne({ where: { name: req.body.roleuser } });
    await db.RoleHasUser.create({
      roleId: Role.toJSON().id,
      userId: user.toJSON().id,
    });
  } else {
    const Role = await db.Role.findOne({ where: { name: db.ROLES[1] } });
    await db.RoleHasUser.create({
      roleId: Role.toJSON().id,
      userId: user.toJSON().id,
    });
  }
  if (req.body?.password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    try {
      const updatedRows = await db.user.update(
        { ...req.body, password: passwordHash },
        {
          where: { id: req.params.id },
        }
      );
      return res.status(200).json(updatedRows);
    } catch (err) {
      return responce({
        res,
        message: "Blocked Request",
        code: 500,
      });
    }
  } else {
    try {
      const updatedRows = await db.user.update(req.body, {
        where: { id: req.params.id },
      });
      const user=await db.user.findOne({where:{id:req.params.id}})
      return responce({
        res,
        message: "edited",
        code: 200,
        data: user,
      });
    } catch (err) {
      return responce({
        res,
        message: "Blocked Request",
        code: 500,
      });
    }
  }
};

// delete user
export const deleteuser = async function (req, res) {
  if (!req.params.id) {
    responce({
      res,
      code: 400,
      message: `There is no user ID `,
      data: {},
    });
  }
  try {
    const deleteuser = await db.user.destroy({
      where: { id: req.params.id },
    });
    const user=await db.user.findOne({where:{id:req.params.id}})

    responce({
      res,
      code: 200,
      message: `User deleted`,
      data: user,
    });
  } catch (err) {
    responce({
      res,
      code: 500,
      message: `Blocked Request`,
      data: err,
    });
  }
};
// createUser
export const createUser = async function (req, res) {

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return responce({
      res,
      code: 400,
      message: "The information entered is incorrect",
      data: error.array(),
    });
  }

  if(!req.body?.username && !req.body?.email && !req.body.password){
    return res.status(400).send("")
  }
  
  const user = await db.user.findOne({
    where: {
      [Op.and]: [{ username: req.body.username }, { email: req.body.email }],
    },
  });
  if (req.body.confirm && req.body.password && req.body.confirm !== req.body.password ) {
    return responce({
      res,
      message: "رمز ورود مطابقت ندارد",
      code: 403,
    });
  }
  if (user) {
    return res.status(409).send("نام کاربری و ایمیل از قبل وجود دارد");
  }
  const userdublicateUsername = await db.user.findOne({
    where: { username: req.body.username },
  });
  if (userdublicateUsername) {
    return res.status(409).send("نام کاربری از قبل وجود دارد");
  }

  if (!req.body.username && !req.body.email) {
    return res.status(401).send("اطلاعات درست وارد نشده");
  }
  if (!req.body.password) {
    return res.status(401).send("رمز ورود درست وارد نشده");
  }
  const data = {};
  if (req.file !== undefined && req.file !== null) {
    data.image = req.file.path.replace(/\\/g, "/").substring(6);
    req.body.image = `http://${process.env.HOSTNAMESERVER}:${process.env.PORTSR}${data.image}`;
  } else {
    req.body.image = null;
  }
  try{
    const newUser = await db.user.create(
      {
        username: req.body.username,
        mobile: req.body.mobile,
        email: req.body.email,
        image: req.body.image,
        password: req.body.password,
        roleuser: req.body.roleuser ? req.body.roleuser : "user",
        role: [{}],
      },
      {
        include: db.Role,
      }
    );
    // check roles
    if (db.ROLES.includes(req.body.roleuser)) {
      const Role = await db.Role.findOne({ where: { name: req.body.roleuser } });
      await db.RoleHasUser.create({
        roleId: Role.toJSON().id,
        userId: newUser.toJSON().id,
      });
    } else {
      const Role = await db.Role.findOne({ where: { name: db.ROLES[1] } });
      await db.RoleHasUser.create({
        roleId: Role.toJSON().id,
        userId: newUser.toJSON().id,
      });
    }
    responce({
      res,
      code: 201,
      message: `create user ${req.body.username}`,
      data: newUser,
    });
  }catch(error){
    responce({
      res,
      code: 500,
      message: `Request Blocked`,
    });
  }
};

//getUser

export const getUser = async function (req, res) {
  try {
    let user = await db.user.findOne({
      where: { id: req.params.id },
      include: db.Role,
    });
    return responce({
      res,
      code: 200,
      message: "ok",
      data: user,
    });
  } catch (err) {
    return responce({
      res,
      code: 200,
      message: "ok",
      data: err,
    });
  }
};
//getCountUsersByRole

export const getCountUsersByRole = async function (req, res) {
  try {
    const user = await db.user.findAll({
      attributes: ["username", "id", "roleuser"],
      include: [
        {
          model: db.Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });
    const users = await db.user.findAll({});

    const roles = user.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => {
          return t.roleuser === item.roleuser;
        })
    );
    return responce({
      res,
      code: 200,
      message: "ok",
      data: { roles, users },
    });
  } catch (error) {
    return responce({
      res,
      code: 500,
      message: "fail",
      data: error,
    });
  }
};

// getAllUsers
export const getAllUser = async function (req, res) {
  //role and page
  if (req.query.role && req.query.page) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 3;
    try {
      const users = await db.user.findAll(
        paginate(
          {
            include: [
              {
                model: db.Role,
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
            where: { roleuser: req.query.role },
            order: [
              ["id", "DESC"],
              //   ["cityName", "ASC"],
            ],
          },
          { page, pageSize }
        )
      );
      const count = await db.user.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        raw: true,
        where: { roleuser: req.query?.role },
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: [users, { count: count }],
      });
    } catch (err) {
      responce({
        res,
        code: 500,
        message: "fail",
        data: err,
      });
    }
  }
  //role
  else if (req.query.role && !req.query.page) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 1000;
    try {
      const users = await db.user.findAll(
        paginate(
          {
            include: [
              {
                model: db.Role,
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
            where: { roleuser: req.query.role },
            order: [
              ["id", "DESC"],
              //   ["cityName", "ASC"],
            ],
          },
          { page, pageSize }
        )
      );
      const count = await db.user.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        raw: true,
        where: { roleuser: req.query?.role },
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: [users, { count: count }],
      });
    } catch (err) {
      responce({
        res,
        code: 500,
        message: "fail",
        data: err,
      });
    }
  }
  //search
  else if (req.query.search) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 1000;
    try {
      const users = await db.user.findAll(
        paginate(
          {
            include: [
              {
                model: db.Role,
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
            where: {
              username: {
                [Op.substring]: req.query.search,
              },
            },
            order: [
              ["id", "DESC"],
              //   ["cityName", "ASC"],
            ],
          },
          { page, pageSize }
        )
      );
      const count = await db.user.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        raw: true,
        where: {
          username: {
            [Op.substring]: req.query.search,
          },
        },
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: [users, { count: count }],
      });
    } catch (err) {
      responce({
        res,
        code: 500,
        message: "fail",
        data: err,
      });
    }
  }

  //pageination
  else if (
    req.query.pageSize &&
    req.query.page &&
    !req.query?.search &&
    !req.query?.role
  ) {
    const page = req.query?.page ? Number(req.query.page) : 1;
    const pageSize = req.query?.pageSize ? Number(req.query.pageSize) : 1000;
    try {
      const users = await db.user.findAll(
        paginate(
          {
            include: [
              {
                model: db.Role,
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
            order: [
              ["id", "DESC"],
              //   ["cityName", "ASC"],
            ],
          },
          { page, pageSize }
        )
      );
      const count = await db.user.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        raw: true,
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: [users, { count: count }],
      });
    } catch (err) {
      responce({
        res,
        code: 500,
        message: "fail",
        data: err,
      });
    }
  } else
    try {
      const users = await db.user.findAll({
        include: [
          {
            model: db.Role,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
        order: [
          ["id", "DESC"],
          //   ["cityName", "ASC"],
        ],
      });
      const count = await db.user.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        raw: true,
      });
      return responce({
        res,
        code: 200,
        message: "ok",
        data: [users, { count: count }],
      });
    } catch (err) {
      responce({
        res,
        code: 500,
        message: "fail",
        data: err,
      });
    }
};

// // //GET USER STATS

export const getUserStats = async function (req, res) {
  // income
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  const lM = lastMonth.getMonth();
  const pM = previousMonth.getMonth();
  const pMonth = await db.user.findAll({
    attributes: [
      "id",
      [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")), "month"],
      [db.Sequelize.fn("count", db.Sequelize.col("email")), "totalUser"],
    ],
    where: {
      [Op.in]: {
        [Op.and]: [
          db.Sequelize.where(
            db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
            lM
          ),
          db.Sequelize.where(
            db.Sequelize.fn("YEAR", db.Sequelize.col("createdAt")),
            2022
          ),
        ],
      },
    },
    order: [["createdAt", "DESC"]],
  });

  const lMonth = await db.user.findAll({
    attributes: [
      "id",
      [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")), "month"],
      [db.Sequelize.fn("count", db.Sequelize.col("email")), "totalUser"],
    ],
    where: {
      [Op.in]: {
        [Op.and]: [
          db.Sequelize.where(
            db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")),
            pM
          ),
          db.Sequelize.where(
            db.Sequelize.fn("YEAR", db.Sequelize.col("createdAt")),
            2022
          ),
        ],
      },
    },
    order: [["createdAt", "DESC"]],
  });

  const data = new Promise((resolve, reject) => {
    if (lMonth && pMonth) {
      resolve([...lMonth, ...pMonth]);
    } else {
      rej("error");
    }
  });

  data.then((data) => {
    let response = JSON.parse(JSON.stringify(data));
    let count = (response[1].totalUser * 100) / response[0].totalUser - 100;
    res.json({
      data: [{ countDifference: count }, ...data],
      message: "success",
      status: 200,
    });
  });
};
