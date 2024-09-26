const {
  sleep,
  getData,
  setData,
  transformData
} = require("./system");
const config = require("../config");
let prefix = !config.HANDLERS || config.HANDLERS.trim() == "null" || config.HANDLERS.trim() == "false" ? '' : config.HANDLERS.trim();
const axios = require("axios");
const {
  jidDecode,
  generateWAMessageFromContent,
  jidNormalizedUser,
  DisconnectReason,
  proto,
  areJidsSameUser,
  WA_DEFAULT_EPHEMERAL,
  getKeyAuthor,
  decryptPollVote,
  getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys");
const {
  Serialize
} = require("./serialize");
const {
  sendMention,
  warnMessage
} = require("./utils");
const cmds = require("./utils");
const {
  isAdmin,
  parsedJid,
  getRandomEmoji
} = require("../plugins/client/");
function isURL(_0x32c168) {
  return /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/.test(_0x32c168);
}
;
async function Handle(_0x1effcc, _0x4af81c, _0x53f058, _0x17985b) {
  const {
    version: _0x1a5cb6
  } = (await axios.get("https://raw.githubusercontent.com/Loki-Xer/Jarvis-md/master/package.json")).data;
  const {
    autoreaction: _0x4cb1eb,
    mention: _0x45b311,
    antiviewones: _0x188b94
  } = await getData(_0x4af81c.user.id);
  if (_0x53f058.type === "templateButtonReplyMessage" && _0x53f058.quoted && _0x53f058.reply_message.fromMe) {
    _0x53f058.body = prefix + _0x1effcc.messages[0].message[_0x53f058.type].selectedId;
    _0x53f058.displayText = _0x1effcc.messages[0].message[_0x53f058.type].selectedId;
  } else if (_0x53f058.type === "interactiveResponseMessage" && _0x53f058.quoted && _0x53f058.reply_message.fromMe) {
    _0x53f058.body = prefix + JSON.parse(_0x1effcc.messages[0].message[_0x53f058.type].nativeFlowResponseMessage.paramsJson).id;
    _0x53f058.displayText = JSON.parse(_0x1effcc.messages[0].message[_0x53f058.type].nativeFlowResponseMessage.paramsJson).id;
  }
  ;
  if (_0x53f058.msg?.["fileSha256"] && _0x53f058.type === "stickerMessage") {
    const {
      setCmd: _0xaf24c
    } = await getData(_0x53f058.msg.fileSha256.join(''));
    _0x53f058.body = _0xaf24c ? prefix + _0xaf24c.message : _0x53f058.body;
  }
  ;
  let _0x280718 = false;
  let _0x1229d5 = false;
  if (_0x53f058.sudo.includes(_0x53f058.sender)) {
    _0x280718 = true;
  }
  ;
  await sleep(1000);
  if (_0x1effcc.type === "notify" && config.PM_BLOCKER && !_0x280718 && _0x53f058.chat.endsWith("@s.whatsapp.net")) {
    await _0x53f058.send(config.PM_BLOCKER_MSG);
    await sleep(300);
    await _0x4af81c.updateBlockStatus(_0x53f058.sender, "block");
  }
  ;
  const _0x453b32 = new Serialize(_0x4af81c, _0x53f058, _0x17985b);
  let _0x367051 = false;
  let _0x365e84 = false;
  if (_0x53f058.reply_message && _0x53f058.reply_message.text && _0x53f058.body && !isNaN(_0x53f058.body)) {
    let _0x35450a = _0x53f058.reply_message.text.split("\n");
    if (_0x35450a[0]) {
      _0x35450a.map(_0x248c37 => {
        if (_0x248c37.includes("```") && _0x248c37.split("```").length == 3 && _0x248c37.match('.')) {
          const _0x552674 = _0x248c37.split('.')[0].replace(/[^0-9]/g, '');
          if (_0x552674 && _0x552674 == _0x53f058.body) {
            _0x365e84 += _0x248c37.split("```")[1];
          }
        }
      });
      if (_0x53f058.reply_message.text.includes('*_') && _0x53f058.reply_message.text.includes('_*')) {
        _0x367051 += " " + _0x53f058.reply_message.text.split('*_')[1].split('_*')[0];
      }
    }
  }
  if (_0x365e84 != false && _0x367051 != false) {
    _0x53f058.body = _0x365e84.replace(false, '') + _0x367051.replace(false, '');
    _0x365e84 = false;
    _0x367051 = false;
  }
  cmds.commands.map(async _0x1bb7bc => {
    if (_0x1bb7bc.fromMe && _0x1bb7bc.fromMe !== "public" && !_0x280718) {
      return;
    }
    if (_0x1bb7bc.fromDev && !_0x53f058.dev.includes(_0x53f058.sender)) {
      return;
    }
    if (_0x1bb7bc.pattern && _0x1bb7bc.pattern.replace(/[^a-zA-Z0-9-+]/g, '')) {
      let _0x154eac = prefix + _0x1bb7bc.pattern.replace(/[^a-zA-Z0-9-+]/g, '');
      if (_0x53f058.body.toLowerCase().startsWith(_0x154eac) && !_0x53f058.isBot) {
        _0x53f058.command = _0x154eac;
        _0x53f058.text = _0x53f058.body.slice(_0x154eac.length).trim();
        _0x1229d5 = true;
        try {
          await _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
        } catch (_0x1d2969) {
          if (config.ERROR_MSG) {
            const _0x4e9fe3 = "*_ERROR REPORT_* \n\n" + ("```𝙲𝙾𝙼𝙼𝙰𝙽𝙳: " + _0x154eac + "```\n") + ("```𝚅𝙴𝚁𝚂𝙸𝙾𝙽: " + require("../package.json").version + "```\n") + ("```𝙻𝙴𝚃𝙴𝚂𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: " + _0x1a5cb6 + "```\n") + ("```𝚄𝚂𝙴𝚁: @" + _0x53f058.sender.replace(/[^0-9]/g, '') + "```\n\n") + ("```𝙼𝙴𝚂𝚂𝙰𝙶𝙴: " + _0x53f058.body + "```\n") + ("```𝙴𝚁𝚁𝙾𝚁?: " + require("util").format(_0x1d2969.message) + "```");
            await _0x4af81c.sendMessage(_0x4af81c.user.id, {
              'text': _0x4e9fe3
            }, {
              'quoted': _0x53f058.data
            });
            if (_0x53f058.isGroup) {
              if (require("util").format(_0x1d2969).includes("Connection Closed")) {
                process.exit(0);
              }
            }
            ;
          } else {
            console.error(_0x1d2969);
            if (_0x53f058.isGroup) {
              if (require("util").format(_0x1d2969).includes("Connection Closed")) {
                process.exit(0);
              }
            }
            ;
          }
        }
      }
    }
    if (!_0x1229d5 && _0x1bb7bc.on === "all" && _0x53f058) {
      _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
    } else {
      if (!_0x1229d5 && _0x1bb7bc.on === "text" && _0x53f058.body) {
        _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
      } else {
        if (!_0x1229d5 && _0x1bb7bc.on === "sticker" && _0x53f058.type === "stickerMessage") {
          _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
        } else {
          if (!_0x1229d5 && _0x1bb7bc.on === "image" && _0x53f058.type === "imageMessage") {
            _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
          } else {
            if (!_0x1229d5 && _0x1bb7bc.on === "video" && _0x53f058.type === "videoMessage") {
              _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
            } else if (!_0x1229d5 && _0x1bb7bc.on === "audio" && _0x53f058.type === "audioMessage") {
              _0x1bb7bc["function"](_0x53f058, _0x53f058.text, _0x53f058, _0x4af81c, _0x453b32);
            }
          }
        }
      }
    }
  });
  if (config.LOG_MSG) {
    if (_0x53f058.message) {
      console.log("Baraka-Md");
      console.log("[ MESSAGE ]");
      console.log(new Date());
      console.log(_0x53f058.displayText || _0x53f058.type) + "\n" + console.log("=> From");
      console.log(_0x53f058.pushName);
      console.log(_0x53f058.number) + "\n" + console.log("=> In");
      console.log(_0x53f058.isGroup ? _0x53f058.pushName : "Private Chat", _0x53f058.from);
    }
    ;
  }
  if (_0x45b311 && _0x53f058.mention.isOwner && _0x45b311.status === "true") {
    await sendMention(_0x53f058, _0x45b311.message);
  }
  if (_0x188b94 && _0x188b94.status === "true" && _0x53f058.viewones) {
    await _0x4af81c.forwardMessage(_0x53f058.chat, _0x53f058.message, {
      'caption': "_*antiviewonce*_",
      'readViewOnce': true,
      'quoted': _0x53f058.data
    });
  }
  ;
  if (_0x4cb1eb && _0x4cb1eb.status === "true" && _0x53f058.key) {
    const _0x4d4cc0 = await getRandomEmoji();
    await _0x53f058.send({
      'text': _0x4d4cc0,
      'key': _0x53f058.key
    }, {}, "react");
  }
  ;
  const _0x51ac38 = await transformData(_0x53f058.user.id, "antidelete");
  if (_0x51ac38) {
    if (_0x51ac38.status == "true" && _0x53f058.type == "protocolMessage") {
      if (_0x51ac38.value === "only/group" && !_0x53f058.isGroup) {
        return;
      }
      if (_0x51ac38.value === "only/pm" && _0x53f058.isGroup) {
        return;
      }
      let _0x25ec29 = await parsedJid(_0x51ac38.action === "chat" ? _0x53f058.jid : _0x51ac38.action === 'pm' ? _0x4af81c.user.jid : _0x51ac38.action);
      const {
        key: _0x4ca22d
      } = _0x1effcc.messages[0].message.protocolMessage;
      if (!_0x4ca22d) {
        return;
      }
      const _0x493c78 = await _0x17985b.loadMessage(_0x53f058.jid, _0x4ca22d.id);
      if (!_0x493c78) {
        return;
      }
      await _0x4af81c.sendMessage(_0x25ec29[0], {
        'forward': _0x493c78,
        'contextInfo': {
          'externalAdReply': {
            'title': "deleted message by " + _0x53f058.pushName,
            'thumbnailUrl': "https://static.vecteezy.com/system/resources/previews/000/442/054/original/delete-vector-icon.jpg"
          }
        }
      }, {
        'quoted': _0x493c78,
        'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
      });
    }
  }
  ;
  if (!_0x53f058.isGroup) {
    return true;
  }
  if (_0x53f058.type === "templateButtonReplyMessage" || _0x53f058.type === "interactiveResponseMessage") {
    return;
  }
  if (_0x1229d5) {
    return true;
  }
  if (_0x53f058.type === "pollUpdateMessage") {
    const _0x4f1d99 = jidNormalizedUser(_0x4af81c.authState.creds.me.id);
    const _0x137d93 = getKeyAuthor(_0x1effcc.messages[0].key, _0x4f1d99);
    const _0x237fab = _0x53f058.message[_0x53f058.type].pollCreationMessageKey;
    if (!_0x237fab) {
      return true;
    }
    const _0x62ea1e = _0x53f058.store.votes.poll[_0x237fab.id];
    if (!_0x62ea1e) {
      return true;
    }
    if (_0x62ea1e.length === 0) {
      return true;
    }
    const {
      onlyOnce: _0x3db1be,
      withPrefix: _0x576bab,
      participates: _0x471494
    } = _0x62ea1e[0];
    if (!_0x471494.includes(_0x53f058.sender)) {
      return true;
    }
    const _0x4ff461 = await _0x4af81c.getMessage(_0x237fab);
    if (!_0x4ff461) {
      return true;
    }
    const _0x379a01 = getKeyAuthor(_0x237fab, _0x4f1d99);
    const _0x49e656 = _0x4ff461.messageContextInfo?.["messageSecret"];
    const _0x217717 = decryptPollVote(_0x53f058.message[_0x53f058.type].vote, {
      'pollEncKey': _0x49e656,
      'pollCreatorJid': _0x379a01,
      'pollMsgId': _0x237fab.id,
      'voterJid': _0x137d93
    });
    const _0x4255df = [{
      'key': _0x237fab,
      'update': {
        'pollUpdates': [{
          'pollUpdateMessageKey': _0x1effcc.messages[0].key,
          'vote': _0x217717,
          'senderTimestampMs': _0x1effcc.messages[0].messageTimestamp
        }]
      }
    }];
    const _0x3869e3 = await getAggregateVotesInPollMessage({
      'message': _0x4ff461,
      'pollUpdates': _0x4255df[0].update.pollUpdates
    });
    const _0x1ab92d = _0x3869e3.filter(_0x5dc5c9 => _0x5dc5c9.voters.length !== 0)[0]?.["name"];
    if (!_0x1ab92d) {
      return true;
    }
    let _0x45fd6c;
    if (_0x576bab) {
      _0x45fd6c = prefix + (_0x62ea1e.find(_0x13be67 => _0x13be67.name === _0x1ab92d)?.['id'] || _0x1ab92d);
    } else {
      _0x45fd6c = _0x62ea1e.find(_0x3a9e3b => _0x3a9e3b.name === _0x1ab92d)?.['id'] || _0x1ab92d;
    }
    if (_0x3db1be) {
      _0x53f058.store.votes.poll[_0x237fab.id] = _0x62ea1e.filter(_0x4697cf => _0x4697cf.name !== _0x1ab92d);
    }
    await _0x4af81c.appenTextMessage(_0x45fd6c, _0x53f058);
  }
  ;
  if (_0x53f058.fromMe) {
    return true;
  }
  if (await isAdmin(_0x53f058, _0x53f058.sender)) {
    return true;
  }
  let _0x532df5 = await isAdmin(_0x53f058, _0x53f058.user.jid);
  if (!_0x532df5) {
    return true;
  }
  const _0x474dc6 = (_0x53f058.body || "ÃŸÃŸÃŸÃŸÃŸ").toLowerCase();
  const {
    participants: _0x2840c8
  } = await _0x17985b.fetchGroupMetadata(_0x53f058.jid)["catch"](_0x2082d5 => {
    _0x4a3245: [];
  });
  const {
    antibot: _0x4d4f42,
    antilink: _0x305a94
  } = await getData(_0x53f058.jid);
  const _0x96c157 = await transformData(_0x53f058.jid, "antiword");
  const _0x549581 = await /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/.test(_0x474dc6);
  if (_0x474dc6 && _0x549581) {
    if (_0x305a94 && _0x305a94.status === "true" && (await /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/.test(_0x474dc6))) {
      if (_0x305a94.message === "warn") {
        await warnMessage(_0x53f058, '', _0x53f058.sender);
        await _0x53f058.send({
          'key': _0x53f058.key
        }, {
          'participant': _0x2840c8
        }, "delete");
      } else if (_0x305a94.message === "kick") {
        await _0x4af81c.groupParticipantsUpdate(_0x53f058.jid, [_0x53f058.sender], "remove");
        await _0x53f058.send({
          'key': _0x53f058.key
        }, {
          'participant': _0x2840c8
        }, "delete");
      } else {
        await _0x53f058.reply(config.ANTILINK_MSG);
        await _0x53f058.send({
          'key': _0x53f058.key
        }, {
          'participant': _0x2840c8
        }, "delete");
      }
    }
  }
  if (_0x96c157 && _0x96c157.status === "true") {
    const _0xeafcc5 = _0x96c157.value ? _0x96c157.value.split(',') || [_0x96c157.value] : [];
    _0xeafcc5.map(async _0xda7327 => {
      if (_0x474dc6.includes(_0xda7327.trim().toLowerCase())) {
        if (_0x96c157.action === "warn") {
          await warnMessage(_0x53f058, '', _0x53f058.sender);
          await _0x53f058.send({
            'key': _0x53f058.key
          }, {
            'participant': _0x2840c8
          }, "delete");
        } else if (_0x96c157.action === "kick") {
          await _0x4af81c.groupParticipantsUpdate(_0x53f058.jid, [_0x53f058.sender], "remove");
          await _0x53f058.send({
            'key': _0x53f058.key
          }, {
            'participant': _0x2840c8
          }, "delete");
        } else {
          await _0x53f058.reply(config.ANTIWORD_MSG);
          await _0x53f058.send({
            'key': _0x53f058.key
          }, {
            'participant': _0x2840c8
          }, "delete");
        }
      }
    });
  }
  if (_0x4d4f42 && _0x4d4f42.status === "true" && _0x53f058.isBot) {
    if (_0x4d4f42.message === "warn") {
      await warnMessage(_0x53f058, '', _0x53f058.sender);
      await _0x53f058.send({
        'key': _0x53f058.key
      }, {
        'participant': _0x2840c8
      }, "delete");
    } else if (_0x4d4f42.message === "kick") {
      await _0x4af81c.groupParticipantsUpdate(_0x53f058.jid, [_0x53f058.sender], "remove");
      await _0x53f058.send({
        'key': _0x53f058.key
      }, {
        'participant': _0x2840c8
      }, "delete");
    } else {
      await _0x53f058.reply(config.ANTIBOT_MSG);
      await _0x53f058.send({
        'key': _0x53f058.key
      }, {
        'participant': _0x2840c8
      }, "delete");
    }
  }
  ;
}
;
module.exports = {
  'Handle': Handle
};