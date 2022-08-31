const { bottom } = require("cli-color/move");
const fs = require("fs");
const dotenv = require("dotenv");

require("console-stamp")(console);
dotenv.config({ path: "./config.env" });
const { Telegraf, Scenes } = require("telegraf");
const { infoUrl, parserQism, musicLangth } = require("./parsing");
const krilLotin = require("./utility/lotinKril");
const db = require("./model/index");
const pageFunc = require("./utility/pagination");
const bot = new Telegraf(process.env.token, {
  polling: true,
});

const User = db.user;
const Music = db.music;

require("./model");

let shart = 0;

bot.start(async (ctx) => {
  console.log(ctx.update.message);
  const id = ctx.update.message.from.id;

  const username = ctx.update.message.from.username || "No username";
  const first_name = ctx.update.message.from.first_name;
  const user = await User.findOne({ where: { telegram_id: id } });

  if (!user) {
    const create = await User.create({
      username: username,
      telegram_id: id,
    });
  } else {
    if (user.role == "admin") {
      ctx.telegram.sendMessage(
        id,
        `Admin <b>${first_name}</b> 😎 bizning botga xush kelibsiz \n\n<b>Admin huqulari</b>\n 1. <i>Foydalanuvchilar ro'yxatini ko'rish</i> =>  /users \n 2.<i> Foydalanuvchini o'chirish </i> => /deleteuser \n 3.<i> Foydalanuvchini admin qilish</i> => /adminuser \n 4.<i> Foydalanuvchini admindan chiqarish </i> => /admindelete \n 5. <i>Foydalanuvchilarga xabar yuborish</i> => /sendmessage\n 6. <i>Foydalanuvchini faol qilish</i> => /adduser`,
        {
          parse_mode: "HTML",
        }
      );
    }
  }

  ctx.telegram.sendMessage(
    id,
    `Salom @${username}!\n Botga hush kelibsiz Bu bot Muztv.net saytidan qo'shiq qidirish uchun yaratildi qo'shiq nomini yoki qo'shiqchi nomini kiriting`
  );
});
bot.command("musiclists", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({ where: { telegram_id: id } });
  // console.log(user);
  if (!user) {
    throw new Error("User not found");
  }
  const musics = await Music.findAll({ where: { user: user.id } });
  let userSoni = `Userlar ro'yhati: ${musics.length} \n\n`;
  let text = "";
  let sana = 0;
  for (let e of musics) {
    console.log(e);
    sana++;
    text += `<b>id: ${e.dataValues.id} </b><b>${e.dataValues.name}</b> \n`;
    if (sana == 5) {
      ctx.telegram.sendMessage(id, userSoni + text, { parse_mode: "HTML" });
      text = "";
      sana = 0;
    }
  }
  ctx.telegram.sendMessage(id, userSoni + text, { parse_mode: "HTML" });
});
bot.command("users", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({
    where: { telegram_id: id },
  });
  if (user.role == "admin") {
    const users = await User.findAll({
      order: [["id", "ASC"]],
    });
    let userSoni = `Userlar ro'yhati: ${users.length} \n\n`;
    let text = "";
    let sana = 0;
    for (let e of users) {
      sana++;
      text += `<b>id: ${e.id} </b><b>${e.username}</b> \t <i> activ: <b>${e.activ}</b>  <b>role:  <i>${e.role}</i></b></i>\n`;
      if (sana == 5) {
        ctx.telegram.sendMessage(id, userSoni + text, { parse_mode: "HTML" });
        text = "";
        sana = 0;
      }
    }
    ctx.telegram.sendMessage(id, userSoni + text, { parse_mode: "HTML" });
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});
bot.command("deleteuser", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({
    where: { telegram_id: id },
  });
  if (user.role == "admin") {
    const users = await User.update(
      {
        command: "deleteuser",
      },
      {
        where: {
          telegram_id: id,
        },
      }
    );
    ctx.telegram.sendMessage(id, "User o'chirish uchun uning id sini kiritng");
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});

