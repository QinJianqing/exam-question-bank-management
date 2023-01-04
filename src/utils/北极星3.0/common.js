'use strict';

/* eslint-disable */
/**
 * 通用脚本
 * 创建者: garfield
 * 创建日期: 2019-9-11
 */

const padLeftZero = (str) => {
  return ('00' + str).substr(str.length);
};

export const typeOf = (obj) => {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
};

export const colors = [
  '#70abff', '#d14a61', '#00A9A2', '#675bba',
  '#F3A43B', '#60C0DD', '#C6E579', '#e6b520', '#EDC4C2',
  '#8BC34A', '#56C342', '#4CAF50', '#388E3C', '#318235', '#70abff', '#d14a61', '#00A9A2', '#675bba',
  '#F3A43B', '#60C0DD', '#C6E579', '#e6b520', '#EDC4C2',
  '#8BC34A', '#56C342', '#4CAF50', '#388E3C', '#318235'
];

// 手机验证
export const verifyMobile = (str) => {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return reg.test(str);
};

// 验证是否移动端
export const isMobile = () => {
  return navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS|BlackBerry|webOS)/i);
};

// 邮箱验证
export const verifyEmail = (str) => {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return reg.test(str);
};

// 密码组合验证
export const verifyPassWdCompose = (str) => {
  if (str.length < 6) {
    return false;
  }
  const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
  return reg.test(str);
};

// 空值
export const isEmpty = (v) => {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) {
        return true;
      }
      break;
    case 'boolean':
      if (!v) {
        return true;
      }
      break;
    case 'number':
      if (0 === v || isNaN(v)) {
        return true;
      }
      break;
    case 'object':
      if (null === v || v.length === 0) {
        return true;
      }
      for (let i in v) {
        return false;
      }
      return true;
  }
  return false;
};

// 将浮点数四舍五入, 取小数点后2位
export const toDecimal2 = (x) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }

  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

// 取随机ID
export const randomID = (n = 13) => {
  return String(Math.random()).substring(2, 2 + n);
};

// 时间格式化
export const formatDate = (fmt, date) => {
  fmt = fmt || 'yyyy-MM-dd';
  date = date || new Date();
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
};

// 获取当前月份的第一天
export const getMonthStart = () => {
  let date = new Date();
  date.setDate(1);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 计算时间差
export const timeDifference = (t1, t2, back) => {
  let date3 = new Date(t2).getTime() - new Date(t1).getTime(); //时间差的毫秒数

  // 相差天
  let days = Math.floor(date3 / (24 * 3600 * 1000));

  // 相差小时
  let leave1 = date3 % (24 * 3600 * 1000);
  let hours = Math.floor(leave1 / (3600 * 1000));

  // 相差分钟
  let leave2 = leave1 % (3600 * 1000);
  let minutes = Math.floor(leave2 / (60 * 1000));

  // 相差秒
  let leave3 = leave2 % (60 * 1000);
  let seconds = Math.round(leave3 / 1000);

  back(days, hours, minutes, seconds);
  //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
};

// 深度拷贝
export const deepClone = (data) => {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepClone(data[i]));
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepClone(data[i]);
    }
  }
  return o;
};

// 生成一段密钥
export const secretKey = () => {
  let s = [];
  let hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x24), 1);
  }
  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);

  let key = s.join("") + '-' + new Date().getTime();
  return window.btoa(key);
};

// 复制到剪贴板
export const copyToClipboard = (s) => {
  if (window.clipboardData) {
    window.clipboardData.setData('text', s);
  } else {
    (function (s) {
      document.oncopy = function (e) {
        e.clipboardData.setData('text', s);
        e.preventDefault();
        document.oncopy = null;
      };
    })(s);
    document.execCommand('Copy');
  }
};

// 获取上传的文件
export const readFile = (file) => {
  let img, reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise(resolve => {
    reader.onload = function () {
      img = reader.result;
      resolve(img);
    };
  });
};

