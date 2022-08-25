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
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["user", "admin"],
      defaultValue: "user",
    },
    command: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activ: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return user;
};
module.exports = userTg;
