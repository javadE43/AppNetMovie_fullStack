
export const  RoleHasPermission =(sequelize,DataTypes)=>{
    const RoleHasPermission=sequelize.define("role_has_permission",{
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

    return RoleHasPermission
}