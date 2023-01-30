export const category = (sequelize, DataTypes) => {
  const category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bits: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      content: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  category.associate = (models) => {
    category.belongsToMany(models.Movies, {
      through: models.CategoryHasMovies,
      foreignKey: "categoryId",
    });
  };
  return category;
};
