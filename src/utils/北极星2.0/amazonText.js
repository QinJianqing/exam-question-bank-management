import {deepClone} from "@/utils/common";
/**
 * DOM文本转亚马逊格式数组
 * @param {String} html DOM字符串（含标签）
 * @returns {Array} 返回数组
 */
export const HTML_TO_OBJECT = (html) => {
  let box = document.createElement("div");
  box.innerHTML = clearHTML(html);
  let res = [];
  const NODETYPE = {
    ul: "LIST_UNORDERED",
    ol: "LIST_ORDERED"
  };
  box.children.forEach((item) => {
    let text = item.textContent;
    let draft = item.innerHTML;
    let decoArr = [];
    let type = NODETYPE[item.nodeName.toLocaleLowerCase()];
    decoArr = getTag(draft, text, type);
    res.push({
      value: text,
      decoratorSet: decoArr
    });
  });
  return res;
};
/**
 * 处理标签
 * @param {String} draft DOM字符串（含标签） 用于匹配标签
 * @param {String} text DOM文本（不含标签） 用于计算位置
 * @param {String} type DOM类型（p/ul/ol）
 * @returns {Array} 返回数组
 */
function getTag(draft, text, type) {
  let res = [];
  const arr = draft.match(/<([^>]+)>[^<]*<\/\1>/g);
  if (arr && arr.length) {
    arr.forEach((item) => {
      let itemText = item.replace(/<[^>]+>/g, "");
      if (itemText.length) {
        let offset = text.indexOf(itemText);
        res.push({
          type: getTagType(item, type),
          offset: offset > -1 ? offset : 0,
          length: itemText.length,
          depth: 0
        });
      }
      draft = draft.replace(item, itemText);
    });
    if (draft.match(/<([^>]+)>[^<]*<\/\1>/g)) {
      res = res.concat(getTag(draft, text, type));
    }
    return res;
  }
  return res;
}
/**
 * 判断文本类型
 * @param {String} txt DOM字符串（含标签）
 * @param {String} type DOM类型（b/u/i）
 * @returns {String} 返回字符串
 */
function getTagType(txt, type) {
  // LIST_ITEM: --, LIST_UNORDERED: 无序列表, LIST_ORDERED: 有序列表, STYLE_ITALIC: 斜体, STYLE_BOLD: 加粗， STYLE_UNDERLINE: 下划线,
  if (txt.indexOf("<b>") > -1) {
    return "STYLE_BOLD";
  }
  if (txt.indexOf("<u>") > -1) {
    return "STYLE_UNDERLINE";
  }
  if (txt.indexOf("<i>") > -1) {
    return "STYLE_ITALIC";
  }
  if (txt.indexOf("<li>") > -1) {
    return type;
  }
  return "";
}
/**
 * 清除多余标签、样式及换行符
 * @param {String} html DOM字符串（含标签）
 * @returns {String} 返回字符串
 */