// 取两个数组的差集, [1,2,3,4] and [1,2,7,8] => [3,4,7,8]
export const arrayDifference = (arr1, arr2) => {
  return arr1.filter(function (v) {
    return !(arr2.indexOf(v) > -1);
  }).concat(arr2.filter(function (v) {
    return !(arr1.indexOf(v) > -1);
  }));
};

// 取交集, [1,2,3,4] and [1,2,7,8] => [1,2]
export const intersection = (arr1, arr2) => {
  return arr1.filter(function (val) {
    return arr2.indexOf(val) > -1;
  });
};

//去除交集, [1,2,3,4] and [3,4,5,6] => [1,2]
export const arrayDeleteIntersection = (arr1, arr2) => {
  return arr1.reduce((newArr, cur) => {
    if (arr2.indexOf(cur) == -1) {
      newArr.push(cur);
    }
    return newArr;
  }, []);
};

//判断数组arr1是否是数组arr2的子集
export const isSubset = (arr1, arr2) => {
  if (arr1.length > arr2.length) {
    return false;
  }
  return arr1.every(v => arr2.includes(v));
};

// 获取浏览器URL传参
export const getUrlParam = (variable) => {
  let reg = new RegExp("(^|&)" + variable + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  let context = "";
  if (r != null) {
    context = r[2];
  }
  reg = null;
  r = null;
  return context == null || context === "" || context === "undefined" ? "" : context;
};

export const getHashParam = (name) => {
  let reg = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)', "");
  let r = window.location.hash.substr(1).match(reg);
  return r && r[1] || null;
};

// 获取cookie
export const setCookie = (name, value, exdays) => {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = `expires=${d.toGMTString()}`;
  document.cookie = `${name}=${value}; ${expires}`;
};

