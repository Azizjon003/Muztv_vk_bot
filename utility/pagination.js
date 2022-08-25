const pageFunc = async (data, start, end, mal, mal1) => {
  let arr = [];
  let litleArr = [];
  let litleArr2 = [];

  let optionArr = [
    {
      text: "🔙",
      callback_data: `back ${end} ${mal1} ${start} ${mal}`,
    },
    {
      text: "🛑",
      callback_data: "stop",
    },
    {
      text: "🔜",
      callback_data: `next ${end} ${mal1} ${start} ${mal}`,
    },
  ];
  let obj = {};
  console.log(data);
  let kattaText = `Jami Musiqalar  -  <b>${mal1}</b>\n\n`;

  for (let i = start; i < end; i++) {
    obj.text = i + 1;
    obj.callback_data = i - start;

    console.log(obj);
    if (i < start + 5) {
      litleArr.push(obj);
    } else {
      litleArr2.push(obj);
    }
    let parseMusicText = `<b>${i + 1}</b> - <b><i>${
      data[i - start].name
    }</i></b>\n`;
    kattaText += parseMusicText;
    obj = {};
  }
  arr.push(litleArr);
  arr.push(litleArr2);
  arr.push(optionArr);

  return { arr, kattaText };
};

module.exports = pageFunc;
