const pageFunc = async (data, start, end) => {
  let arr = [];
  let litleArr = [];
  let litleArr2 = [];
  let optionArr = [
    {
      text: "🔙",
      callback_data: "back",
    },
    {
      text: "🛑",
      callback_data: "stop",
    },
    {
      text: "🔜",
      callback_data: "next",
    },
  ];
  let obj = {};

  let kattaText = `Jami Musiqalar  -  <b>${data.length}</b>\n\n`;
  //   console.log(data);
  for (let i = start; i < end; i++) {
    obj.text = i + 1;
    obj.callback_data = i;

    if (i < start + 5) {
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

  return { arr, kattaText, start, end };
};

module.exports = pageFunc;
