/* eslint-disable */
function encodeUTF8(s) {
  var i, r = [],
    c, x;
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
  else {
    if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
      c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
      r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
    else r.push(0xE0 + (c >> 12 & 0xF));
    r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
  };
  return r;
}

// 字符串加密成 hex 字符串
export function sha1(s) {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t;
  var l = ((data.length + 8) >>> 6 << 4) + 16,
    s = new Uint8Array(l << 2);
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  s[l - 1] = data.length << 3;
  var w = [],
    f = [
      function () {
        return m[1] & m[2] | ~m[1] & m[3];
      },
      function () {
        return m[1] ^ m[2] ^ m[3];
      },
      function () {
        return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
      },
      function () {
        return m[1] ^ m[2] ^ m[3];
      }
    ],
    rol = function (n, c) {
      return n << c | n >>> (32 - c);
    },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776];
  m[2] = ~m[0], m[3] = ~m[1];
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
      t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
      m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);
  for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? "0" : "") + e.toString(16);
  }).join("");
  return hex;
}



//将URL中的UTF-8字符串转成中文字符串
export function getCharFromUtf8(str) {
  var cstr = "";
  var nOffset = 0;
  if (str == "")
    return "";
  str = str.toLowerCase();
  nOffset = str.indexOf("%e");
  if (nOffset == -1)
    return str;
  while (nOffset != -1) {
    cstr += str.substr(0, nOffset);
    str = str.substr(nOffset, str.length - nOffset);
    if (str == "" || str.length < 9)
      return cstr;
    cstr += utf8ToChar(str.substr(0, 9));
    str = str.substr(9, str.length - 9);
    nOffset = str.indexOf("%e");
  }
  return cstr + str;
}

//将编码转换成字符
function utf8ToChar(str) {
  var iCode, iCode1, iCode2;
  iCode = parseInt("0x" + str.substr(1, 2));
  iCode1 = parseInt("0x" + str.substr(4, 2));
  iCode2 = parseInt("0x" + str.substr(7, 2));
  return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
}