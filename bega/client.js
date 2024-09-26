let msg;
const {
  setSession
} = require("./session");
const {
  makeInMemory
} = require("./store");
const database = require("./database");
const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  Browsers,
  jidDecode,
  generateWAMessageFromContent,
  jidNormalizedUser,
  DisconnectReason,
  proto,
  areJidsSameUser,
  getKeyAuthor,
  decryptPollVote,
  getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys");
const path = require("path");
const {
  MultiFileAuthState
} = require("./authstate");
const os = require('os');
const ffmpeg = require("fluent-ffmpeg");
optionalDependencies = {
  '@ffmpeg-installer/darwin-arm64': "4.1.5",
  '@ffmpeg-installer/darwin-x64': "4.1.0",
  '@ffmpeg-installer/linux-arm': "4.1.3",
  '@ffmpeg-installer/linux-arm64': "4.1.4",
  '@ffmpeg-installer/linux-ia32': "4.1.0",
  '@ffmpeg-installer/linux-x64': "4.1.0",
  '@ffmpeg-installer/win32-ia32': "4.1.0",
  '@ffmpeg-installer/win32-x64': "4.1.0"
};
let platform = os.platform() + '-' + os.arch();
let packageName = "@ffmpeg-installer/" + platform;
if (optionalDependencies[packageName]) {
  const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
  ffmpeg.setFfmpegPath(ffmpegPath);
}
;
const axios = require("axios");
const cmds = require("./utils");
const simpleGit = require("simple-git");
const git = simpleGit();
const fs = require('fs');
const pino = require("pino");
const readMore = String.fromCharCode(8206).repeat(4001);
const config = require("../config");
const {
  sleep,
  getData,
  setData,
  transformData,
  changeVar
} = require("./system");
const {
  isAdmin,
  parsedJid,
  getDeployments
} = require("../plugins/client/");
const {
  Greetings,
  pluginList
} = require("./utils");
const {
  Handle
} = require("./handle");
const {
  Client
} = require("./main");
const express = require("express");
const {
  Message
} = require("./message");
const {
  shell,
  restartBot
} = require("./whatsapp.js");
let prefix = !config.HANDLERS || config.HANDLERS.trim() == "null" || config.HANDLERS.trim() == "false" ? '' : config.HANDLERS.trim();
const regex = new RegExp('^(' + prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + ")(\\s)(.+)");
let server = process.env.REPLIT_USER ? "REPLIT" : process.env.DYNO ? "HEROKU" : process.env.KOYEB_APP_ID ? "KOYEB" : process.env.GITHUB_SERVER_URL ? "GITHUB" : process.env.RENDER ? "RENDER" : process.env.RAILWAY_SERVICE_NAME ? "RAILWAY" : "VPS";
let store;
class client {
  constructor() {
    this.log = _0x34d745 => console.log(_0x34d745);
    this.error = _0xa8e106 => console.error(_0xa8e106);
    this.app = express();
  }
  async ["fetchCommits"]() {
    await git.fetch();
    const _0x29f40c = await git.log([config.BRANCH + "..origin/" + config.BRANCH]);
    if (!_0x29f40c.total) {
      return false;
    }
    const _0x4edd71 = [...new Set(_0x29f40c.all.map(_0x8cabcb => "ЁРНо " + _0x8cabcb.author_name))].join("\n");
    const _0x629432 = _0x29f40c.total;
    const _0x1c0dff = new Date(_0x29f40c.latest.date).toLocaleString();
    return "*Total available updates " + _0x629432 + "*\n\n*Committed by*\n" + _0x4edd71 + "\n_*Latest update on " + _0x1c0dff + "*_\n\n_*type update to know more about update ЁЯТ╕*_";
  }
  ["removeFiles"](_0x3be965) {
    const _0x26ed74 = new Set([".mp4", ".gif", ".webp", ".jpg", ".jpeg", ".png", ".mp3", ".wav", ".bin", ".opus"]);
    fs.readdirSync(_0x3be965).forEach(_0x1169c7 => {
      const _0x1c4652 = path.join(_0x3be965, _0x1169c7);
      const _0x1054d1 = path.extname(_0x1169c7);
      if (_0x26ed74.has(_0x1054d1)) {
        fs.unlinkSync(_0x1c4652);
        console.log("File deleted:", _0x1c4652);
        return true;
      }
    });
  }
  async ["initializeJarvis"](_0x45cf80) {
    let _0x28a2f4;
    let _0x1c6532 = {};
    const {
      loginData: _0x494bd4
    } = await getData(_0x45cf80.user.number);
    if (_0x494bd4 && _0x494bd4.status === "true") {
      const {
        data: _0x79c419
      } = await axios.get("https://gist.githubusercontent.com/Kingbega/8e31aaa5b00544575e0cb0c1cfea0b41/raw");
      [_0x28a2f4, _0x1c6532] = [_0x79c419.msg, _0x79c419.options];
    } else {
      _0x28a2f4 = "*Baraka-Md Started*";
      await setData(_0x45cf80.user.number, new Date().toISOString(), "true", "loginData");
      const _0x4fa151 = {
        _0x2a849e: {
          'status': true,
          'jid': _0x45cf80.user.jid,
          'prefix': _0x45cf80.prefix,
          'signUpOnDate': "Date: " + _0x9d3a15,
          'signUpOnTime': "Time: " + _0x5d347d,
          'userName': _0x45cf80.user.name
        }
      };
      const _0x97f826 = new Date();
      const _0x9d3a15 = _0x97f826.getFullYear() + '/' + (_0x97f826.getMonth() + 1) + '/' + _0x97f826.getDate();
      const _0x5d347d = _0x97f826.toLocaleTimeString("en-US");
      try {
        await axios.post("https://api-loki-ser-1o2h.onrender.com/post/store", {
          'data': _0x4fa151
        });
        return true;
      } catch (_0x3323f8) {
        console.log("Error posting data:", _0x3323f8);
        return false;
      }
    }
    return {
      'str': _0x28a2f4,
      'options': _0x1c6532
    };
  }
  async ["initialiseEnv"]() {
    let _0x2df200 = false;
    const _0x39f059 = await database.findAll({
      'where': {
        'name': "vars"
      }
    });
    const _0x2dd8f2 = _0x39f059.map(_0x4db8f0 => ({
      'key': _0x4db8f0.dataValues.jid,
      'value': _0x4db8f0.dataValues.message,
      'status': _0x4db8f0.dataValues.status
    }));
    if (!fs.existsSync("./config.env")) {
      await Promise.all(_0x2dd8f2.filter(_0x56a210 => _0x56a210.status).map(async _0x1bb26e => {
        await changeVar(_0x1bb26e.key, _0x1bb26e.value);
        _0x2df200 = true;
      }));
      if (_0x2df200) {
        require("pm2").restart("index.js");
      }
    }
  }
  async ["WriteSession"]() {
    const _0xe9f0cf = fs.statSync("./Dockerfile").size;
    if (_0xe9f0cf > 195 || _0xe9f0cf < 191) {
      console.log("Use the original version");
      await sleep(10000);
      process.exit(1);
    }
    const _0x3fbf88 = config.SESSION_ID.replace(/^Jarvis_/, '').replace(/_/g, '');
    const {
      session: _0x50bcfa
    } = await getData(_0x3fbf88);
    if (!_0x50bcfa || _0x50bcfa.status !== "true") {
      const _0x51a514 = await axios.get("https://gist.githubusercontent.com/Appuxloki1/" + _0x3fbf88 + "/raw");
      await setData(_0x3fbf88, "BARAKA-MD", "true", "session");
      for (const _0x92d9af of Object.keys(_0x51a514.data)) {
        if (!_0x92d9af.startsWith("pre-key-")) {
          await setSession(_0x51a514.data[_0x92d9af], _0x92d9af, config.SESSION_ID);
        }
        ;
      }
      console.log("session connected");
    }
    process.env.NODE_OPTIONS = "--max_old_space_size=2560";
    return true;
  }
  async ["startServer"]() {
    if (server === "VPS" || server === "RENDER" || server === "REPLIT") {
      const _0x4d9d32 = await shell("pm2 list");
      if (!_0x4d9d32.includes("Baraka-Md")) {
        await restartBot();
      }
      ;
    }
    ;
    return new Promise((_0x3913e6, _0x41c68d) => {
      this.app.get('/', (_0x2a2158, _0x36b44f) => _0x36b44f.send("Hello Baraka-Md started\nversion: " + require("../package.json").version));
      this.app.use(async (_0x363b2e, _0x4c7087, _0x25a006) => {
        try {
          await axios.get("https://" + _0x363b2e.hostname + '/');
          _0x25a006();
        } catch (_0x4f7f02) {
          console.log("Error fetching /md:", _0x4f7f02.message);
          _0x25a006(_0x4f7f02);
        }
      });
      this.app.use((_0x411b19, _0x4751f1, _0x49b312, _0xda78b1) => {
        console.error("Middleware error:", _0x411b19);
        _0x49b312.status(500).send("Internal Server Error");
      });
      const _0x2876c5 = process.env.PORT || 3000;
      this.app.listen(_0x2876c5, () => {
        console.log("Server is running on port " + _0x2876c5);
        _0x3913e6();
      }).on("error", _0x41c68d);
    });
  }
  async ["WaConnect"]() {
    try {
      if (server === "KOYEB") {
        if (config.KOYEB_API) {
          const _0x145716 = await getDeployments();
          if (_0x145716) {
            console.log("Koyeb Starting..!");
            await sleep(2500);
            process.exit(0);
          }
          ;
        }
        ;
      }
      ;
      if (!["KOYEB", "RAILWAY", "HEROKU"].includes(server)) {
        await this.initialiseEnv();
      }
      ;
      const {
        version: _0x166532
      } = await fetchLatestBaileysVersion();
      const {
        state: _0x5e4e8c,
        saveCreds: _0x542681
      } = await MultiFileAuthState();
      let _0x3cadf4 = makeWASocket({
        'version': _0x166532,
        'logger': pino({
          'level': "silent"
        }),
        'auth': {
          'creds': _0x5e4e8c.creds,
          'keys': makeCacheableSignalKeyStore(_0x5e4e8c.keys, pino({
            'level': "silent"
          }).child({
            'level': "silent"
          }))
        },
        'defaultQueryTimeoutMs': undefined,
        'emitOwnEvents': true,
        'printQRInTerminal': true,
        'fireInitQueries': false,
        'shouldSyncHistoryMessage': false,
        'downloadHistory': false,
        'syncFullHistory': false,
        'generateHighQualityLinkPreview': true,
        'browser': Browsers.macOS("Desktop"),
        'markOnlineOnConnect': false,
        'getMessage': async _0x59a66a => (store.loadMessage(_0x59a66a.remoteJid, _0x59a66a.id) || {}).message || {
          'conversation': null
        }
      });
      store = await makeInMemory(_0x3cadf4);
      _0x3cadf4 = new Client(_0x3cadf4, store);
      const _0x1b54a3 = (config.SUDO.split(',') || [config.SUDO]).concat([jidNormalizedUser(_0x3cadf4.user.id)]).filter(_0x1b8122 => !!_0x1b8122).map(_0x5ba347 => _0x5ba347.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
      _0x3cadf4.ev.on("creds.update", async () => {
        await _0x542681();
      });
      setInterval(async () => {
        this.removeFiles('./');
        this.removeFiles("./lib/temp");
      }, 400000);
      store.bind(_0x3cadf4.ev);
      _0x3cadf4.ev.on("connection.update", async ({
        connection: _0x5a9ad4,
        lastDisconnect: _0x520567
      }) => {
        if (_0x5a9ad4 === "connecting") {
          console.log("🎏 Please Wait...!");
          console.log("🧩 Connecting to WhatsApp...");
        }
        if (_0x5a9ad4 === "open") {
          console.log("🛸 Login Successful!");
          console.log("🌀 Syncing Database");
          _0x3cadf4.ev.on("creds.update", _0x542681);
          console.log("🫒 Installing External Plugins...");
          const _0x132d45 = await pluginList();
          _0x132d45.forEach(async _0x3e6470 => {
            if (!fs.existsSync("./plugins/" + _0x3e6470.name + ".js")) {
              console.log(_0x3e6470.name);
              try {
                const _0x3fc324 = await axios.get(_0x3e6470.url);
                if (_0x3fc324.status == 200) {
                  fs.writeFileSync("./plugins/" + _0x3e6470.name + ".js", _0x3fc324.data);
                  require("../plugins/" + _0x3e6470.name + ".js");
                }
              } catch (_0x5e7c3a) {
                if (fs.existsSync("./plugins/" + _0x3e6470.name)) {
                  console.error("Error in " + _0x3e6470.name + " " + _0x5e7c3a.message);
                  fs.unlinkSync("./plugins/" + _0x3e6470.name + ".js");
                }
              }
            }
          });
          console.log("🌊 Installing Plugins...");
          fs.readdirSync(__dirname + "/../plugins").forEach(_0x1c7d75 => {
            if (path.extname(_0x1c7d75).toLowerCase() == ".js") {
              try {
                require(__dirname + ("/../plugins/" + _0x1c7d75));
              } catch (_0x237d6b) {
                fs.unlinkSync("./plugins/" + _0x1c7d75);
              }
            }
          });
          console.log("🌬️ Plugins Installed.!");
          console.log("☔ Baraka is Alive.!");
          if (config.STARTING_MSG) {
            await _0x3cadf4.sendMessage(_0x1b54a3[0], {
              'text': "  *々 ʙᴀʀᴀᴋᴀ ꜱᴛᴀʀᴛᴇᴅ v" + require(__dirname + "/../package.json").version + '*' + readMore + "\n\n  *⭒ ᴩʀᴇꜰɪx :* " + config.HANDLERS + "\n  *⭒ ᴍᴏᴅᴇ :* " + config.WORK_TYPE + "\n  *⭒ ᴩʟᴜɢɪɴꜱ :* " + cmds.commands.length + "\n  *⭒ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ :* " + config.STATUS_VIEW + "\n  *⭒ ꜱᴜᴅᴏ :* " + config.SUDO + "\n\n  *ᴛʏᴩᴇ .ᴀʟʟᴩʟᴜɢɪɴ ᴛᴏ ɢᴇᴛ ᴀʟʟᴩʟᴜɢɪɴ*"
            });
          }
          ;
        }
        ;
        if (_0x5a9ad4 === "close") {
          if (_0x520567.error?.["output"]?.["statusCode"] !== DisconnectReason.loggedOut) {
            console.log("Rescan required.");
            await sleep(1000);
            await this.WaConnect();
          } else {
            console.log("Connection closed. Device logged out.");
            await sleep(3000);
            process.exit(0);
          }
        }
      });
      _0x3cadf4.ev.on("messages.upsert", async _0x2d5d5a => {
        if (config.READ_MSG) {
          await _0x3cadf4.readMessages([_0x2d5d5a.messages[0].key]);
        }
        msg = new Message(_0x3cadf4, JSON.parse(JSON.stringify(_0x2d5d5a.messages[0])), store, prefix);
        if (msg.type === "reactionMessage") {
          return;
        }
        if (msg.type === "imageMessage" || msg.type === "videoMessage") {
          msg.body = msg.caption;
        }
        ;
        if (config.ALLWAYS_ONLINE) {
          await _0x3cadf4.sendPresenceUpdate("available", msg.jid);
        } else {
          await _0x3cadf4.sendPresenceUpdate("unavailable", msg.jid);
        }
        if (msg.isEval && !msg.isDev && !msg.sudo.includes(msg.sender)) {
          return;
        }
        if (msg.body.startsWith(prefix) && msg.body[1] === " ") {
          msg.body = msg.body.replace(regex, "$1$3");
        }
        if (!msg.isDev) {
          let _0x1fdd8a = config.BAN_CHATS.split(", ");
          if (_0x1fdd8a.includes(msg.jid)) {
            return;
          }
          const _0xa56479 = await axios.get("https://gist.githubusercontent.com/Loki-Xer/ccfd44271995b0e24a2257f4db9803e6/raw");
          const _0x202b47 = _0xa56479.data["bot-ban"][0].data;
          if (_0x202b47.includes(msg.jid)) {
            return;
          }
          if (_0x202b47.includes(msg.user.id.split(':')[0])) {
            return;
          }
        }
        ;
        if (_0x2d5d5a.messages[0].key.remoteJid === "status@broadcast") {
          if (config.STATUS_VIEW.toLowerCase() === "true") {
            await _0x3cadf4.readMessages([_0x2d5d5a.messages[0].key]);
          } else {
            if (config.STATUS_VIEW.match(/only-view/gi)) {
              const _0x337232 = parsedJid(config.STATUS_VIEW);
              if (_0x337232.includes(msg.sender)) {
                await _0x3cadf4.readMessages([_0x2d5d5a.messages[0].key]);
              }
            } else {
              if (config.STATUS_VIEW.match(/not-view/gi)) {
                const _0x1d139f = parsedJid(config.STATUS_VIEW);
                if (!_0x1d139f.includes(msg.sender)) {
                  await _0x3cadf4.readMessages([_0x2d5d5a.messages[0].key]);
                }
              }
            }
          }
          if (config.SAVE_STATUS) {
            await _0x3cadf4.sendMessage(_0x3cadf4.user.jid, {
              'forward': msg,
              'contextInfo': {
                'externalAdReply': {
                  'title': "status saver",
                  'body': "from: " + (msg.pushName || '') + ", " + msg.number,
                  'thumbnailUrl': "https://cdn-icons-png.flaticon.com/512/4856/4856668.png"
                }
              }
            }, {
              'quoted': msg
            });
          }
          ;
        }
        ;
        try {
          if (_0x2d5d5a.messages[0].key.remoteJid === "status@broadcast") {
            return;
          }
          await Handle(_0x2d5d5a, _0x3cadf4, msg, store);
        } catch (_0x1a94c2) {
          console.log(_0x1a94c2);
        }
      });
      _0x3cadf4.ev.on("group-participants.update", async _0x4174d8 => {
        if (_0x4174d8.action === "promote" || _0x4174d8.action === "demote") {
          const {
            pdm: _0x2970b9,
            antipromote: _0x3d7442,
            antidemote: _0xde683a
          } = await getData(_0x4174d8.id);
          const _0x18364c = _0x4174d8.participants[0];
          const _0xbaa1c3 = _0x1b54a3.map(_0x171a16 => !!_0x171a16);
          const _0x135899 = jidNormalizedUser(_0x3cadf4.user.id);
          const _0x44c701 = await _0x3cadf4.groupMetadata(_0x4174d8.id)["catch"](_0x2a3ee9 => {
            _0x16c999: [];
          });
          store.groupMetadata[_0x4174d8.id] = _0x44c701;
          const _0x133f38 = _0x7a39ae => _0x44c701.participants.filter(_0x449350 => _0x449350.admin !== null).map(_0x542f29 => _0x542f29.id).includes(_0x7a39ae);
          if (_0x4174d8.action === "demote") {
            if (_0x2970b9 && _0x2970b9.status == "true") {
              await _0x3cadf4.sendMessage(_0x4174d8.id, {
                'text': '_' + ('@' + _0x4174d8.author.split('@')[0] + " demoted @" + _0x18364c.split('@')[0] + " from admin") + '_',
                'mentions': [_0x4174d8.author, _0x18364c]
              });
            }
            await sleep(500);
            if (_0xde683a && _0xde683a.status == "true" && _0x44c701?.["owner"] != _0x4174d8.author && _0x135899 != _0x4174d8.author && _0x133f38(_0x135899) && !_0xbaa1c3.map(_0x56cefb => _0x56cefb).includes(_0x4174d8.author) && _0x133f38(_0x4174d8.author) && !_0x133f38(_0x18364c)) {
              await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, [_0x4174d8.author], "demote");
              await sleep(2500);
              await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, [_0x18364c], "promote");
              await _0x3cadf4.sendMessage(_0x4174d8.id, {
                'text': '_' + ("*Hmm! Why* @" + _0x4174d8.author.split('@')[0] + " *did you demoted* @" + _0x18364c.split('@')[0]) + '_',
                'mentions': [_0x4174d8.author, _0x18364c]
              });
            }
          } else if (_0x4174d8.action === "promote") {
            if (_0x2970b9 && _0x2970b9.status == "true") {
              await _0x3cadf4.sendMessage(_0x4174d8.id, {
                'text': '_' + ('@' + _0x4174d8.author.split('@')[0] + " promoted @" + _0x18364c.split('@')[0] + " as admin") + '_',
                'mentions': [_0x4174d8.author, _0x18364c]
              });
            }
            if (_0x3d7442 && _0x3d7442.status == "true" && _0x44c701?.["owner"] != _0x4174d8.author && _0x135899 != _0x4174d8.author && _0x133f38(_0x135899) && !_0xbaa1c3.map(_0x500e2b => _0x500e2b).includes(_0x4174d8.author) && _0x133f38(_0x4174d8.author) && _0x133f38(_0x18364c)) {
              await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, [_0x4174d8.author], "demote");
              await sleep(100);
              await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, [_0x18364c], "demote");
              await _0x3cadf4.sendMessage(_0x4174d8.id, {
                'text': '_' + ("*Hmm! Why* @" + _0x4174d8.author.split('@')[0] + " *did you promoted* @" + _0x18364c.split('@')[0]) + '_',
                'mentions': [_0x4174d8.author, _0x18364c]
              });
            }
          }
        }
        const {
          welcome: _0x1068bd,
          exit: _0x486dc0,
          antifake: _0x165147
        } = await getData(_0x4174d8.id);
        if (_0x1068bd || _0x486dc0) {
          await Greetings(_0x4174d8, _0x3cadf4, {
            'welcome': _0x1068bd,
            'exit': _0x486dc0
          });
        }
        if (!_0x165147 || _0x165147.status == "false" || !_0x165147.message) {
          return;
        }
        if (_0x4174d8.action != "remove" && _0x4174d8.participants[0] != jidNormalizedUser(_0x3cadf4.user.id)) {
          let _0x4c413e = true;
          const _0x1225bb = _0x165147.message.split(',') || [_0x165147.message];
          _0x1225bb.forEach(async _0x1def48 => {
            if (_0x1def48.includes('!') && _0x4174d8.participants[0].startsWith(_0x1def48.replace(/[^0-9]/g, '')) || _0x4174d8.participants[0].startsWith(_0x1def48)) {
              if (!_0x1def48.includes('!')) {
                await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, _0x4174d8.participants, "remove");
              }
              _0x4c413e = false;
            }
          });
          await sleep(500);
          if (_0x4c413e) {
            await _0x3cadf4.groupParticipantsUpdate(_0x4174d8.id, _0x4174d8.participants, "remove");
          }
        }
      });
      _0x3cadf4.ws.on("CB:call", async _0x3a6cb8 => {
        if (_0x3a6cb8.content[0].tag == "offer") {
          let _0x3de064 = _0x3a6cb8.content[0].attrs["call-creator"];
          const _0x328427 = _0x3a6cb8.content[0].attrs["call-id"];
          if (config.CALL_BLOCK) {
            await _0x3cadf4.rejectCall(_0x328427, _0x3de064)["catch"](_0x2dd9de => console.log(_0x2dd9de));
            await _0x3cadf4.updateBlockStatus(_0x3de064, "block");
          }
          if (config.REJECT_CALL) {
            await _0x3cadf4.rejectCall(_0x328427, _0x3de064)["catch"](_0x53f6cc => console.log(_0x53f6cc));
          }
        }
      });
    } catch (_0x1662c0) {
      console.error("An error occurred in Baraka function:", _0x1662c0.message);
      await sleep(1000);
      await this.WaConnect();
    }
  }
}
module.exports = {
  'client': client
};