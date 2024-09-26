const CryptoJS = require("crypto-js");
const axios = require("axios");
const cheerio = require("cheerio");
function encryptUrl(_0x53541d) {
  const _0x376d63 = CryptoJS.enc.Utf8.parse("qwertyuioplkjhgf");
  const _0x563fcd = CryptoJS.lib.WordArray.random(16);
  const _0x550a80 = CryptoJS.AES.encrypt(_0x53541d, _0x376d63, {
    'iv': _0x563fcd,
    'mode': CryptoJS.mode.ECB,
    'padding': CryptoJS.pad.Pkcs7
  });
  const _0x1346b5 = _0x550a80.ciphertext.toString(CryptoJS.enc.Hex);
  return _0x1346b5;
}
const instaDl = _0x3600d4 => {
  return new Promise(async (_0x389df6, _0x4fe057) => {
    try {
      const _0x39719e = {
        'url': encryptUrl(_0x3600d4)
      };
      const _0x7a8a6a = await fetch("https://backend.instavideosave.com/allinone", {
        'method': "GET",
        'headers': _0x39719e
      });
      const _0x2529de = await _0x7a8a6a.json();
      if (!_0x2529de) {
        _0x4fe057({
          'results_number': 0x0,
          'url_list': []
        });
      }
      let _0x342d8c = [];
      if (_0x2529de.video) {
        _0x2529de.video.forEach(_0x1f16d0 => {
          if (_0x1f16d0.video) {
            _0x342d8c.push(_0x1f16d0.video);
          } else {
            _0x342d8c.push(_0x1f16d0.thumbnail);
          }
        });
      }
      if (_0x2529de.image) {
        _0x2529de.image.forEach(_0x34a23f => {
          _0x342d8c.push(_0x34a23f);
        });
      }
      _0x389df6(_0x342d8c);
    } catch (_0x1b1fde) {
      _0x4fe057(_0x1b1fde);
    }
  });
};
async function aptoideDl(_0x5298f7) {
  try {
    let _0x2d9d08 = await axios.get("http://ws75.aptoide.com/api/7/apps/search", {
      'params': {
        'query': _0x5298f7,
        'limit': 0x1
      }
    });
    _0x2d9d08 = _0x2d9d08.data;
    const _0x33a879 = {
      'img': _0x2d9d08.datalist.list[0].icon || "null",
      'developer': _0x2d9d08.datalist.list[0].store.name || "null",
      'appname': _0x2d9d08.datalist.list[0].name || "null",
      'link': _0x2d9d08.datalist.list[0].file.path || "null"
    };
    return _0x33a879;
  } catch (_0x32578f) {
    console.error("Error fetching app information:", _0x32578f);
    throw _0x32578f;
  }
}
async function Google(_0x73a008) {
  const _0x19a5f8 = "https://www.google.com/search?q=" + encodeURIComponent(_0x73a008);
  try {
    const {
      data: _0x2c5992
    } = await axios.get(_0x19a5f8, {
      'headers': {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
      }
    });
    const _0x31c863 = cheerio.load(_0x2c5992);
    const _0x882ea9 = [];
    _0x31c863("div.g").each((_0xaf7f32, _0x5863eb) => {
      const _0x7e4041 = _0x31c863(_0x5863eb).find('h3').text();
      const _0x5c8f67 = _0x31c863(_0x5863eb).find('a').attr("href");
      const _0x451f81 = _0x31c863(_0x5863eb).find("div.VwiC3b").text();
      if (_0x7e4041 && _0x5c8f67) {
        _0x882ea9.push({
          'title': _0x7e4041,
          'link': _0x5c8f67,
          'description': _0x451f81
        });
      }
    });
    return _0x882ea9;
  } catch (_0x33386c) {
    throw new Error("Failed to scrape Google: " + _0x33386c.message);
  }
}
function ssweb(_0x10d3bd) {
  return new Promise((_0x5ecea8, _0x12ef58) => {
    const _0x3bb25e = "https://api.pikwy.com/?tkn=125&d=3000&u=" + encodeURIComponent(_0x10d3bd) + "&fs=1&w=1920&h=1080&s=100&z=100&f=jpg&rt=jweb";
    axios.get(_0x3bb25e, {
      'headers': {
        'Accept': "*/*",
        'Accept-Encoding': "gzip, deflate, br",
        'Accept-Language': "en-US,en;q=0.9",
        'Cache-Control': "no-cache",
        'Origin': "https://pikwy.com",
        'Pragma': "no-cache",
        'Referer': "https://pikwy.com/",
        'Sec-Ch-Ua': "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\"",
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': "\"Android\"",
        'Sec-Fetch-Dest': "empty",
        'Sec-Fetch-Mode': "cors",
        'Sec-Fetch-Site': "same-site",
        'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      }
    }).then(_0x3666c2 => {
      _0x5ecea8(_0x3666c2.data);
    })["catch"](_0xff36c6 => {
      _0x12ef58(_0xff36c6);
    });
  });
}
async function bitly(_0xe988ae) {
  try {
    const _0x4f206e = await axios.post("https://api-ssl.bitly.com/v4/shorten", {
      'long_url': _0xe988ae
    }, {
      'headers': {
        'Authorization': "Bearer 6e7f70590d87253af9359ed38ef81b1e26af70fd",
        'Content-Type': "application/json"
      }
    });
    return _0x4f206e.data;
  } catch (_0x3c4adb) {
    console.error("Error while shortening URL:", _0x3c4adb);
    throw _0x3c4adb;
  }
}
module.exports = {
  'bitly': bitly,
  'ssweb': ssweb,
  'Google': Google,
  'aptoideDl': aptoideDl,
  'instaDl': instaDl
};