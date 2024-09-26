const Base = require('./Base');
const fs = require('fs');
const config = require('../../../config');
const fileType = require('file-type');
const { getBuffer, isUrl } = require('../exports/mods/patch');

class Sticker extends Base {
 constructor(client, data) {
  super(client);
  if (data) this._patch(data);
 }

 _patch(data) {
  this.key = data.key;
  this.id = data.key.id;
  this.jid = data.key.remoteJid;
  this.isGroup = data.isGroup;
  this.participant = data.sender;
  this.isBaileys = this.id.startsWith('BAE5');
  this.message = data.message.stickerMessage;
  this.pushName = data.pushName;
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0]);
  } catch {
   this.sudo = false;
  }
  this.timestamp = typeof data.messageTimestamp === 'object' ? data.messageTimestamp.low : data.messageTimestamp;
  this.sticker = true;

  return super._patch(data);
 }

 async downloadMediaMessage() {
  let buff = await this.m.download();
  let name = new Date().getTime().toString();
  await fs.promises.writeFile(name, buff);
  return name;
 }

 async sendFile(content, options = {}) {
  let { data } = await this.client.getFile(content);
  let type = await fileType.fromBuffer(data);
  return this.client.sendMessage(this.jid, { [type.mime.split('/')[0]]: data, ...options }, { ...options });
 }

 async reply(text, opt = {}) {
  return this.client.sendMessage(
   this.jid,
   {
    text: require('util').format(text),
    ...opt
   },
   { ...opt, quoted: this }
  );
 }
 async send(jid, text, opt = {}) {
  return this.client.sendMessage(
   jid,
   {
    text: require('util').format(text),
    ...opt
   },
   { ...opt }
  );
 }

 async sendMessage(content, opt = { packname: 'Xasena', author: 'X-electra' }, type = 'text') {
  switch (type.toLowerCase()) {
   case 'text':
    {
     return this.client.sendMessage(
      this.jid,
      {
       text: content,
       ...opt
      },
      { ...opt }
     );
    }
    break;
   case 'image':
    {
     if (Buffer.isBuffer(content)) {
      return this.client.sendMessage(this.jid, { image: content, ...opt }, { ...opt });
     } else if (isUrl(content)) {
      return this.client.sendMessage(this.jid, { image: { url: content }, ...opt }, { ...opt });
     }
    }
    break;
   case 'video': {
    if (Buffer.isBuffer(content)) {
     return this.client.sendMessage(this.jid, { video: content, ...opt }, { ...opt });
    } else if (isUrl(content)) {
     return this.client.sendMessage(this.jid, { video: { url: content }, ...opt }, { ...opt });
    }
   }
   case 'audio':
    {
     if (Buffer.isBuffer(content)) {
      return this.client.sendMessage(this.jid, { audio: content, ...opt }, { ...opt });
     } else if (isUrl(content)) {
      return this.client.sendMessage(this.jid, { audio: { url: content }, ...opt }, { ...opt });
     }
    }
    break;
   case 'template':
    let optional = await generateWAMessage(this.jid, content, opt);
    let message = {
     viewOnceMessage: {
      message: {
       ...optional.message
      }
     }
    };
    await this.client.relayMessage(this.jid, message, {
     messageId: optional.key.id
    });

    break;
  }
 }

 async forward(jid, message, options = {}) {
  let m = generateWAMessageFromContent(jid, message, {
   ...options,
   userJid: this.client.user.id
  });
  await this.client.relayMessage(jid, m.message, {
   messageId: m.key.id,
   ...options
  });
  return m;
 }
 async sendFromUrl(url, options = {}) {
  let buff = await getBuffer(url);
  let mime = await fileType.fromBuffer(buff);
  let type = mime.mime.split('/')[0];
  if (type === 'audio') {
   options.mimetype = 'audio/mpeg';
  }
  if (type === 'application') type = 'document';
  return this.client.sendMessage(this.jid, { [type]: buff, ...options }, { ...options });
 }

 async PresenceUpdate(status) {
  await sock.sendPresenceUpdate(status, this.jid);
 }
 async delete(key) {
  await this.client.sendMessage(this.jid, { delete: key });
 }
 async updateName(name) {
  await this.client.updateProfileName(name);
 }
 async getPP(jid) {
  return await this.client.profilePictureUrl(jid, 'image');
 }
 async setPP(jid, pp) {
  if (Buffer.isBuffer(pp)) {
   await this.client.updateProfilePicture(jid, pp);
  } else {
   await this.client.updateProfilePicture(jid, { url: pp });
  }
 }
 /**
  *
  * @param {string} jid
  * @returns
  */
 async block(jid) {
  await this.client.updateBlockStatus(jid, 'block');
 }
 /**
  *
  * @param {string} jid
  * @returns
  */
 async unblock(jid) {
  await this.client.updateBlockStatus(jid, 'unblock');
 }
 /**
  *
  * @param {array} jid
  * @returns
  */
 async add(jid) {
  return await this.client.groupParticipantsUpdate(this.jid, jid, 'add');
 }
 /**
  *
  * @param {array} jid
  * @returns
  */
 async kick(jid) {
  return await this.client.groupParticipantsUpdate(this.jid, jid, 'remove');
 }

 /**
  *
  * @param {array} jid
  * @returns
  */
 async promote(jid) {
  return await this.client.groupParticipantsUpdate(this.jid, jid, 'promote');
 }
 /**
  *
  * @param {array} jid
  * @returns
  */
 async demote(jid) {
  return await this.client.groupParticipantsUpdate(this.jid, jid, 'demote');
 }
}

module.exports = Sticker;
