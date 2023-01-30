
export const  Permission =(sequelize,DataTypes)=>{
    const Permission=sequelize.define("permission",{
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
          bit: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },

    },{
        freezeTableName:true,
    })

    Permission.associate=(models)=>{
        Permission.belongsToMany(models.Role,{
            through:models.RoleHasPermission,
                foreignKey: "permissionId",
                otherKey: "roleId"
        })
    }
    return Permission
}