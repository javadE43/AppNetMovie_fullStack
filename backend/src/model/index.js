import { Sequelize, DataTypes } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
import { userModel } from "./userModel.js";
import { role } from "./role.js";
import { Permission } from "./permission.js";
import { RoleHasPermission } from "./role_has_premission.js";
import { RoleHasUser } from "./role_has_user.js";
import { Token } from "./token.js";
import { review } from "./review.js";
import {mylistModel} from "./mylist.js"
import {ratings} from "./ratings.js"
import { createRequire } from "module";
import { transaction } from "./transaction.js";
import { subscription } from "./subscription.js";
import { movies } from "./Movies.js";
import { category } from "./category.js";
import { categoryHasMovies } from "./categoryHasMovies.js";
const require = createRequire(import.meta.url);
const env = process.env.NODE_ENV || "production";

const config = require("../../config/configDB.json")[env];
const db = {};
let sequelize;
// config database
if (config.use_env_variable) {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT_MYSQL,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`
  );
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${ process.env.DATABASE}\`;`
  );
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
    {
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci', 
        timestamps: true
      },
    }
  );
}

// model
db.user = userModel(sequelize, DataTypes);
db.Role = role(sequelize, DataTypes);
db.Permission = Permission(sequelize, DataTypes);
db.RoleHasPermission = RoleHasPermission(sequelize, DataTypes);
db.RoleHasUser = RoleHasUser(sequelize, DataTypes);
db.Token = Token(sequelize, DataTypes);
db.Mylist = mylistModel(sequelize, DataTypes);
db.Review = review(sequelize, DataTypes);
db.Ratings = ratings(sequelize, DataTypes);
db.Transaction = transaction(sequelize, DataTypes);
db.Subscription = subscription(sequelize, DataTypes);
db.Movies = movies(sequelize, DataTypes);
db.Category = category(sequelize, DataTypes);
db.CategoryHasMovies = categoryHasMovies(sequelize, DataTypes);
// associate
Object.keys(db).forEach((models) => {
  if (db[models].associate) {
    db[models].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => {
    // console.log("connected...!");
  })
  .catch((err) => {
    // console.log("ERR" + err);
  });

db.ROLES = ["admin", "user"];

export default db;
