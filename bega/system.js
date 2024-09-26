const id3 = require("browser-id3-writer");
const fs = require('fs');
const path = require("path");
const {
  Innertube,
  UniversalCache,
  Utils
} = require("youtubei.js");
const yts = require("yt-search");
const database = require("./database");
const {
  getBuffer,
  getJson,
  postJson
} = require("jarvis-md");
const axios = require("axios");
const config = require("../config");
async function changeVar(_0x1c198b, _0x38d7c6) {
  try {
    let _0xb712ab = '';
    if (fs.existsSync("./config.env")) {
      _0xb712ab = await fs.promises.readFile("./config.env", "utf-8");
    }
    const _0x332467 = _0xb712ab.split("\n").filter(Boolean);
    const _0xc0dd7d = _0x332467.map(_0x5d2284 => {
      const [_0x421e92, _0x29af9b] = _0x5d2284.split('=');
      if (_0x421e92 === _0x1c198b) {
        return _0x421e92 + "=\"" + _0x38d7c6 + "\"";
      }
      return _0x5d2284;
    });
    if (!_0xc0dd7d.includes(_0x1c198b + "=\"" + _0x38d7c6 + "\"")) {
      _0xc0dd7d.push(_0x1c198b + "=\"" + _0x38d7c6 + "\"");
    }
    await fs.promises.writeFile("./config.env", _0xc0dd7d.join("\n"));
    return true;
  } catch (_0x133f7a) {
    console.error(_0x133f7a);
    return false;
  }
}
;
function generateRandomName(_0x2338be) {
  let _0x36a8d0 = '';
  for (let _0x36ae7c = 0; _0x36ae7c < _0x2338be; _0x36ae7c++) {
    const _0x6d9810 = Math.floor(Math.random() * "abcdefghijklmnopqrstuvwxyz0123456789".length);
    _0x36a8d0 += "abcdefghijklmnopqrstuvwxyz0123456789"[_0x6d9810];
  }
  return _0x36a8d0;
}
const terabox = async _0xd48f90 => {
  try {
    const {
      data: _0x46a9a8,
      status: _0x383e6e
    } = await axios.post("https://ironman.koyeb.app/ironman/dl/terabox", {
      'URL': _0xd48f90
    }, {
      'headers': {
        'api-key': "IR0N-m4N!H4x"
      }
    });
    if (_0x383e6e !== 200) {
      return false;
    }
    return _0x46a9a8;
  } catch (_0x3d97b9) {
    console.error("Request failed:", _0x3d97b9);
    return false;
  }
};
function matchEmojiToOption(_0x58a9f1, _0x38c839) {
  for (let _0x2fad37 of _0x38c839.options) {
    let [_0x5d55b6, _0x294772] = _0x2fad37.split('|');
    if (_0x5d55b6 === _0x58a9f1) {
      return _0x294772;
    }
  }
  return "umbified";
}
async function Vote(_0x2e53e6, {
  text: _0x33693b
} = opt, _0x15eb18) {
  if (_0x15eb18 === "result") {
    const _0x283027 = _0x2e53e6.store.votes.reaction[_0x2e53e6.reply_message.id];
    if (!_0x283027) {
      return false;
    }
    const _0x1c35e9 = _0x283027.vote.map(_0x3e8179 => _0x3e8179.personJid);
    const _0x980ef2 = _0x283027.vote.reduce((_0x134cb2, {
      vote: _0xc5ef33
    }) => (_0x134cb2[_0xc5ef33] = (_0x134cb2[_0xc5ef33] || 0) + 1, _0x134cb2), {});
    const _0x2cb049 = _0x283027.vote.length;
    const _0x46cd61 = Object.fromEntries(Object.entries(_0x980ef2).map(([_0x54eb6d, _0xb571b1]) => [_0x54eb6d, (_0xb571b1 / _0x2cb049 * 100).toFixed(2) + '%']));
    const _0x247439 = Object.keys(_0x46cd61).map(_0x19f82e => ({
      'Emoji': _0x19f82e,
      'VotedOn': matchEmojiToOption(_0x19f82e, _0x283027),
      'Votes': _0x980ef2[_0x19f82e],
      'Percentage': _0x46cd61[_0x19f82e]
    }));
    const _0x5a7cad = {};
    _0x283027.vote.forEach(({
      personJid: _0x1d79c8,
      vote: _0x41d9ed
    }) => {
      if (!_0x5a7cad[_0x41d9ed]) {
        _0x5a7cad[_0x41d9ed] = [];
      }
      _0x5a7cad[_0x41d9ed].push(_0x1d79c8);
    });
    _0x247439.forEach(_0x3e9a8e => {
      _0x3e9a8e.VotesBy = _0x5a7cad[_0x3e9a8e.Emoji] || [];
    });
    return {
      'result': _0x247439,
      'votersJid': _0x1c35e9
    };
  } else {
    if (_0x15eb18 === "delete") {
      const _0x5270ee = _0x2e53e6.store.votes.reaction[_0x2e53e6.reply_message.id];
      if (!_0x5270ee) {
        return false;
      }
      delete _0x2e53e6.store.votes.reaction[_0x2e53e6.reply_message.id];
      return _0x2e53e6.store.votes.reaction;
    } else {
      let _0x16cd9f = _0x33693b.split(';');
      let _0x1c0819 = _0x16cd9f[1].split(',');
      let _0x10a960 = [];
      for (let _0x21bee6 = 0; _0x21bee6 < _0x1c0819.length; _0x21bee6++) {
        let _0x6c4aba = _0x1c0819[_0x21bee6].split('|');
        let _0xce5494 = _0x6c4aba[0];
        let _0x6945e = _0x6c4aba[1];
        _0x10a960.push(_0xce5494 + " - " + _0x6945e);
      }
      const _0x122da8 = await _0x2e53e6.send('*' + _0x16cd9f[0] + "*\n\n*available options to vote*\n\n" + _0x10a960.join("\n") + "\n\n*react the text to vote*");
      let _0x51ab9a = _0x1c0819.map(_0x2313a6 => _0x2313a6.split('|')[0]);
      _0x2e53e6.store.votes.reaction[_0x122da8.key.id] = {
        'allowedEmoji': _0x51ab9a,
        'vote': [],
        'options': _0x1c0819
      };
      return _0x122da8;
    }
  }
}
;
async function extractUrlsFromText(_0x1e3981) {
  if (!_0x1e3981) {
    return false;
  }
  let _0x50fdc7 = _0x1e3981.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi);
  return _0x50fdc7 || [];
}
async function setData(_0x477f02, _0x36ec3c, _0x5f3a70, _0x5af6c1) {
  try {
    let _0x7e9cc3 = [];
    const _0x63177e = await database.findAll({
      'where': {
        'jid': _0x477f02,
        'name': _0x5af6c1
      }
    });
    if (_0x63177e && _0x63177e.length > 0) {
      for (let _0x135da5 = 0; _0x135da5 < _0x63177e.length; _0x135da5++) {
        const _0x3169b2 = _0x63177e[_0x135da5];
        _0x3169b2.message = _0x36ec3c;
        _0x3169b2.status = _0x5f3a70;
        await _0x3169b2.save();
        _0x7e9cc3.push(_0x3169b2);
      }
    } else {
      const _0x1b9294 = await database.create({
        'jid': _0x477f02,
        'message': _0x36ec3c,
        'name': _0x5af6c1,
        'status': _0x5f3a70
      });
      _0x7e9cc3.push(_0x1b9294);
    }
    return _0x7e9cc3;
  } catch (_0x67de3d) {
    console.error("Error occurred while setting message and messageId:", _0x67de3d);
    return false;
  }
}
async function getData(_0x4f7974) {
  try {
    const _0x702afd = await database.findAll({
      'where': {
        'jid': _0x4f7974
      }
    });
    if (!_0x702afd) {
      return null;
    }
    const _0x34bafe = {};
    _0x702afd.forEach(_0xf1684a => {
      _0x34bafe[_0xf1684a.name] = {
        'message': _0xf1684a.message,
        'jid': _0xf1684a.jid,
        'status': _0xf1684a.status
      };
    });
    return _0x34bafe;
  } catch (_0x1bc0ab) {
    console.error("Error occurred while getting greetings by jid:", _0x1bc0ab);
    return false;
  }
}
const validQueryDomains = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "gaming.youtube.com"]);
const getURLVideoID = _0x8994da => {
  const _0x392f8e = new URL(_0x8994da.trim());
  let _0x40284d = _0x392f8e.searchParams.get('v');
  if (/^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/.test(_0x8994da.trim()) && !_0x40284d) {
    const _0x5e28b9 = _0x392f8e.pathname.split('/');
    _0x40284d = _0x392f8e.host === "youtu.be" ? _0x5e28b9[1] : _0x5e28b9[2];
  } else {
    if (_0x392f8e.hostname && !validQueryDomains.has(_0x392f8e.hostname)) {
      throw Error("Not a YouTube domain");
    }
  }
  if (!_0x40284d) {
    throw Error("No video id found: \"" + _0x8994da + "\"");
  }
  _0x40284d = _0x40284d.substring(0, 11);
  return _0x40284d;
};
async function stream2buffer(_0x138dd0) {
  return new Promise((_0x55b4b7, _0x35674a) => {
    const _0x2d9ecd = [];
    _0x138dd0.on("data", _0x1e7ed3 => _0x2d9ecd.push(_0x1e7ed3));
    _0x138dd0.on("end", () => _0x55b4b7(Buffer.concat(_0x2d9ecd)));
    _0x138dd0.on("error", _0x2864ff => _0x35674a(_0x2864ff));
  });
}
async function transformData(_0x52f7e5, _0x4e3531) {
  try {
    if (_0x4e3531 === "antidelete") {
      const {
        antidelete: _0x2aa619
      } = await getData(_0x52f7e5);
      const _0x1bea4d = JSON.parse(_0x2aa619.message);
      const {
        jid: _0x1289ce,
        status: _0x1897cf
      } = _0x2aa619;
      const _0x3d727a = _0x1bea4d.action;
      const _0x12b6a1 = _0x1bea4d.value;
      return {
        'action': _0x3d727a,
        'value': _0x12b6a1,
        'status': _0x1897cf,
        'jid': _0x1289ce
      };
    } else {
      if (_0x4e3531 === "antiword") {
        const {
          antiword: _0x6e3b5c
        } = await getData(_0x52f7e5);
        const _0xc9acbd = JSON.parse(_0x6e3b5c.message);
        const {
          jid: _0x57c389,
          status: _0x21400f
        } = _0x6e3b5c;
        const _0x44ef80 = _0xc9acbd.action;
        const _0xf952d0 = _0xc9acbd.value;
        return {
          'action': _0x44ef80,
          'value': _0xf952d0,
          'status': _0x21400f,
          'jid': _0x57c389
        };
      } else {
        return false;
      }
    }
  } catch (_0x1a3bd6) {
    return false;
  }
}
const GetYtv = async _0x5b40cf => {
  let _0x29653f = getURLVideoID(_0x5b40cf);
  try {
    const _0x1235fe = await Innertube.create({
      'cache': new UniversalCache(false),
      'generate_session_locally': true
    });
    const _0x10d097 = await _0x1235fe.download(_0x29653f, {
      'type': "video+audio",
      'quality': "bestefficiency",
      'format': "mp4"
    });
    const _0x5b8be2 = [];
    for await (const _0x2abd65 of Utils.streamToIterable(_0x10d097)) {
      _0x5b8be2.push(_0x2abd65);
    }
    return Buffer.concat(_0x5b8be2);
  } catch (_0x3c27e4) {
    return "rejected";
  }
};
async function Ytsearch(_0x2d3e91) {
  const _0x53af72 = await yts(_0x2d3e91);
  return _0x53af72.videos[0];
}
function sleep(_0x25a3d0) {
  return new Promise(_0x3db941 => setTimeout(_0x3db941, _0x25a3d0));
}
async function appendJSONToFile(_0x4aa871, _0x99a5eb, _0xc5bec5) {
  const _0x10db5e = path.join(_0x99a5eb, _0xc5bec5);
  try {
    await fs.promises.access(_0x10db5e, fs.constants.F_OK);
    const _0x23c9b2 = await fs.promises.readFile(_0x10db5e, "utf-8");
    const _0x28d2e0 = JSON.parse(_0x23c9b2);
    _0x28d2e0.push(_0x4aa871);
    await fs.promises.writeFile(_0x10db5e, JSON.stringify(_0x28d2e0, null, 2));
  } catch (_0x8d7e64) {
    if (_0x8d7e64.code === "ENOENT") {
      await fs.promises.writeFile(_0x10db5e, JSON.stringify([_0x4aa871], null, 2));
    } else {
      console.error("Error appending JSON file:", _0x8d7e64);
    }
  }
}
function extractUrlFromMessage(_0x9fb81c) {
  const _0x39b61b = /(https?:\/\/[^\s]+)/gi.exec(_0x9fb81c);
  return _0x39b61b ? _0x39b61b[0] : null;
}
async function readMore() {
  const _0x5ab33b = String.fromCharCode(8206).repeat(4001);
  return _0x5ab33b;
}
const YtInfo = async _0x5ccf5b => {
  const _0x470e62 = getURLVideoID(_0x5ccf5b);
  const _0x2324d3 = await yts({
    'videoId': _0x470e62
  });
  const {
    title: _0x121938,
    description: _0x31b182,
    seconds: _0x27dd8b,
    uploaddate: _0x2b4794,
    views: _0x30ddca,
    thumbnail: _0x229bb9,
    author: _0x153ce1,
    videoId: _0xd3ada1
  } = _0x2324d3;
  return {
    'title': _0x121938,
    'description': _0x31b182,
    'seconds': _0x27dd8b,
    'uploaddate': _0x2b4794,
    'views': _0x30ddca,
    'thumbnail': _0x229bb9,
    'author': _0x153ce1.name,
    'videoId': _0xd3ada1
  };
};
module.exports = {
  'getData': getData,
  'setData': setData,
  'Vote': Vote,
  'getBuffer': getBuffer,
  'changeVar': changeVar,
  'getJson': getJson,
  'transformData': transformData,
  'postJson': postJson,
  'terabox': terabox,
  'extractUrlFromMessage': extractUrlFromMessage,
  'extractUrlsFromText': extractUrlsFromText,
  'appendJSONToFile': appendJSONToFile,
  'sleep': sleep,
  'GetYta': GetYtv,
  'YtInfo': YtInfo,
  'GetYtv': GetYtv,
  'yts': yts,
  'Ytsearch': Ytsearch,
  'readMore': readMore,
  'isPrivate': config.WORK_TYPE.toLowerCase() === "private",
  'IronMan': function IronMan(_0x1cfa19) {
    return "https://ironman.koyeb.app/" + _0x1cfa19;
  },
  'LokiXer': function LokiXer(_0x1c19df) {
    return "https://api-loki-ser-1o2h.onrender.com/api/" + _0x1c19df;
  },
  'isUrl': isUrl = _0x5b2700 => {
    return new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi').test(_0x5b2700);
  },
  'AddMp3Meta': async (_0x30d52e, _0xcb22a2, _0x4835f1 = {}) => {
    if (!Buffer.isBuffer(_0x30d52e)) {
      _0x30d52e = await getBuffer(_0x30d52e);
    }
    if (!Buffer.isBuffer(_0xcb22a2)) {
      _0xcb22a2 = await getBuffer(_0xcb22a2);
    }
    const _0x24b6a7 = new id3(_0x30d52e);
    _0x24b6a7.setFrame("TIT2", _0x4835f1.title || "Baraka").setFrame("TPE1", _0x4835f1.body ? [_0x4835f1.body] : ["Baraka"]).setFrame("APIC", {
      'type': 0x3,
      'data': _0xcb22a2,
      'description': "powered by baraka"
    });
    _0x24b6a7.addTag();
    return Buffer.from(_0x24b6a7.arrayBuffer);
  }
};