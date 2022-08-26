let lotinMap = new Map([
  ["a", "а"],
  ["b", "б"],
  ["d", "д"],
  ["e", "е"],
  ["f", "ф"],
  ["g", "г"],
  ["h", "ҳ"],
  ["i", "и"],
  ["j", "ж"],
  ["k", "к"],
  ["l", "л"],
  ["m", "м"],
  ["n", "н"],
  ["o", "о"],
  ["p", "п"],
  ["q", "қ"],
  ["r", "р"],
  ["s", "с"],
  ["u", "у"],
  ["v", "в"],
  ["x", "х"],
  ["y", "й"],
  ["z", "з"],
  [" ", " "],
  ["yo", "ё"],
  ["Yo", "Ё"],
  ["yu", "ю"],
  ["Yu", "Ю"],
  ["ya", "я"],
  ["Ya", "Я"],
  ["сh", "ч"],
  ["Ch", "Ч"],
  ["sh", "ш"],
  ["Sh", "Ш"],
  ["t", "т"],
  ["o'", "ў"],
  ["g'", "ғ"],
]);
function krilLotin(val) {
  let kril1 = val;
  let kril = kril1.split("");
  for (let [a, b] of lotinMap) {
    for (let i = 0; i < kril.length; i++) {
      if (
        kril[i] !== b &&
        typeof kril[i] === "string" &&
        kril[i].toLowerCase() == b
      ) {
        kril[i] = a.toUpperCase();
      }
      if (b == kril[i]) {
        kril[i] = a;
      }
    }
  }
  let sprit = kril.join("");
  console.log(sprit);
  return sprit;
}
module.exports = krilLotin;
