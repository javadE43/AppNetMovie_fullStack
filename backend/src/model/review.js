export const review = (sequelize, DataTypes) => {
  const review = sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      content: {
        type: DataTypes.STRING(),
        defaultValue: null,
      },
      username: {
        type: DataTypes.STRING(),
        drfaultValue: null,
      },
      image: {
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
      userId: {
        type: DataTypes.INTEGER(),
        drfaultValue: null,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
  return review;
};
