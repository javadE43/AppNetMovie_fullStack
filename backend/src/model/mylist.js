export const mylistModel = (sequelize, DataTypes) => {
  const mylist = sequelize.define(
    "mylist",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        defaultValue: null,
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
          const rawValue = this.getDataValue('genre_ids');
          return rawValue ? JSON.parse(rawValue) : null;
        }
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
        type: DataTypes.TEXT('long'),
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
      movieid: {
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
      categoryTitle: {
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
      hooks:{
        beforeCreate:(mylist,option)=>{
          console.log(mylist.genre_ids)
          let genre=mylist.genre_ids
          if (mylist.genre_ids !== null) {
            genre= JSON.stringify(mylist.genre_ids)
          }
          mylist.genre_ids=genre;
        }
      }
    }
  );

  return mylist;
};
