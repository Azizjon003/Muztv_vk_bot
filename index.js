const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Telegraf } = require("telegraf");

const telegram = new Telegraf(process.env.token);
telegram.start((ctx) => {
  ctx.reply("Bizning botga xush kelibsiz!");
});

telegram.launch();
