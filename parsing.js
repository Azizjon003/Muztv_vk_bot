const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
// headers qismini yozish
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
const parseData = async (data) => {};

module.exports = { linkOl, parseData };
