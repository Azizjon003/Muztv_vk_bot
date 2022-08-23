const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Telegraf } = require("telegraf");

const telegram = new Telegraf(process.env.token);
require("./model");
telegram.start((ctx) => {
  console.log(ctx.update.message);
  const id = ctx.update.message.from.id;
  console.log(id);
  const username = ctx.update.message.from.username;
  ctx.telegram.sendMessage(
    id,
    "Salom Bizning bot hali ishga tushgani yo'q bir ikki kunda ishga tushadi"
  );
});

telegram.launch();