bot.command("adduser", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({
    where: { telegram_id: id },
  });
  if (user.role == "admin") {
    const users = await User.update(
      {
        command: "adduser",
      },
      {
        where: {
          telegram_id: id,
        },
      }
    );
    ctx.telegram.sendMessage(
      id,
      "Foydalanuvchini faol qilish uchun uning id sini kiritng"
    );
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});
bot.command("adminuser", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({
    where: { telegram_id: id },
  });
  if (user.role == "admin") {
    const users = await User.update(
      {
        command: "adminuser",
      },
      {
        where: {
          telegram_id: id,
        },
      }
    );
    ctx.telegram.sendMessage(
      id,
      "Foydalanuvchini admin qilish uchun uning id sini kiritng"
    );
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});
bot.command("admindelete", async (ctx) => {
  const id = ctx.update.message.from.id;
  const user = await User.findOne({
    where: { telegram_id: id },
  });
  if (user.role == "admin") {
    const users = await User.update(
      {
        command: "admindelete",
      },
      {
        where: {
          telegram_id: id,
        },
      }
    );
    ctx.telegram.sendMessage(
      id,
      "Foydalanuvchidan adminni olish uchun uning id sini kiritng"
    );
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});
bot.command("sendmessage", async (ctx) => {
  const id = ctx.update.message.from.id;
  let user = await User.findOne({
    where: { telegram_id: id },
  });

  if (user.role == "admin") {
    const users = await User.update(
      {
        command: "sendmessage",
      },
      {
        where: {
          telegram_id: id,
        },
      }
    );
    ctx.telegram.sendMessage(id, "Jo'natmoqchi bo'lgan Xabarni kiriting");
  } else {
    ctx.telegram.sendMessage(id, "Siz admin emassiz bu huquqlar admin uchun");
  }
});
bot.on("text", async (ctx) => {
  const id = ctx.update.message.from.id;
  let user = await User.findOne({
    where: {
      telegram_id: id,
    },
  });
  user = user.dataValues;
  console.log(user);
  if (user.activ) {
    if (user.role == "admin") {
      if (user.command == "deleteuser") {
        const text = ctx.update.message.text.trim().toLowerCase() * 1;
        const users = await User.update(
          { activ: false },
          {
            where: {
              id: text,
            },
          }
        );

        await User.update(
          {
            command: "",
          },
          {
            where: {
              telegram_id: id,
            },
          }
        );
        ctx.telegram.sendMessage(id, "User o'chirildi");
      }
      if (user.command == "adduser") {
        const text = ctx.update.message.text.trim().toLowerCase() * 1;
        const users = await User.update(
          { activ: true },
          {
            where: {
              id: text,
            },
          }
        );

        await User.update(
          {
            command: "",
          },
          {
            where: {
              telegram_id: id,
            },
          }
        );
        ctx.telegram.sendMessage(id, "User o'chirildi");
      }
      if (user.command == "adminuser") {
        const text = ctx.update.message.text.trim().toLowerCase() * 1;
        const users = await User.update(
          { activ: true, role: "admin" },
          {
            where: {
              id: text,
            },
          }
        );

        await User.update(
          {
            command: "",
          },
          {
            where: {
              telegram_id: id,
            },
          }
        );
        ctx.telegram.sendMessage(id, "User admin qilindi");
      }
      if (user.command == "admindelete") {
        const text = ctx.update.message.text.trim().toLowerCase() * 1;
        const users = await User.update(
          { activ: true, role: "user" },
          {
            where: {
              id: text,
            },
          }
        );

        await User.update(
          {
            command: "",
          },
          {
            where: {
              telegram_id: id,
            },
          }
        );
        ctx.telegram.sendMessage(id, "User admindan chiqarildi");
      }
      if (user.command == "sendmessage") {
        const text = ctx.update.message.text.trim();
        const users = await User.findAll();
        console.log(users);
        for (let i = 0; i < users.length; i++) {
          setInterval(async () => {
            await ctx.telegram.sendMessage(users[i].telegram_id, text, {
              parse_mode: "HTML",
            });
          }, 100);
        }

        await User.update(
          {
            command: "",
          },
          {
            where: {
              telegram_id: id,
            },
          }
        );

        ctx.telegram.sendMessage(
          id,
          "Buyruqlar bajarildi menga Ruxsat Admin  😎"
        );
      }
    } else {
      const username = ctx.update.message.from.username || "No username";
      console.log(username);
      let text = ctx.update.message.text.trim().toLowerCase();
      text = krilLotin(text);
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
    }
  } else {
    ctx.telegram.sendMessage(id, "Siz admin tomonidan bloklangansiz");
  }
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
    await ctx.telegram.sendAudio(id, data, {
      caption: `${musicName} \n @muztv_vk_bot code by <a href='https://t.me/Aazizjon0313'>@zizjon</a>`,
      parse_mode: "HTML",
    });
  }
});

bot.catch(async (err, msg) => {
  const id = msg.from.id;
  await User.update(
    {
      command: "",
    },
    {
      where: {
        telegram_id: id,
      },
    }
  );
  msg.telegram.sendMessage(
    id,
    `Xatolik qo'shiqni bazadan topa olmadim\n xato tasnifi: <i>Qo'shiqni yuklashda yoki qo'shiqni topishda xatolik yuz berdi</i>\n /start buyrug'i bilan qayta ishga tushuring`,
    {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
});
bot.launch();
