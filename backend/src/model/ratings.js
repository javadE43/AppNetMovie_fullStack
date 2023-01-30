export const ratings = (sequelize, DataTypes) => {
    const ratings = sequelize.define(
      "ratings",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(),
          drfaultValue: null,
        },
        movietitle: {
          type: DataTypes.STRING(),
          drfaultValue: null,
        },
        movieid: {
          type: DataTypes.STRING(),
          drfaultValue: null,
        },
        ratings: {
          type: DataTypes.INTEGER(),
          drfaultValue: null,
        },
        userId:{
          type: DataTypes.INTEGER(),
          drfaultValue: null,
        }

      },
      {
        freezeTableName: true,
        timestamps: true,
      }
    );
    return ratings;
  };
  