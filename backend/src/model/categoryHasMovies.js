export const categoryHasMovies = (sequelize, DataTypes) => {
    const categoryHasMovies = sequelize.define(
      "categoryHasMovies",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
      },
      {
        freezeTableName: true,
        timestamps: true,
      }
    );
    return categoryHasMovies;
  };
  