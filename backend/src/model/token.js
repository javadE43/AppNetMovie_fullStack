
export const  Token =(sequelize,DataTypes)=>{
    const Token=sequelize.define("token",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },

    },{
        timestamps:true,
        freezeTableName:true,

    })

    return Token
}