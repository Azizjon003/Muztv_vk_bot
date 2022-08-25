const { bottom } = require("cli-color/move");
const fs = require("fs");
const dotenv = require("dotenv");

require("console-stamp")(console);
dotenv.config({ path: "./config.env" });
const { Telegraf, Scenes } = require("telegraf");
const {
  linkOl,
  parseData,
  musicParser,
  infoUrl,
  parserQism,
  musicLangth,
} = require("./parsing");

const db = require("./model/index");
const pageFunc = require("./utility/pagination");

const bot = new Telegraf(process.env.token, {
  polling: true,
});

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
      username: username,
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
  const mal1 = await musicLangth(text);
  console.log(mal1);
  let start = 0;
  let ended = mal1 < 10 ? mal1 : start + 10;
  let mal = await parserQism(text, start, ended);
  console.log(start, ended);
  let umumInfo = await pageFunc(mal, start, ended, text, mal1);
  const kattaText = umumInfo.kattaText;
  const arr = umumInfo.arr;
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
  // const queryId = ctx.update.callback_query.id;
  console.log(ctx.update);

  if (data == "stop") {
    ctx.telegram.deleteMessage(id, deleteM);
  }

  if (data.includes("next")) {
    console.log("ishla next");

    let end = data.split(" ")[1] * 1;
    const soni = data.split(" ")[2] * 1;
    let start = data.split(" ")[3] * 1;
    let text = data.split(" ")[4];
    end = end + 10 <= soni ? end + 10 : soni;
    start = start + 10 >= end ? start + soni - end : start + 10;

    if (end >= soni) {
      ctx.answerCbQuery(`Pagelar tugadi`, true);
    }
    let mal = await parserQism(text, start, end);
    ctx.telegram.deleteMessage(id, deleteM);
    let umum = await pageFunc(mal, start, end, text, soni);
    const kattaText = umum.kattaText;
    const arr = umum.arr;

    ctx.telegram.sendMessage(id, kattaText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: arr,
      },
    });
  }
  if (data.includes("back")) {
    let end = data.split(" ")[1] * 1;
    const soni = data.split(" ")[2] * 1;
    let start = data.split(" ")[3] * 1;
    let text = data.split(" ")[4];
    end = end - 10 < 0 ? soni : end == soni ? end - (soni - start) : end - 10;
    start = start - 10 < 0 ? 0 : start - 10;

    if (start < 0 || end == start) {
      console.log("ishla back");
      ctx.answerCbQuery(`Pagelar tugadi`, true);
      return;
    }
    let mal = await parserQism(text, start, end);

    let umum = await pageFunc(mal, start, end, text, soni);
    const kattaText = umum.kattaText;
    const arr = umum.arr;
    console.log(start, end);
    ctx.telegram.deleteMessage(id, deleteM);

    ctx.telegram.sendMessage(id, kattaText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: arr,
      },
    });
    start = umum.start;
    end = umum.end;
  }
  let son = data * 1;
  if (Number.isInteger(son)) {
    let uzun =
      ctx.update.callback_query.message.reply_markup.inline_keyboard.length;
    const ish =
      ctx.update.callback_query.message.reply_markup.inline_keyboard[
        uzun - 1
      ][0].callback_data;
    console.log(ish);

    let end = ish.split(" ")[1] * 1;
    let start = ish.split(" ")[3] * 1;
    let text = ish.split(" ")[4];
    const music = await parserQism(text, start, end);
    let url = music[son].url;
    let musicName = music[son].name;
    const data = await infoUrl(url, id);
    if (!data) {
    }
    ctx.answerCbQuery(`Yuklab Olindi`, true);
    // await ctx.telegram.sendMessage(id, "Yuklab Olindi");
    const user = await User.findOne({ where: { telegram_id: id } });
    const userId = user.dataValues.id;
    const create = await db.music.create({
      name: musicName,
      user: userId,
    });

    const data3 = fs.readFileSync(`${__dirname}/${id}.mp3`);

    await ctx.telegram.sendAudio(id, data, {
      caption: `${musicName} \n @muztv_vk_bot code by <a href='https://t.me/Aazizjon0313'>@zizjon</a>`,
      parse_mode: "HTML",
    });
  }
});

// bot.catch((err, msg) => {
//   const id = msg.from.id;
//   msg.telegram.sendMessage(
//     id,
//     `Dastur hali to'liq rejimga o'tmadi shuning uchun xatoliklar bo'lishi mumkin,${err.message}`,
//     {
//       reply_markup: {
//         remove_keyboard: true,
//       },
//     }
//   );
// });
bot.launch();
