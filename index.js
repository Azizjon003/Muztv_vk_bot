const { bottom } = require("cli-color/move");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const { Telegraf, Scenes } = require("telegraf");
const { linkOl, parseData, musicParser } = require("./parsing");

const db = require("./model/index");
const pageFunc = require("./utility/pagination");

const bot = new Telegraf(process.env.token, {
  polling: true,
});

let mal;
const User = db.user;

let start = 0;
let end = 10;
let umumiy = [];
let qidirish;
let umum = {};
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
  qidirish = text;
  mal = await parseData(text);
  end = end < 10 ? mal.length : 10;
  let umumInfo = await pageFunc(mal, start, end);
  const kattaText = umumInfo.kattaText;
  const arr = umumInfo.arr;
  start = umumInfo.start;
  end = umumInfo.end;
  ctx.telegram.sendMessage(id, kattaText, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: arr,
    },
  });
});

bot.on("callback_query", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const data = ctx.update.callback_query.data;
  const deleteM = ctx.update.callback_query.message.message_id;
  if (data == "stop") {
    ctx.telegram.deleteMessage(id, deleteM);
    umumiy = [];
  }

  if (data == "next") {
    console.log(umumiy);

    start = start + 10;
    end = end + 10 > mal.length ? mal.length - end : end + 10;
    ctx.telegram.deleteMessage(id, deleteM);
    let umum = await pageFunc(mal, start, end);
    const kattaText = umumInfo.kattaText;
    const arr = umumInfo.arr;
    start = umumInfo.start;
    end = umumInfo.end;
    ctx.telegram.sendMessage(id, kattaText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: arr,
      },
    });
  }
});

bot.launch();
