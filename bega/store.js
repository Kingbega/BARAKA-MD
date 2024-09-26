const {
  isJidGroup,
  jidNormalizedUser,
  getContentType
} = require("@whiskeysockets/baileys");
const PhoneNumber = require("awesome-phonenumber");
async function makeInMemory(_0x177184) {
  let _0x8b8f20 = {
    'state': {
      'connection': "close"
    },
    'messages': {},
    'votes': {
      'poll': {},
      'reaction': {}
    },
    'contacts': {},
    'groupMetadata': {}
  };
  _0x8b8f20.bind = async _0x46dd8e => {
    _0x46dd8e.on("connection.update", async ({
      connection: _0x178d4b
    }) => {
      _0x8b8f20.state.connection = "open";
      if (!_0x8b8f20.contacts[_0x177184.user.jid]) {
        _0x8b8f20.contacts[_0x177184.user.jid] = {
          'number': _0x177184.user.number || '',
          'name': _0x177184.user.name || ''
        };
      }
      ;
    });
    _0x46dd8e.on("group-participants.update", async ({
      id: _0x164a6e,
      action: _0x58ff69
    }) => {
      if (_0x58ff69 !== "promote" || _0x58ff69 !== "demote") {
        _0x8b8f20.groupMetadata[_0x164a6e] = await _0x177184.groupMetadata(_0x164a6e);
      }
      ;
    });
    _0x46dd8e.on("messages.upsert", async _0x14ca96 => {
      if (_0x14ca96.messages[0].key.remoteJid === "status@broadcast") {
        return;
      }
      const _0x2b96e1 = _0x14ca96.messages[0];
      const _0x250810 = _0x2b96e1.key.remoteJid || _0x2b96e1.key.participant;
      const _0x44df33 = jidNormalizedUser(_0x2b96e1.key.fromMe && _0x177184.user?.["jid"] || _0x2b96e1.key.participant || _0x250810 || '');
      const _0x4dc240 = await getContentType(_0x2b96e1.message);
      const _0x50e6a7 = await isJidGroup(_0x250810);
      if (_0x4dc240 === "protocolMessage") {
        return;
      }
      if (!_0x8b8f20.contacts[_0x44df33]) {
        _0x8b8f20.contacts[_0x44df33] = {
          'number': _0x44df33.replace(/[^0-9]/g, '') || '',
          'name': _0x2b96e1.pushName || ''
        };
      }
      ;
      if (_0x50e6a7) {
        if (!_0x8b8f20.groupMetadata[_0x250810]) {
          const _0x2aa20d = await _0x177184.groupMetadata(_0x250810);
          if (_0x2aa20d) {
            _0x8b8f20.groupMetadata[_0x250810] = _0x2aa20d;
          }
          ;
        }
        ;
      }
      ;
      if (_0x4dc240 === "reactionMessage") {
        const _0x385675 = _0x2b96e1.message.reactionMessage.key.id;
        if (_0x8b8f20.votes.reaction[_0x385675]) {
          const _0x52d395 = _0x14ca96.messages[0].message.reactionMessage.text;
          if (!_0x8b8f20.votes.reaction[_0x385675].allowedEmoji || !_0x8b8f20.votes.reaction[_0x385675].allowedEmoji.includes(_0x52d395)) {
            return;
          }
          if (!_0x8b8f20.votes.reaction[_0x385675].vote) {
            _0x8b8f20.votes.reaction[_0x385675].vote = [];
          }
          const _0x7b1544 = _0x8b8f20.votes.reaction[_0x385675].vote.findIndex(_0x2c42e7 => _0x2c42e7.personJid === _0x44df33);
          if (_0x7b1544 !== -1) {
            _0x8b8f20.votes.reaction[_0x385675].vote[_0x7b1544].vote = _0x52d395;
          } else {
            _0x8b8f20.votes.reaction[_0x385675].vote.push({
              'personJid': _0x44df33,
              'vote': _0x52d395
            });
          }
        }
      }
      if (!_0x8b8f20.messages[_0x250810]) {
        _0x8b8f20.messages[_0x250810] = {
          'array': [],
          'get': function (_0x44561a) {
            const _0x177659 = this.array.find(_0x508a28 => _0x508a28.key.id === _0x44561a);
            return _0x177659 ? _0x177659 : false;
          },
          'clear': function () {
            this.array = [];
          },
          'remove': function (_0x2c52e3) {
            this.array = this.array.filter(_0x26df2b => _0x26df2b.key.id !== _0x2c52e3);
          },
          'upsert': function (_0x25d983) {
            const _0x5c6746 = this.array.findIndex(_0x5f24f6 => _0x5f24f6.key.id === _0x25d983.key.id);
            if (_0x5c6746 !== -1) {
              this.array[_0x5c6746] = _0x25d983;
            } else {
              this.array.push(_0x25d983);
            }
          }
        };
      }
      _0x8b8f20.messages[_0x250810].upsert(_0x2b96e1);
    });
  };
  _0x8b8f20.loadMessage = async (_0x563bcd, _0x31ee27) => {
    return _0x8b8f20.messages[_0x563bcd]?.["get"](_0x31ee27) || null;
  };
  _0x8b8f20.getName = async _0x2f4edc => {
    const _0x21327e = jidNormalizedUser(_0x2f4edc);
    if (_0x21327e.endsWith("@g.us")) {
      const _0x1b88e7 = await _0x8b8f20.fetchGroupMetadata(_0x21327e)["catch"](() => ({}));
      return _0x1b88e7.subject || "undefined";
    }
    if (!_0x8b8f20.contacts[_0x21327e]) {
      try {
        const _0x5e1e3c = PhoneNumber('+' + _0x21327e.replace("@s.whatsapp.net", ''));
        return _0x5e1e3c ? _0x5e1e3c.getNumber("international") : null;
      } catch (_0x4d6022) {
        console.error("Error parsing phone number:", _0x4d6022);
        return "unknown";
      }
    }
    const {
      name: _0x3abed1
    } = _0x8b8f20.contacts[_0x21327e];
    return _0x3abed1 || "unknown";
  };
  _0x8b8f20.groupStatus = async (_0x29ebe3, _0x490df4) => {
    const _0x2cd216 = _0x8b8f20.messages[_0x29ebe3]?.["array"] || [];
    const _0xda4095 = _0x2cd216.reduce((_0x40043d, {
      key: {
        participant: _0x4f02ef
      },
      pushName: _0x3995f6
    }) => {
      if (_0x40043d.has(_0x4f02ef)) {
        _0x40043d.get(_0x4f02ef).messageCount++;
      } else {
        _0x40043d.set(_0x4f02ef, {
          'jid': _0x4f02ef,
          'pushName': _0x3995f6,
          'messageCount': 0x1
        });
      }
      return _0x40043d;
    }, new Map());
    const _0x4f2a13 = Array.from(_0xda4095.values(), ({
      jid: _0x4841b6,
      pushName: _0x14e8ff,
      messageCount: _0x116f54
    }) => ({
      'jid': _0x4841b6,
      'pushName': _0x14e8ff,
      'messageCount': _0x116f54
    })).filter(({
      jid: _0x436852
    }) => _0x436852);
    const {
      participants: _0x3cb84b
    } = await _0x8b8f20.fetchGroupMetadata(_0x29ebe3)["catch"](() => ({}));
    const _0x3655dd = new Set(_0x4f2a13.map(({
      jid: _0x4236a2
    }) => _0x4236a2));
    const _0x2de7dd = (_0x3cb84b || []).filter(({
      id: _0x10947b
    }) => !_0x3655dd.has(_0x10947b)).map(({
      id: _0xc9950a,
      admin: _0x3b5ccd
    }) => ({
      'jid': _0xc9950a,
      'role': _0x3b5ccd === "admin" ? "admin" : "ember"
    }));
    return _0x490df4 === "active" ? _0x4f2a13 : _0x2de7dd;
  };
  _0x8b8f20.fetchGroupMetadata = async _0x1bb4d5 => {
    if (!(await isJidGroup(_0x1bb4d5))) {
      return {};
    }
    if (!_0x8b8f20.groupMetadata[_0x1bb4d5]) {
      const _0x50b6e1 = await _0x177184.groupMetadata(_0x1bb4d5);
      if (_0x50b6e1) {
        _0x8b8f20.groupMetadata[_0x1bb4d5] = _0x50b6e1;
      }
      ;
    }
    ;
    return _0x8b8f20.groupMetadata[_0x1bb4d5];
  };
  return _0x8b8f20;
}
module.exports = {
  'makeInMemory': makeInMemory
};