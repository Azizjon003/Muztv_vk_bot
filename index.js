const { bottom } = require("cli-color/move");
const fs = require("fs");
const dotenv = require("dotenv");

require("console-stamp")(console);
dotenv.config({ path: "./config.env" });
const { Telegraf, Scenes } = require("telegraf");
const { linkOl, parseData, musicParser, infoUrl } = require("./parsing");

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
  mal = await parseData(text);
  // console.log(mal);
  end = mal.length < 10 ? mal.length : 10;
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
  console.log(ctx.update);

  if (data == "stop") {
    ctx.telegram.deleteMessage(id, deleteM);
    start = 0;
    end = mal.length < 10 ? mal.length : 10;
  }

  if (data == "next") {
    start = start + 10;
    end = end + 10 > mal.length ? mal.length - start + end : end + 10;
    if (end == mal.length || end > mal.length) {
      console.log("ishla", start, end);
      start =
        mal.length % 10 == 0 ? mal.length - 10 : mal.length - (mal.length % 10);
      end = mal.length;
      console.log(start, end);
    }
    console.log(start, end);
    ctx.telegram.deleteMessage(id, deleteM);
    let umum = await pageFunc(mal, start, end);
    const kattaText = umum.kattaText;
    const arr = umum.arr;

    ctx.telegram.sendMessage(id, kattaText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: arr,
      },
    });
    start = umum.start;
    end = umum.end;
  }
  if (data == "back") {
    start = start - 10 > 0 ? start - 10 : (start = 0);
    end = end % 10 !== 0 ? end - start : end - 10;
    if (end == 0) {
      end = mal.length < 10 ? mal.length : 10;
    }
    ctx.telegram.deleteMessage(id, deleteM);
    let umum = await pageFunc(mal, start, end);
    const kattaText = umum.kattaText;
    const arr = umum.arr;
    console.log(start, end);

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
    const url = mal[son].url;
    const musicName = mal[son].name;
    const data = await infoUrl(url, id);
    if (!data) {
    }
    await ctx.telegram.sendMessage(id, "Yuklab Olindi");
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
  console.log(start, end);
});
bot.catch((err, msg) => {
  const id = msg.from.id;
  msg.telegram.sendMessage(
    id,
    `Dastur hali to'liq rejimga o'tmadi shuning uchun xatoliklar bo'lishi mumkin,${err.message}`,
    {
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
});
bot.launch();