// 设置cookie
export const getCookie = (n) => {
  let name = n + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// 数字千分号分割
export function toThousands(num, val) {
  let _num = Number(num);
  if (isNaN(_num)) {
    return num;
  }

  /[0-9]\.\d+$/.test(_num) && (_num = _num.toFixed(val === 0 ? val : val || 2));
  let source = String(_num).split(".");
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
  return source.join(".");
}

//四舍五入保留2位小数（若第二位小数为0，则保留一位小数）
export function keepTwoDecimal(num, val) {
  var result = parseFloat(num);
  if (isNaN(result)) {
    return false;
  }
  const t = val ? 10000 : 100;
  result = Math.round(num * t) / t;
  return result;
}

export function htmlStrLvel(val) {
  const colors = ['#001a35', '#ca195a', '#ff7701', '#b5bbc8', '#d33724', '#b5bbc8'];
  let html = '';
  switch (val) {
    case '普通':
      html = `<span style="background: ${colors[0]}">${val}</span>`;
      break;
    case '爆款':
      html = `<span style="background: ${colors[1]}">${val}</span>`;
      break;
    case '重点':
      html = `<span style="background: ${colors[2]}">${val}</span>`;
      break;
    case '淘汰':
      html = `<span style="background: ${colors[5]}; color: #fff">${val}</span>`;
      break;
    case '战略':
      html = `<span style="background: ${colors[4]};">${val}</span>`;
      break;
    default:
      html = `<span style="background: ${colors[3]}; color: #fff">${val}</span>`;
      break;
  }
  return html;
}

// 全字段模糊匹配
export const fuzzyQuery = (arr, q) => {
  return arr.filter(v => Object.values(v).some(v => new RegExp(q + '').test(v)));
};

// 全字段多值联合查找
export const multipleQuery = (arr, value) => {
  let res = [],
    q = Array.from(new Set(value));
  // arr.forEach(v => {
  //   for (let i in q) {
  //     //Object.values(v).some(val => new RegExp(q[i] + '').test(val)) && res.push(v)
  //     JSON.stringify(Object.values(v)).indexOf(q[i]) >= 0 && res.push(v)
  //   }
  // });

  // 建立正则 new RegExp("(?=.*升级版)(?=.*海运)^.*$").test(str)
  let exp = "";
  for (let i in q) {
    exp += `(?=.*${q[i]})`;
  }
  exp += "^.*$";
  // console.log(exp);

  arr.forEach(v => {
    new RegExp(exp).test(JSON.stringify(Object.values(v))) && res.push(v);
  });

  // 去重
  let obj = {};
  res = res.reduce((cur, next) => {
    obj[next._XID] ? "" : obj[next._XID] = cur.push(next);
    return cur;
  }, []);
  return res;
};

// 深度查找 [arr: 数据来源, key: 键值, str: 需要查找的值]
export const jsonQuery = (arr, key, str) => {
  let hasFound = false,
    result = null;
  const fn = (data) => {
    if (Array.isArray(data) && !hasFound) {
      data.forEach(item => {
        if (item[key] === str) {
          result = item;
          hasFound = true;
        } else if (item.children) {
          fn(item.children);
        }
      });
    }
  };
  fn(arr);
  return result;
};

export function templateProofreading(name) {
  switch (name) {
    case 'STANDARD_HEADER_IMAGE_TEXT':
      return '1';
    case 'STANDARD_COMPANY_LOGO':
      return '3';
    case 'STANDARD_COMPARISON_TABLE':
      return '17';
    default:
      return '';
  }
}

export function specialSymbol(str) {
  let count = 0;
  let myReg = /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/;
  let stringResult = str.split('');
  let i = 0;
  if (myReg.test(str)) {
    for (i = 0; i < str.length; i++) {
      if (myReg.test(stringResult[i])) {
        count = i;
        break;
      }
    }
    // console.log('%c特殊符号是', 'background:black;color:white;',str.substring(count, count + 1));
    return str.substring(count, count + 1);
  }
  // console.log('%c没有特殊符号', 'background:black;color:white;',);
  return '';
}

/**
 * 判断一个字符串解析后是否是数据
 * @param {Function} fn 包装的事件回调
 * @param {Number} interval 时间间隔的阈值
 * @returns
 */
export function isJSON(str) {
  if (typeof str == 'string') {
    try {
      let array = JSON.parse(str);
      if (typeOf(array) === 'array' && array) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * 判读是否有小数，有小数则最多保留两位小数
 * @param {Number} interval 时间间隔的阈值
 * @returns
 */
export function fixNum(num) {
  if (isNaN(Number(num))) {
    return num;
  }
  return Number(Number(num).toFixed(2)).toString();
  //  const numArr = num.split(".");
  //  if (numArr[1] && numArr[1].length > 1) {
  //   return num.toFixed(2);
  //  } else {
  //   return Number(num)
  //  }
}

export function add(a, b) {
  return Decimal.add(a, b);
}

export function sub(a, b) {
  return Decimal.sub(a, b);
}

export function mul(a, b) {
  return Decimal.mul(a, b);
}

export function div(a, b) {
  return Decimal.div(a, b);
}

// 判断参数是否是其中之一
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

// myFunction -- my-function
export function camelcaseToHyphen(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// index忽略大小写
export function customIndexOf(array, searchElement, fromIndex) {
  return array.map(function (value) {
    return value.toLowerCase();
  }).indexOf(searchElement.toLowerCase(), fromIndex);
};


// 验证
export function validateNumber(rule, value, callback) {
  if (!value && value != 0) {
    return callback(new Error('请输入排名目标!'));
  } else {
    if (value < 1 || value > 999999) {
      return callback(new Error('请输入合法的排名目标1-999999!'));
    }
  }
  callback();
  return false;
};
export function validatePrice(rule, value, callback) {
  if (!value && value != 0) {
    return callback(new Error('请输入价格!'));
  } else {
    if (value < 0 || value > 999999) {
      return callback(new Error('请输入合法的价格0-999999!'));
    }
  }
  callback();
  return false;
};

export function arrTrans(num, arr) { // 一维数组转换为二维数组
  const iconsArr = []; // 声明数组
  arr.forEach((item, index) => {
      const page = Math.floor(index / num); // 计算该元素为第几个素组内
      if (!iconsArr[page]) { // 判断是否存在
          iconsArr[page] = [];
      }
      iconsArr[page].push(item);
  });
  return iconsArr;
}