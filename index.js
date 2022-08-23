const { bottom } = require("cli-color/move");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Telegraf, Scenes } = require("telegraf");
const { linkOl, parseData } = require("./parsing");
const db = require("./model/index");
const bot = new Telegraf(process.env.token);
const User = db.user;
require("./model");
let shart = 0;
bot.start(async (ctx) => {
  console.log(ctx.update.message);
  const id = ctx.update.message.from.id;

  const username = ctx.update.message.from.username || "No username";
  const user = await User.findOne({ where: { telegram_id: id } });
  if (!user) {
    const create = await User.create({
      username,
      telegram_id: id,
    });
  }

  ctx.telegram.sendMessage(
    id,
    `Salom @${username}!\n Botga hush kelibsiz Bu bot Muztv.net saytidan qo'shiq qidirish uchun yaratildi qo'shiq nomini yoki qo'shiqchi nomini kiriting`
  );
});

bot.on("text", async (ctx) => {
  const id = ctx.update.message.from.id;
  const username = ctx.update.message.from.username || "No username";
  const text = ctx.update.message.text.trim().toLowerCase();
  const data = await parseData(text);
  console.log(data);
  let arr = [];
  let litleArr = [];
  let litleArr2 = [];
  let optionArr = [
    {
      text: "🔙",
      callback_data: "back",
    },
    {
      text: "🔜",
      callback_data: "next",
    },
  ];
  let obj = {};

  let kattaText = `Jami Musiqalar  -  <b>${data.length}</b>\n\n`;
  for (let i = 0; i < 10; i++) {
    obj.text = i + 1;
    obj.callback_data = data[i].name;

    if (i < 5) {
      litleArr.push(obj);
    } else {
      litleArr2.push(obj);
    }
    let parseMusicText = `<b>${i + 1}</b> - <b><i>${data[i].name}</i></b>\n`;
    kattaText += parseMusicText;
    obj = {};
  }
  arr.push(litleArr);
  arr.push(litleArr2);
  arr.push(optionArr);

  console.log(arr);
  ctx.telegram.sendMessage(id, `${kattaText}`, {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: arr },
    resize_keyboard: true,
  });
});

bot.on("callback_query", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const data = ctx.update.callback_query.data;
  console.log(ctx.update.callback_query);
});

bot.launch();
