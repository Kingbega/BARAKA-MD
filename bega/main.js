const {
  proto,
  areJidsSameUser,
  generateWAMessage,
  prepareWAMessageMedia,
  generateWAMessageContent,
  generateWAMessageFromContent,
  getContentType,
  extractMessageContent,
  downloadMediaMessage,
  jidNormalizedUser,
  WA_DEFAULT_EPHEMERAL
} = require("@whiskeysockets/baileys");
const deviceTypes = {
  'ios': /^3A.{18}$/,
  'web': /^3E.{20}$/,
  'android': /^(.{21}|.{32})$/,
  'desktop': /^.{18}$/,
  'baileys': /^.{15}$|^.{16}$|^BAE5/
};
const util = require("util");
const FileType = require("file-type");
const {
  genThumb,
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
  generateProfilePicture
} = require("./whatsapp");
let config = require("../config");
const {
  getBuffer
} = require("jarvis-md");
class Client {
  constructor(_0x2124cd, _0x33ecc9) {
    for (let _0x559131 in _0x2124cd) {
      if (_0x2124cd.hasOwnProperty(_0x559131)) {
        Object.defineProperty(this, _0x559131, {
          'value': _0x2124cd[_0x559131],
          'enumerable': false,
          'configurable': true,
          'writable': true
        });
      }
    }
    Object.defineProperty(this, "store", {
      'value': _0x33ecc9 || ''
    });
    this.user.number = this.user.id.split(':')[0] || '';
    this.user.jid = jidNormalizedUser(this.user.id);
    this.server = process.env.REPLIT_USER ? "REPLIT" : process.env.DYNO ? "HEROKU" : process.env.KOYEB_APP_ID ? "KOYEB" : process.env.GITHUB_SERVER_URL ? "GITHUB" : process.env.RENDER ? "RENDER" : process.env.RAILWAY_SERVICE_NAME ? "RAILWAY" : "VPS";
  }
  async ["getMessage"](_0x569525) {
    const _0xc6faba = await this.store.loadMessage(_0x569525.remoteJid, _0x569525.id);
    return _0xc6faba.message;
  }
  ["generateMessageId"](_0x54e44b = 8, _0x570513 = "LOKIXER") {
    for (let _0x28f294 = 0; _0x28f294 < _0x54e44b; _0x28f294++) {
      const _0x34f268 = Math.floor(Math.random() * "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".length);
      _0x570513 += "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(_0x34f268);
    }
    return _0x570513;
  }
  async ["sendInvaite"](_0x5a9449, _0x5f00a8, _0x167c34, _0x2ce225, _0x1c09ee = "unknown subject", _0x1f582b = "Invitation to join my WhatsApp group", _0x2ba1d7, _0x67c678 = {}) {
    const _0x12e4f9 = proto.Message.fromObject({
      'groupInviteMessage': proto.Message.GroupInviteMessage.fromObject({
        'inviteCode': _0x167c34,
        'inviteExpiration': parseInt(_0x2ce225) || +new Date(new Date() + 259200000),
        'groupJid': _0x5a9449,
        'groupName': _0x1c09ee,
        'jpegThumbnail': null,
        'caption': _0x1f582b
      })
    });
    const _0x63bb3b = generateWAMessageFromContent(_0x5f00a8, _0x12e4f9, _0x67c678);
    await this.relayMessage(_0x5f00a8, _0x63bb3b.message, {
      'messageId': _0x63bb3b.key.id,
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
    return _0x63bb3b;
  }
  async ["appenTextMessage"](_0x2a8000, _0x5d11a5) {
    let _0x348587 = await generateWAMessage(_0x5d11a5.jid, {
      'text': _0x2a8000
    }, {
      'userJid': this.user.id
    });
    _0x348587.key.fromMe = areJidsSameUser(_0x5d11a5.sender, this.user.id);
    _0x348587.key.id = _0x5d11a5.key.id;
    _0x348587.pushName = _0x5d11a5.pushName;
    if (_0x5d11a5.isGroup) {
      _0x348587.participant = _0x5d11a5.sender;
    }
    const _0x39492a = {
      'messages': [proto.WebMessageInfo.fromObject(_0x348587)],
      'type': "append"
    };
    this.ev.emit("messages.upsert", _0x39492a);
    return true;
  }
  async ["sendPayment"](_0x40ffba, _0x3efb74 = '', _0x175b6e, _0x5c9bc7, _0x3377da, _0x3af82c) {
    let _0x283fe4 = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"];
    let _0x2df62e = _0x283fe4[Math.floor(Math.random() * _0x283fe4.length)];
    const _0x4f251b = {
      'amount': {
        'currencyCode': _0x3377da || _0x2df62e,
        'offset': 0x0,
        'value': _0x5c9bc7 || 9.99
      },
      'expiryTimestamp': 0x0,
      'amount1000': (_0x5c9bc7 || 9.99) * 1000,
      'currencyCodeIso4217': _0x3377da || _0x2df62e,
      'requestFrom': _0x175b6e || "0@s.whatsapp.net",
      'noteMessage': {
        'extendedTextMessage': {
          'text': _0x3efb74 || "Example Payment Message"
        }
      },
      'background': undefined
    };
    return await this.relayMessage(_0x40ffba, {
      'requestPaymentMessage': _0x4f251b
    }, {
      ..._0x3af82c,
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
  }
  async ["sendReply"](_0x5284b9, _0x4f3d5c, _0x26b4c9 = {}, _0x304082 = "text") {
    if (config.LINKPREVIEW) {
      if (!_0x26b4c9.contextInfo) {
        _0x26b4c9.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
    }
    ;
    if (_0x26b4c9.mentions) {
      if (!_0x26b4c9.contextInfo) {
        _0x26b4c9.contextInfo = {};
      }
      _0x26b4c9.contextInfo.mentionedJid = _0x26b4c9.mentions;
    }
    ;
    if (!_0x26b4c9.quoted) {
      _0x26b4c9.quoted = {
        'key': {
          'fromMe': false,
          'participant': "0@s.whatsapp.net",
          'remoteJid': "status@broadcast",
          'id': this.generateMessageId()
        },
        'message': {
          'extendedTextMessage': {
            'text': this.user.name
          }
        }
      };
    }
    if (_0x304082 === "text") {
      _0x4f3d5c = util.format(_0x4f3d5c);
    }
    const _0x6d7798 = await this.client.sendMessage(_0x5284b9, {
      [_0x304082]: _0x4f3d5c,
      ..._0x26b4c9
    }, {
      'quoted': _0x26b4c9.quoted,
      'messageId': _0x26b4c9.id || this.generateMessageId(),
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
    return _0x6d7798;
  }
  ["isMediaURL"](_0x74da0c) {
    const _0x14ae86 = ["jpg", "jpeg", "png", "gif", "mp4", "webm", "webp"];
    if (!_0x74da0c.includes('.')) {
      return false;
    }
    const _0x5bd7b2 = _0x74da0c.split('.').pop().toLowerCase();
    return _0x14ae86.includes(_0x5bd7b2) && _0x74da0c.startsWith("http");
  }
  async ["updateProfile"](_0x3f704c, _0x1aa414) {
    const {
      img: _0x291790
    } = await generateProfilePicture(_0x3f704c);
    await this.query({
      'tag': 'iq',
      'attrs': {
        'to': _0x1aa414,
        'type': "set",
        'xmlns': "w:profile:picture"
      },
      'content': [{
        'tag': "picture",
        'attrs': {
          'type': "image"
        },
        'content': _0x291790
      }]
    });
  }
  async ["sendSticker"](_0x4f6a87, _0x44f9f0, _0x14a330 = {}) {
    const _0x185d1f = Buffer.isBuffer(_0x44f9f0);
    if (!_0x185d1f) {
      _0x44f9f0 = await getBuffer(_0x44f9f0);
    }
    const {
      mime: _0x3f1572
    } = await FileType.fromBuffer(_0x44f9f0);
    if (_0x3f1572.includes("webp")) {
      return await this.sendMessage(_0x4f6a87, {
        'sticker': {
          'url': await writeExifWebp(_0x44f9f0, {
            'packname': _0x14a330.packname,
            'author': _0x14a330.author ? _0x14a330.author : _0x14a330.packname ? undefined : " "
          })
        },
        ..._0x14a330
      }, {
        'quoted': _0x14a330.quoted,
        'messageId': _0x14a330.messageId || this.generateMessageId(),
        'cachedGroupMetadata': this.store.fetchGroupMetadata
      });
    } else {
      if (_0x3f1572.includes("image")) {
        return _0x14a330.packname || _0x14a330.author ? await this.sendMessage(_0x4f6a87, {
          'sticker': {
            'url': await writeExifImg(_0x44f9f0, {
              'packname': _0x14a330.packname,
              'author': _0x14a330.author
            })
          },
          ..._0x14a330
        }, {
          'quoted': _0x14a330.quoted,
          'messageId': _0x14a330.messageId || this.generateMessageId(),
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        }) : await this.sendMessage(_0x4f6a87, {
          'sticker': await imageToWebp(_0x44f9f0),
          ..._0x14a330
        }, {
          'quoted': _0x14a330.quoted,
          'messageId': _0x14a330.messageId || this.generateMessageId(),
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      } else {
        if (_0x3f1572.includes("video")) {
          return _0x14a330.packname || _0x14a330.author ? await this.sendMessage(_0x4f6a87, {
            'sticker': {
              'url': await writeExifVid(_0x44f9f0, {
                'packname': _0x14a330.packname,
                'author': _0x14a330.author
              })
            },
            ..._0x14a330
          }, {
            'quoted': _0x14a330.quoted,
            'messageId': _0x14a330.messageId || this.generateMessageId(),
            'cachedGroupMetadata': this.store.fetchGroupMetadata
          }) : await this.sendMessage(_0x4f6a87, {
            'sticker': await videoToWebp(_0x44f9f0),
            ..._0x14a330
          }, {
            'quoted': _0x14a330.quoted,
            'messageId': _0x14a330.messageId || this.generateMessageId(),
            'cachedGroupMetadata': this.store.fetchGroupMetadata
          });
        }
      }
    }
  }
  ["getDevice"](_0x3e626b) {
    for (const [_0x4cb2a5, _0x2db161] of Object.entries(deviceTypes)) {
      if (_0x2db161.test(_0x3e626b)) {
        return _0x4cb2a5;
      }
    }
    return "unknown";
  }
  async ["save"](_0x372588) {
    const _0xcb1998 = getContentType(_0x372588.message);
    const _0x4f92fa = _0x372588.message[_0xcb1998].mimetype;
    const _0x5809b6 = await downloadMediaMessage(_0x372588, "buffer", {}, {
      'reuploadRequest': this.updateMediaMessage
    });
    return {
      'buff': _0x5809b6,
      'type': _0xcb1998.replace("Message", ''),
      'mime': _0x4f92fa
    };
  }
  async ["forwardMessage"](_0x161fcc, _0x418aef, _0xc33482 = {}) {
    var _0x2ee427 = _0x418aef.message ? _0x418aef.message : _0x418aef;
    if (_0xc33482.linkPreview) {
      _0xc33482.contextInfo = {
        'externalAdReply': _0xc33482.linkPreview
      };
      delete _0xc33482.linkPreview;
    }
    if (_0xc33482.ptv) {
      _0x2ee427 = {
        'ptvMessage': _0x2ee427
      };
    }
    ;
    if (config.LINKPREVIEW) {
      if (!_0xc33482.contextInfo) {
        _0xc33482.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
      ;
    }
    ;
    if (!_0xc33482.messageId) {
      _0xc33482.messageId = this.generateMessageId();
    }
    if (_0xc33482.waveform) {
      _0xc33482.waveform = new Uint8Array(_0xc33482.waveform);
      _0xc33482.mimetype = "audio/ogg; codecs=opus";
      delete _0xc33482.ptt;
    }
    ;
    if (_0xc33482.readViewOnce) {
      _0x2ee427 = _0x2ee427.viewOnceMessageV2 ? _0x2ee427.viewOnceMessageV2.message : _0x2ee427.viewOnceMessageV2Extension ? _0x2ee427.viewOnceMessageV2Extension.message : _0x2ee427;
      if (_0x2ee427.imageMessage || _0x2ee427.videoMessage || _0x2ee427.audioMessage) {
        delete (_0x2ee427.imageMessage || _0x2ee427.videoMessage || _0x2ee427.audioMessage).viewOnce;
      }
    }
    let _0x463761 = getContentType(_0x2ee427);
    if (_0xc33482.forwardType === "fromKey") {
      _0x2ee427 = await this.getMessage(_0x418aef.data.key);
    } else {
      if (_0xc33482.forwardType) {
        let _0x37cd21 = {
          _0x36d507: {}
        };
        let _0x36d507 = _0xc33482.forwardType + "Message";
        for (const _0x591457 of Object.keys(_0x2ee427[_0x463761])) {
          _0x37cd21[_0x36d507][_0x591457] = _0x2ee427[_0x463761][_0x591457];
        }
        _0x463761 = getContentType(_0x37cd21);
        _0x2ee427 = await extractMessageContent(_0x37cd21);
      }
    }
    if (_0xc33482.mentions) {
      _0x2ee427[_0x463761].contextInfo.mentionedJid = _0xc33482.mentions;
    }
    if (_0x463761 == "conversation") {
      _0x2ee427 = {
        'extendedTextMessage': {
          'text': _0x2ee427[_0x463761]
        }
      };
      _0x463761 = "extendedTextMessage";
    }
    _0x2ee427[_0x463761] = {
      ...(_0x2ee427[_0x463761] || _0x2ee427),
      ..._0xc33482
    };
    console.log(_0x2ee427);
    const _0x6beef7 = await generateWAMessageFromContent(_0x161fcc, _0x2ee427, _0xc33482);
    await this.relayMessage(_0x161fcc, _0x6beef7.message, {
      'messageId': _0xc33482.messageId,
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
    return _0x6beef7;
  }
}
module.exports = {
  'Client': Client
};