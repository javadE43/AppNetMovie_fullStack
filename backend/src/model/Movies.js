export const movies = (sequelize, DataTypes) => {
  const movies = sequelize.define(
    "movies",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      adult: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      backdrop_path: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      genre_ids: {
        type: DataTypes.STRING,
        drfaultValue: null,
        get() {
          const rawValue = this.getDataValue("genre_ids");
          return rawValue ? JSON.parse(rawValue) : null;
        },
      },
      original_language: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      original_title: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      overview: {
        type: DataTypes.TEXT("long"),
        defaultValue: null,
      },

      popularity: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      poster_path: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      release_date: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      video: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      vote_average: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      vote_count: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      media_type: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      roleuser: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      movieid: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      username: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      userId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      hooks: {
        beforeCreate: (movies, option) => {
          let genre = movies.genre_ids;
          if (movies.genre_ids !== null) {
            genre = JSON.stringify(movies.genre_ids);
          }
          movies.genre_ids = genre;
        },
      },
    }
  );
  movies.associate = (model) => {
    movies.belongsToMany(model.Category, {
      through: model.CategoryHasMovies,
      foreignKey: { name: "movieId", type: DataTypes.INTEGER },
    });
  };
  return movies;
};
