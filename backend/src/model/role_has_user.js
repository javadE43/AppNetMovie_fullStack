
export const  RoleHasUser =(sequelize,DataTypes)=>{
    const RoleHasUser=sequelize.define("role_has_User",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true,
          },

    },{
        timestamps:true,
        freezeTableName:true,

    })

    return RoleHasUser
}