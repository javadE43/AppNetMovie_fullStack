import bcrypt from "bcrypt"
export const userModel = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        defaultValue: null,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(),
        defaultValue: null,
      },
      mobile: {
        type: DataTypes.STRING(),
        drfaultValue: null,
      },
      email: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      password: {
        type: DataTypes.STRING(100),
      },
      roleuser: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      profile: {
        type: DataTypes.TEXT('long'),
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      hooks:{
        beforeSave:async(user,option)=>{
            const salt=await bcrypt.genSalt(10)
            const passwordHash=await bcrypt.hash(user.password,salt)
            user.password=passwordHash;
            console.log(user)
        }
      }
    }
  );
  user.associate=(model)=>{
    user.hasMany(model.Token, {
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.hasMany(model.Mylist, {
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.hasMany(model.Review, {
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.hasMany(model.Ratings, {
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.belongsToMany(model.Subscription, {
      through: model.Transaction,
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.hasMany(model.Movies, {
      foreignKey: { name: "userId", type: DataTypes.INTEGER },
    });
    user.belongsToMany(model.Role, {
      through: model.RoleHasUser,
      foreignKey: {
         name: "userId",
       type: DataTypes.INTEGER },
    });
  }

  return user;
};
