export const subscription = (sequelize, DataTypes) => {
    const subscription = sequelize.define(
      "subscription",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        account: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        mobile: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.TEXT('long'),
          allowNull: false,
        },
        month: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        userid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
        timestamps:true
      },

    
    );
    subscription.associate=(model)=>{
      subscription.belongsToMany(model.user, {
        through: model.Transaction,
        foreignKey: { name: "subscriptionId", type: DataTypes.INTEGER },
      });
    }
    return subscription;
  };
  