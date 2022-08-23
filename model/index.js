const { Sequelize, DataTypes } = require("sequelize");
const cli = require("cli-color");
const sequelize = new Sequelize("muztv", "postgres", "13112003", {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      cli.blueBright("Connection has been established successfully.")
    );
  })
  .catch((err) => {
    console.log(cli.red("Unable to connect to the database:", err));
  });
const db = {};
db.sequelize = sequelize;
module.exports = db;
db.user = require("./user")(sequelize, DataTypes);
db.music = require("./music")(sequelize, DataTypes);

// db.sequelize
//   .sync({ force: true, alter: true })
//   .then(() => {
//     console.log(cli.blueBright("Database & tables created!"));
//   })
//   .catch((err) => {
//     console.log(cli.red("Unable to create database:", err));
//   });
