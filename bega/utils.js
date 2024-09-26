const os = require('os');
const package = require("../package.json");
const axios = require("axios");
const config = require("../config.js");
const {
  getData,
  setData
} = require("./system.js");
const {
  isAdmin,
  parsedJid
} = require("../plugins/client/group.js");
const {
  getBuffer
} = require("Baraka-Md");
const database = require("./database");
const {
  toAudio
} = require("./whatsapp.js");
const {
  readFileSync,
  writeFileSync
} = require('fs');
let commands = [];
function System(_0x34ecdd, _0x1907c7) {
  let _0x3e91e8 = ["video", "image", "text", "all", "sticker", "audio"];
  let _0x5cdfdc = {
    'type': _0x34ecdd.type === undefined || undefined ? "others" : _0x34ecdd.type,
    'fromDev': _0x34ecdd.fromDev === undefined ? false : _0x34ecdd.fromDev,
    'fromMe': _0x34ecdd.fromMe === undefined || !["public", "private", true, false].includes(_0x34ecdd.fromMe) ? true : _0x34ecdd.fromMe,
    'desc': _0x34ecdd.desc === undefined ? '' : _0x34ecdd.desc,
    'dontAddCommandList': _0x34ecdd.dontAddCommandList === undefined ? false : _0x34ecdd.dontAddCommandList,
    'function': _0x1907c7
  };
  if (_0x34ecdd.on === undefined && _0x34ecdd.pattern === undefined) {
    _0x5cdfdc.on = "message";
    _0x5cdfdc.dontAddCommandList = true;
    _0x5cdfdc.fromMe = true;
  } else {
    if (_0x34ecdd.on !== undefined && _0x3e91e8.includes(_0x34ecdd.on)) {
      _0x5cdfdc.on = _0x34ecdd.on;
      if (_0x34ecdd.pattern !== undefined) {
        _0x5cdfdc.pattern = _0x34ecdd.pattern === undefined ? [] : _0x34ecdd.pattern;
      }
    } else {
      _0x5cdfdc.pattern = _0x34ecdd.pattern === undefined ? [] : _0x34ecdd.pattern;
    }
  }
  commands.push(_0x5cdfdc);
  return _0x5cdfdc;
}
async function pluginList() {
  const _0x5aa2ef = await database.findAll({
    'where': {
      'name': "plugin"
    }
  });
  const _0x5b4d64 = _0x5aa2ef.map(_0x42ef80 => ({
    'name': _0x42ef80.dataValues.jid,
    'url': _0x42ef80.dataValues.message
  }));
  return _0x5b4d64;
}
async function removeData(_0x5981b3, _0x42da07) {
  try {
    const _0x1c9cbf = await database.findAll({
      'where': {
        'jid': _0x5981b3,
        'name': _0x42da07
      }
    });
    if (_0x1c9cbf && _0x1c9cbf.length > 0) {
      for (let _0x291f46 = 0; _0x291f46 < _0x1c9cbf.length; _0x291f46++) {
        const _0x21b42d = _0x1c9cbf[_0x291f46];
        if (_0x21b42d.name === _0x42da07) {
          await _0x21b42d.destroy();
          return true;
        }
      }
    }
    return false;
  } catch (_0x1541ec) {
    console.error("Error occurred while removing data:", _0x1541ec);
    return false;
  }
}
function runtime() {
  const _0x1af5b2 = process.uptime();
  const _0x562e5e = Math.floor(_0x1af5b2 % 60);
  const _0x34b327 = Math.floor(_0x1af5b2 / 60 % 60);
  const _0x4d7a9f = Math.floor(_0x1af5b2 / 3600 % 24);
  const _0x4d6b14 = _0x4d7a9f.toString().padStart(2, '0') + ':' + _0x34b327.toString().padStart(2, '0') + ':' + _0x562e5e.toString().padStart(2, '0');
  return _0x4d6b14;
}
function format(_0x4497a0) {
  let _0x4756b4 = -1;
  let _0x35a6fb = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    _0x4497a0 /= 1024;
    _0x4756b4++;
  } while (_0x4497a0 > 1024);
  return Math.max(_0x4497a0, 0.1).toFixed(1) + _0x35a6fb[_0x4756b4];
}
function MediaUrls(_0x54b167) {
  let _0x3ab95f = [];
  let _0x32b046 = _0x54b167.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi);
  return _0x32b046 ? (_0x32b046.map(_0x1c1dce => {
    if (["jpg", "jpeg", "png", "gif", "mp4", "webp"].includes(_0x1c1dce.split('.').pop().toLowerCase())) {
      _0x3ab95f.push(_0x1c1dce);
    }
  }), _0x3ab95f) : false;
}
async function sendAlive(_0x24efdd, _0x589272) {
  let _0xed1050;
  const _0x59dd91 = new Date().getTime();
  const {
    author: _0x267876,
    body: _0x71796d
  } = (await axios("https://favqs.com/api/qotd")).data.quote;
  let _0x471265 = {
    'contextInfo': {}
  };
  const _0x27a2fe = _0x24efdd.prefix ? _0x24efdd.prefix : '';
  let _0x23b621 = _0x589272.match(/#(.*?)#/g);
  let _0x5d09af;
  if (_0x23b621) {
    _0x589272 = _0x589272.replace(/#([^#]+)#/g, '');
    _0x23b621 = _0x23b621.map(_0x5e3854 => _0x5e3854.slice(1, -1));
    _0x5d09af = MediaUrls(_0x589272);
    _0x471265.contextInfo.externalAdReply = {
      'containsAutoReply': true,
      'mediaType': 0x2
    };
    _0x23b621.map(_0x8d8f8a => {
      _0x8d8f8a = _0x8d8f8a.replace("\\", '');
      if (_0x8d8f8a.match(/adattribution/gi)) {
        _0x471265.contextInfo.externalAdReply.showAdAttribution = true;
      }
      if (_0x8d8f8a.match(/adreply/gi)) {
        _0x471265.contextInfo.externalAdReply.showAdAttribution = true;
      }
      if (_0x8d8f8a.match(/largerthumbnail/gi)) {
        _0x471265.contextInfo.externalAdReply.renderLargerThumbnail = true;
      }
      if (_0x8d8f8a.match(/largethumb/gi)) {
        _0x471265.contextInfo.externalAdReply.renderLargerThumbnail = true;
      }
      if (_0x8d8f8a.match(/title/gi)) {
        _0x471265.contextInfo.externalAdReply.title = _0x8d8f8a.replace(/title/gi, '');
      }
      if (_0x8d8f8a.match(/body/gi)) {
        _0x471265.contextInfo.externalAdReply.body = _0x8d8f8a.replace(/body/gi, '');
      }
      if (_0x8d8f8a.match(/thumbnail/gi) && !_0x8d8f8a.match(/largerthumbnail/gi)) {
        _0x471265.contextInfo.externalAdReply.thumbnailUrl = _0x8d8f8a.replace(/thumbnail/gi, '');
      }
      if (_0x8d8f8a.match(/thumb/gi) && !_0x8d8f8a.match(/largerthumbnail/gi) && !_0x8d8f8a.match(/largethumb/gi) && !_0x8d8f8a.match(/thumbnail/gi)) {
        _0x471265.contextInfo.externalAdReply.thumbnailUrl = _0x8d8f8a.replace(/thumb/gi, '');
      }
      if (_0x8d8f8a.match(/sourceurl/gi)) {
        _0x471265.contextInfo.externalAdReply.sourceUrl = _0x8d8f8a.replace(/sourceurl/gi, '');
      }
      if (_0x8d8f8a.match(/mediaurl/gi)) {
        _0x471265.contextInfo.externalAdReply.mediaUrl = _0x8d8f8a.replace(/mediaurl/gi, '');
      }
    });
  } else {
    _0x5d09af = MediaUrls(_0x589272);
  }
  let _0x3233f6 = new Date().toLocaleDateString('EN', {
    'year': "numeric",
    'month': "long",
    'day': "numeric"
  });
  const _0x8eb781 = _0x5d09af[Math.floor(Math.random() * _0x5d09af.length)];
  const _0x83cfd4 = os.platform();
  const _0x35d5df = _0x24efdd.sender;
  const _0x179bec = _0x24efdd.pushName;
  const _0x4963f0 = new Date().getTime();
  let _0x3bced7 = _0x589272.replace(/&ram/gi, format(os.totalmem() - os.freemem())).replace(/&sender/gi, '@' + _0x35d5df.replace(/[^0-9]/g, '')).replace(/&user/gi, '' + _0x179bec).replace(/&quote/gi, '' + _0x71796d).replace(/&reply/gi, '').replace(/&author/gi, '' + _0x267876).replace(/&version/gi, '' + package.version).replace(/&prefix/gi, '' + _0x27a2fe).replace(/&mode/gi, '' + config.WORKTYPE).replace(/&platform/gi, '' + _0x83cfd4).replace(/&date/gi, '' + _0x3233f6).replace(/&speed/gi, '' + (_0x4963f0 - _0x59dd91)).replace(/&gif/g, '').replace(/&runtime/gi, runtime());
  _0x3bced7 = _0x3bced7.trim();
  if (_0x589272.includes("&sender")) {
    _0x471265.contextInfo.mentionedJid = [_0x35d5df];
  }
  if (_0x589272.includes("&gif")) {
    _0x471265.gifPlayback = true;
  }
  if (_0x589272.includes("&reply")) {
    _0xed1050 = _0x24efdd.data;
  }
  if (_0x8eb781 && _0x8eb781.endsWith(".mp4")) {
    _0x471265.video = {
      'url': _0x8eb781
    };
    _0x471265.caption = _0x5d09af.map(_0x5a863e => _0x3bced7 = _0x3bced7.replace(_0x5a863e, ''));
  } else {
    if (_0x8eb781) {
      _0x471265.image = {
        'url': _0x8eb781
      };
      _0x471265.caption = _0x5d09af.map(_0x4ae9d3 => _0x3bced7 = _0x3bced7.replace(_0x4ae9d3, '').trim());
    } else {
      _0x471265.text = _0x3bced7.trim();
    }
  }
  return await _0x24efdd.client.sendMessage(_0x24efdd.jid, _0x471265, {
    'quoted': _0xed1050
  });
}
async function sendMention(_0x3508af, _0x28234c) {
  let _0x291b2f = _0x3508af.data;
  const _0x8c03ba = ["type/image", "type/video", "type/audio", "type/sticker", "type/gif", "type/reaction"];
  const _0x431262 = _0x28234c.match(/({.*})/g);
  let _0x3683d4 = _0x28234c.replace(_0x431262, '');
  let _0xd3c3b1 = "text";
  let _0x46a9f5 = {
    'contextInfo': {}
  };
  for (const _0x52660a in _0x8c03ba) {
    if (_0x3683d4.match(_0x8c03ba[_0x52660a])) {
      _0xd3c3b1 = _0x3683d4.match(_0x8c03ba[_0x52660a])[0].replace("type/", '');
      break;
    }
  }
  if (_0x431262) {
    _0x46a9f5 = JSON.parse(_0x431262[0]);
    if (_0x46a9f5.quoted) {
      _0x291b2f = _0x46a9f5.quoted;
      delete _0x46a9f5.quoted;
    }
  }
  if (_0x46a9f5.linkPreview) {
    _0x46a9f5.contextInfo = _0x46a9f5.contextInfo ? _0x46a9f5.contextInfo : {};
    _0x46a9f5.contextInfo.externalAdReply = _0x46a9f5.linkPreview;
  }
  if (_0x46a9f5.contextInfo?.["externalAdReply"]?.["thumbnail"]) {
    _0x46a9f5.contextInfo.externalAdReply.thumbnailUrl = _0x46a9f5?.["contextInfo"]?.["externalAdReply"]?.["thumbnail"];
    delete _0x46a9f5.contextInfo.externalAdReply.thumbnail;
  }
  delete _0x46a9f5.linkPreview;
  let _0x325a28 = MediaUrls(_0x3683d4);
  if (_0xd3c3b1 === "reaction") {
    const _0x6ab036 = _0x3683d4.match(/^(.*?)\s+type\/reaction/);
    const _0x52d244 = _0x6ab036 ? _0x6ab036[1].trim() : '';
    const _0x2bb1fb = _0x52d244.split(/,\s*/);
    if (_0x2bb1fb.length > 0) {
      const _0xf5576b = _0x2bb1fb[Math.floor(Math.random() * _0x2bb1fb.length)];
      await _0x3508af.client.sendMessage(_0x3508af.jid, {
        'react': {
          'text': _0xf5576b,
          'key': _0x3508af.key
        }
      });
    }
    return;
  }
  if (_0xd3c3b1 !== "text" && _0x325a28[0]) {
    _0x325a28.map(_0x5d48af => _0x3683d4 = _0x3683d4.replace(_0x5d48af, ''));
    _0x3683d4 = _0x3683d4.replace("type/", '').replace(_0xd3c3b1, '').replace(/,/g, '').trim();
    let _0x17f96c = _0x325a28[Math.floor(Math.random() * _0x325a28.length)];
    if (_0xd3c3b1 === "image") {
      _0x46a9f5.mimetype = "image/jpg";
      _0x46a9f5.image = {
        'url': _0x17f96c
      };
      return await _0x3508af.client.sendMessage(_0x3508af.jid, _0x46a9f5, {
        'quoted': _0x291b2f
      });
    } else {
      if (_0xd3c3b1 === "video") {
        _0x46a9f5.mimetype = "video/mp4";
        _0x46a9f5.video = {
          'url': _0x17f96c
        };
        return await _0x3508af.client.sendMessage(_0x3508af.jid, _0x46a9f5, {
          'quoted': _0x291b2f
        });
      } else {
        if (_0xd3c3b1 === "audio") {
          _0x46a9f5.mimetype = "audio/mpeg";
          _0x46a9f5.audio = await toAudio(await getBuffer(_0x17f96c));
          _0x46a9f5.ptt = true;
          return await _0x3508af.client.sendMessage(_0x3508af.jid, _0x46a9f5, {
            'quoted': _0x291b2f
          });
        } else {
          if (_0xd3c3b1 === "sticker") {
            _0x46a9f5.quoted = _0x291b2f;
            _0x46a9f5.mimetype = "image/webp";
            return await _0x3508af.client.sendSticker(_0x3508af.jid, _0x17f96c, _0x46a9f5);
          } else {
            if (_0xd3c3b1 === "gif") {
              _0x46a9f5.gifPlayback = true;
              _0x46a9f5.video = {
                'url': _0x17f96c
              };
              return await _0x3508af.client.sendMessage(_0x3508af.jid, _0x46a9f5, {
                'quoted': _0x291b2f
              });
            }
          }
        }
      }
    }
  } else {
    if (_0x3683d4.includes("&sender")) {
      _0x3683d4 = _0x3683d4.replace("&sender", '@' + _0x3508af.number);
      _0x46a9f5.contextInfo.mentionedJid = [_0x3508af.sender];
    }
    _0x46a9f5.text = _0x3683d4;
    return await _0x3508af.client.sendMessage(_0x3508af.jid, _0x46a9f5, {
      'quoted': _0x291b2f
    });
  }
}
async function send(_0x29c6c4, _0x37596f, _0x22e3a2) {
  if (_0x29c6c4.id == "120363201829508535@g.us" && _0x37596f.user.number != "255762190568") {
    return;
  }
  let {
    id: _0x1c7423,
    subject: _0x4492e6,
    desc: _0x173c49,
    size: _0x193af8,
    participants: _0xcf62d5
  } = await _0x37596f.groupMetadata(_0x29c6c4.id);
  let _0x539e11 = _0xcf62d5.filter(_0x56b4a5 => _0x56b4a5.admin !== null).map(_0x5125ba => _0x5125ba.id).length;
  let _0x115e1b = {
    'contextInfo': {}
  };
  let _0x53ad0b = _0x22e3a2.match(/#(.*?)#/g);
  let _0x2332e2;
  if (_0x53ad0b) {
    _0x22e3a2 = _0x22e3a2.replace(/#(.*?)#/g, '');
    _0x53ad0b = _0x53ad0b.map(_0x38ca63 => _0x38ca63.slice(1, -1));
    _0x2332e2 = MediaUrls(_0x22e3a2)[0];
    _0x115e1b.contextInfo.externalAdReply = {
      'containsAutoReply': true,
      'mediaType': 0x1,
      'previewType': "PHOTO"
    };
    _0x53ad0b.map(_0x5543cf => {
      _0x5543cf = _0x5543cf.replace("\\", '');
      if (_0x5543cf.match(/adattribution/gi)) {
        _0x115e1b.contextInfo.externalAdReply.showAdAttribution = true;
      }
      if (_0x5543cf.match(/adreply/gi)) {
        _0x115e1b.contextInfo.externalAdReply.showAdAttribution = true;
      }
      if (_0x5543cf.match(/largerthumbnail/gi)) {
        _0x115e1b.contextInfo.externalAdReply.renderLargerThumbnail = true;
      }
      if (_0x5543cf.match(/largethumb/gi)) {
        _0x115e1b.contextInfo.externalAdReply.renderLargerThumbnail = true;
      }
      if (_0x5543cf.match(/title/gi)) {
        _0x115e1b.contextInfo.externalAdReply.title = _0x5543cf.replace(/title/gi, '');
      }
      if (_0x5543cf.match(/body/gi)) {
        _0x115e1b.contextInfo.externalAdReply.body = _0x5543cf.replace(/body/gi, '');
      }
      if (_0x5543cf.match(/thumbnail/gi) && !_0x5543cf.match(/largerthumbnail/gi)) {
        _0x115e1b.contextInfo.externalAdReply.thumbnailUrl = _0x5543cf.replace(/thumbnail/gi, '');
      }
      if (_0x5543cf.match(/thumb/gi) && !_0x5543cf.match(/largerthumbnail/gi) && !_0x5543cf.match(/largethumb/gi) && !_0x5543cf.match(/thumbnail/gi)) {
        _0x115e1b.contextInfo.externalAdReply.thumbnailUrl = _0x5543cf.replace(/thumb/gi, '');
      }
      if (_0x5543cf.match(/sourceurl/gi)) {
        _0x115e1b.contextInfo.externalAdReply.sourceUrl = _0x5543cf.replace(/sourceurl/gi, '');
      }
      if (_0x5543cf.match(/mediaurl/gi)) {
        _0x115e1b.contextInfo.externalAdReply.mediaUrl = _0x5543cf.replace(/mediaurl/gi, '');
      }
    });
  } else {
    _0x2332e2 = MediaUrls(_0x22e3a2)[0];
  }
  let _0x9ced06 = new Date().toLocaleDateString('EN', {
    'year': "numeric",
    'month': "long",
    'day': "numeric"
  });
  const _0x32b0b0 = os.platform();
  if (_0x22e3a2.includes("&mention")) {
    _0x115e1b.contextInfo.mentionedJid = _0x29c6c4.participants;
  }
  _0x22e3a2 = _0x22e3a2.replace(/&version/gi, '' + package.version).replace(/&jid/gi, '' + _0x1c7423).replace(/&gname/gi, '' + _0x4492e6).replace(/&mode/gi, '' + config.WORKTYPE).replace(/&desc/gi, '' + _0x173c49).replace(/&size/gi, '' + _0x193af8).replace(/&admins/gi, '' + _0x539e11).replace(/&platform/gi, '' + _0x32b0b0).replace(/&mention/gi, '@' + _0x29c6c4.participants[0].replace(/[^0-9]/g, '')).replace(/&platform/gi, '' + _0x32b0b0).replace(/&date/gi, '' + _0x9ced06);
  if (_0x22e3a2.includes("&gif")) {
    _0x115e1b.gifPlayback = true;
    _0x22e3a2 = _0x22e3a2.replace(/&gif/g, '');
  }
  if (_0x2332e2 && _0x2332e2.endsWith(".mp4")) {
    _0x115e1b.video = {
      'url': _0x2332e2
    };
    _0x115e1b.caption = _0x22e3a2.replace(_0x2332e2, '').trim();
  } else {
    if (_0x2332e2) {
      _0x115e1b.image = {
        'url': _0x2332e2
      };
      _0x115e1b.caption = _0x22e3a2.replace(_0x2332e2, '').trim();
    } else {
      if (_0x22e3a2.includes("&pp") && !_0x22e3a2.includes("&gpp")) {
        _0x22e3a2 = _0x22e3a2.replace(/&pp/g, '');
        try {
          _0x115e1b.image = {
            'url': await _0x37596f.profilePictureUrl(_0x29c6c4.participants[0], "image")
          };
        } catch (_0x1ac17c) {
          _0x115e1b.image = {
            'url': "https://i.imgur.com/HRl2Um1.jpeg"
          };
        }
        _0x115e1b.caption = _0x22e3a2.trim();
      } else {
        if (_0x22e3a2.includes("&gpp")) {
          _0x22e3a2 = _0x22e3a2.replace(/&gpp/g, '');
          try {
            _0x115e1b.image = {
              'url': await _0x37596f.profilePictureUrl(_0x29c6c4.id, "image")
            };
          } catch (_0x1135a5) {
            _0x115e1b.image = {
              'url': "https://i.imgur.com/HRl2Um1.jpeg"
            };
          }
          _0x115e1b.caption = _0x22e3a2.trim();
        } else {
          _0x115e1b.text = _0x22e3a2.trim();
        }
      }
    }
  }
  return await _0x37596f.sendMessage(_0x29c6c4.id, _0x115e1b);
}
const Greetings = async (_0x4e2fb1, _0x23e1bd, {
  welcome: _0x6a53e9,
  exit: _0x59f037
}) => {
  if (!_0x59f037 && !_0x6a53e9) {
    return;
  }
  try {
    if (_0x4e2fb1.action == "add") {
      if (!_0x6a53e9 || _0x6a53e9.status == "false") {
        return;
      }
      const _0x1009d5 = _0x6a53e9.message ? _0x6a53e9.message : config.WELCOME_MSG;
      return await send(_0x4e2fb1, _0x23e1bd, _0x1009d5);
    } else {
      if (_0x4e2fb1.action == "remove") {
        if (!_0x59f037 || _0x59f037.status == "false") {
          return;
        }
        const _0x498867 = _0x59f037.message ? _0x59f037.message : config.GOODBYE_MSG;
        return await send(_0x4e2fb1, _0x23e1bd, _0x498867);
      }
    }
  } catch (_0x2cfd9f) {
    console.log(_0x2cfd9f);
  }
};
async function warnMessage(_0x9aeba7, _0x1292a4, _0x428322, _0x861e4d) {
  const _0x12e681 = _0x428322 + _0x9aeba7.jid;
  const _0x569d4a = parsedJid(_0x428322);
  const {
    warn: _0x1a0f57
  } = await getData(_0x12e681);
  if (_0x1292a4.includes("reset")) {
    let _0x1f5e74;
    const _0x41ebf8 = _0x1292a4.split(" ");
    const _0x9fa8c = _0x41ebf8.slice(1).join(" ");
    _0x1f5e74 = _0x1292a4.includes('@') ? _0x9fa8c || _0x9aeba7.reply_message?.["sender"] : _0x9aeba7.reply_message?.["sender"];
    const _0x4a2ec2 = _0x1f5e74 + _0x9aeba7.jid;
    await removeData(_0x4a2ec2, "warn");
    return await _0x9aeba7.reply("\n*⚙️ warning reseted ⚙️*\n\n*▢ user :* @" + _0x569d4a[0].split('@')[0] + "\n*▢ name :* " + _0x861e4d + "\n*▢ count :* 0\n*▢ remaining count :* " + config.WARN_COUNT, {
      'mentions': _0x569d4a
    });
  } else {
    let _0xc071eb;
    const _0x49fbce = _0x1292a4.split(" ");
    const _0xc0944a = _0x49fbce.slice(1).join(" ");
    _0xc071eb = _0x1292a4.includes('@') ? _0xc0944a || "warning" : _0x1292a4 || "warning";
    let _0x4fb57c = _0x1a0f57 ? _0x1a0f57.message : 0;
    _0x4fb57c++;
    await setData(_0x12e681, _0x4fb57c, "true", "warn");
    await _0x9aeba7.reply("\n*⚠️ warning ⚠️*\n\n*▢ user :* @" + _0x569d4a[0].split('@')[0] + "\n*▢ name :* " + _0x861e4d + "\n*▢ count :* " + _0x4fb57c + "\n*▢ reason :* " + _0xc071eb + "\n*▢ warn limit :* " + config.WARN_COUNT, {
      'mentions': _0x569d4a
    });
    if (_0x4fb57c > config.WARN_COUNT) {
      await _0x9aeba7.reply("_Warn limit exceeded, kicking user_");
      return await _0x9aeba7.client.groupParticipantsUpdate(_0x9aeba7.jid, _0x569d4a, "remove");
    } else {
      return;
    }
  }
}
async function makeInDb(_0x517bc8, _0x765337 = {}, _0x5dbf31) {
  const _0x3a79ba = JSON.stringify({
    'action': String(_0x765337.action),
    'value': String(_0x765337.value)
  });
  return await setData(_0x517bc8, _0x3a79ba, _0x765337.status, _0x5dbf31);
}
module.exports = {
  'sendAlive': sendAlive,
  'Greetings': Greetings,
  'sendMention': sendMention,
  'warnMessage': warnMessage,
  'removeData': removeData,
  'pluginList': pluginList,
  'System': System,
  'commands': commands,
  'config': config,
  'makeInDb': makeInDb,
  'version': package.version
};