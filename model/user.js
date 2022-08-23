const userTg = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telegram_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  });
  return user;
};
module.exports = userTg;
