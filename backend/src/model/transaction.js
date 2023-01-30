export const transaction = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      resnumber: {
        type: DataTypes.STRING,
        // allowNull: false,
        defaultValue: null,
      },
      amount: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      payment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      timestamps:true
    }
  );
  return transaction;
};