function clearHTML(html) {
  /* eslint-disable */
  return html
    .replace(/ style=\"(.*?)\"/g, "")
    .replace(/<span>/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<br\/>/g, "");
  /* eslint-disable */
}

/**
 * DOM文本转亚马逊格式数组
 * @param {String} html DOM字符串（含标签）
 * @returns {Array} 返回数组
 */
export const OBJECT_TO_HTML = (valueObj) => {
 let res = "";
 valueObj.forEach(row => {
   if(row.decoratorSet.length){
     let lis = [];
     let styles = [];
     let value = row.value;
     let tempArr = [];
     row.decoratorSet.forEach(item => {
       if(["STYLE_ITALIC", "STYLE_BOLD", "STYLE_UNDERLINE"].includes(item.type)){
         styles.push(item);
       }
       if(["LIST_ITEM", "LIST_UNORDERED", "LIST_ORDERED"].includes(item.type)){
         lis.push(item);
       }
     });
    if(lis.length){
      res += liDecor(value, lis, styles);
    }else{
      res += pDecor(value, styles);
    }
   }else{
     res += createElement(row.value, "p");
   }
 });
 return res;
}
// 对象数据转p标签
function pDecor(value, styles){
  // 增量
  let increment = 0;
  styles.sort((a,b)=>{
    return a.offset - b.offset;
  }).forEach(style => {
    const transfer = createElementByType(value.substr(style.offset, style.length), style.type);
      value = changeStr(value, transfer.value, style.offset + increment, style.length);
      // offset持续受增量影响
      increment += transfer.len;
  });
  return `<p>${value}</p>`;
}
// 对象数据转ul/ol标签
function liDecor(value, lis, styles){
  let res = deepClone(lis);
  let start = 0;
  let end = 0;
  // li增量
  let increment1 = 0;
  lis.forEach((li, i) => {
    start = end;
    end = end + li.length;
    res[i].value = value.substr(li.offset, li.length);
    res[i].children = [];
    styles.forEach(style => {
      if(start <= style.offset && style.offset < end){
        res[i].children.push({
          ...style,
          value: res[i].value.substr(style.offset - start, style.length)
        });
      }
    });
    res[i].children = res[i].children.sort((a,b)=>{
      return a.offset - b.offset;
    });
    // 样式(b/i/u)增量
    let increment2 = 0;
    res[i].children.forEach(child => {
      const transfer = createElementByType(child.value, child.type);
      res[i].value = changeStr(res[i].value, transfer.value, child.offset + increment2 - increment1, child.length);
      // offset持续受增量影响
      increment2 += transfer.len;
    });
    res[i].value = createElement(res[i].value, ["LIST_ITEM", "LIST_UNORDERED", "LIST_ORDERED"].includes(res[i].type) ? "li" : "p");
    // offset持续受增量影响
    increment1 += li.length;
  });
  let tag = lis.some(e => e.type == "LIST_ORDERED") ? "ol" : "ul";
  return `<${tag}>${res.reduce((pre, cur) => (pre + String(cur.value)), "")}</${tag}>`;
}
// 根据下标替换内容
function changeStr(str, val, start, len){
  return str.substr(0, start) + val+ str.substr(start + len, str.length);
}
// 根据标签名输出标签
function createElement(value, e){
  return `<${e}>${value}</${e}>`;
}
// 根据类型输出标签及标签长度
function createElementByType(value, _t){
  const tb = {
    LIST_ITEM: "li",
    LIST_UNORDERED: "li",
    LIST_ORDERED: "li",
    STYLE_ITALIC: "i",
    STYLE_BOLD: "b",
    STYLE_UNDERLINE: "u"
  };
  return {
    value: `<${tb[_t]}>${value}</${tb[_t]}>`,
    len: tb[_t].length * 2 + 5
  };
}
/*
<ol>
  <li>111<b>222</b></li>
  <li><b>333</b><i>444</i></li>
  <li><u>5555</u></li>
</ol>
[{
    "value": "1112223334445555",
    "decoratorSet": [{
        "type": "STYLE_BOLD",
        "offset": 3,
        "length": 3,
        "depth": 0
    }, {
        "type": "STYLE_BOLD",
        "offset": 6,
        "length": 3,
        "depth": 0
    }, {
        "type": "STYLE_ITALIC",
        "offset": 9,
        "length": 3,
        "depth": 0
    }, {
        "type": "STYLE_UNDERLINE",
        "offset": 12,
        "length": 4,
        "depth": 0
    }, {
        "type": "LIST_ORDERED",
        "offset": 0,
        "length": 6,
        "depth": 0
    }, {
        "type": "LIST_ORDERED",
        "offset": 6,
        "length": 6,
        "depth": 0
    }, {
        "type": "LIST_ORDERED",
        "offset": 12,
        "length": 4,
        "depth": 0
    }]
}]
*/