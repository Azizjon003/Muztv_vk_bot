const axios = require("axios");
const cheerio = require("cheerio");
const cli = require("cli-color");
const fs = require("fs");
const headers = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
  },
};
// headers qism tugadi
const linkOl = async (params, start = 1) => {
  let url = `http://muztv.net/index.php?do=search&subaction=search&search_start=${start}&full_search=0&result_from=100&story=${params}`;
  let data = await axios.get(url, { headers });
  //   if// data qismini yozish
  return data.data;
};

const musicParser = async (name) => {
  const html = await linkOl(name);
  const $ = cheerio.load(html);
  const soni = $(".berrors").text().trim().split(" ")[4] * 1;
  if (!soni) {
    throw new Error("Dasturda qo'shiqlar topilmadi");
  }
  const forNum = Math.floor(soni / 20) + 1;
  console.log(forNum);
  let info = {};
  let arr = [];
  for (let i = 1; i <= forNum; i++) {
    const html1 = await linkOl(name, i);
    const $$ = cheerio.load(html1);
    $$(".play-desc").each((_, e) => {
      info.name = $$(e).text().trim();
      info.url = $$(e).attr().href;
      arr.push(info);
      info = {};
    });
  }

  fs.writeFileSync("json.json", JSON.stringify(arr), () => {});
  console.log(arr.length);
  return arr;
};

let infoUrl = async (url, name = "download") => {
  let html = await axios.get(url);
  if (html) {
    console.log(cli.redBright("info urlda xato bor"));
  }
  const $ = cheerio.load(html.data);
  const data = $(".fbtn.fx-row.fx-middle.fdl");
  if (!data) {
    console.log(cli.redBright("biz infoUrl funksiyasidan urlni topolmadik"));
  }
  let url1 = data.attr().href;

  console.log(url1);
  let response = await axios.get(url1, { responseType: "stream" });
  await response.data.pipe(fs.createWriteStream(`${name}.mp3`));
};

const parseData = async (data) => {
  let info = await musicParser("Doxxim");
  if (!info) {
    throw new Error("hech qanday ma'lumot topilmadi");
  }
  let malumot = await infoUrl(info[2].url, info[2].name);
};

module.exports = { linkOl, parseData, infoUrl, musicParser };
