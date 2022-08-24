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
  // console.log(forNum);
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
  return arr;
};
const parserQism = async (name, start, end) => {
  const html = await linkOl(name);
  const $ = cheerio.load(html);
  const soni = $(".berrors").text().trim().split(" ")[4] * 1;
  let info = {};
  let arr = [];
  let arr1 = [];
  console.log(start, end);
  const son = start / 10;
  let shart = Math.round(end / 10) % 2 == 0 && son % 2 == 1 ? false : true;
  let i = son % 2 == 0 ? Math.round(son / 2) : Math.round(son / 2) + 1;
  console.log(i);
  const html1 = await linkOl(name, i);
  const $$ = cheerio.load(html1);
  let j = 0;
  $$(".play-desc").each((_, e) => {
    j++;
    if (j <= 10 && shart) {
      info.name = $$(e).text().trim();
      info.url = $$(e).attr().href;
      arr.push(info);
      info = {};
    }
    if (j > 10 && !shart) {
      info.name = $$(e).text().trim();
      info.url = $$(e).attr().href;
      arr1.push(info);
      info = {};
    }
  });
  return shart ? arr : arr1;
};

let infoUrl = async (url, name = "download") => {
  let html = await axios.get(url);
  if (!html) {
    console.log(cli.redBright("info urlda xato bor"));
  }
  const $ = cheerio.load(html.data);
  const data = $(".fbtn.fx-row.fx-middle.fdl");
  if (!data) {
    console.log(cli.redBright("biz infoUrl funksiyasidan urlni topolmadik"));
  }
  let url1 = data.attr().href;

  console.log(url1);
  let data1 = await axios.get(url1, { responseType: "stream" });
  await data1.data.pipe(fs.createWriteStream(`${name}.mp3`));
  return url1;
};

const parseData = async (name) => {
  let info = await musicParser(name);
  if (!info) {
    throw new Error("hech qanday ma'lumot topilmadi");
  }
  return info;
  // let malumot = await infoUrl(info[2].url, info[2].name);
};
const musicLangth = async (name) => {
  const html = await linkOl(name);
  const $ = cheerio.load(html);
  const soni = $(".berrors").text().trim().split(" ")[4] * 1;
  console.log(soni);
  return soni;
};

module.exports = {
  linkOl,
  parseData,
  infoUrl,
  musicParser,
  parserQism,
  musicLangth,
};

// 5424351049:AAEROa2XS0wtXUBna30i-wm6E5eY0QaHqEo
// 5497276792:AAEiXf_kniIyvmWYb5r11lVQHs-DxIt8aP0
