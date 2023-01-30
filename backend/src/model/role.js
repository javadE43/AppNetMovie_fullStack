
export const role=(sequelize,DataTypes)=>{

const role=sequelize.define("role",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    bit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
},{
    freezeTableName:true
})

role.associate=(models)=>{
    role.belongsToMany(models.user,{
        through: models.RoleHasUser,
        foreignKey: "roleId",
        otherKey: "userId"
      })
    role.belongsToMany(models.Permission,{
      through:models.RoleHasPermission,
      foreignKey: "roleId",
      otherKey: "permissionId"
    })
}

return role;

}