const Base = require('./Base');
const fs = require('fs');
const fileType = require('file-type');
const config = require('../../../config');
const { parsedJid } = require('../exports/mods/patch');
const { tmpdir } = require('os');

class ReplyMessage extends Base {
 constructor(client, data) {
  super(client);
  if (data) this._patch(data);
 }
 _patch(data) {
  this.key = data.key;
  this.id = data.stanzaId;
  this.isBaileys = this.id.startsWith('BAE5') || this.id.length === 16;
  this.jid = data.participant;
  try {
   this.sudo = config.SUDO.split(',').includes(this.participant.split('@')[0]);
  } catch {
   this.sudo = false;
  }
  this.fromMe = parsedJid(this.client.user.jid)[0] === parsedJid(this.jid)[0];
  const { quotedMessage } = data;
  if (quotedMessage) {
   let type = Object.keys(quotedMessage)[0];
   if (type === 'extendedTextMessage') {
    this.text = quotedMessage[type].text;
    this.mimetype = 'text/plain';
   } else if (type === 'conversation') {
    this.text = quotedMessage[type];
    this.mimetype = 'text/plain';
   } else if (type === 'stickerMessage') {
    this.mimetype = 'image/webp';
    this.sticker = quotedMessage[type];
   } else {
    let mimetype = quotedMessage[type]?.mimetype ? quotedMessage[type].mimetype : type;
    if (mimetype?.includes('/')) {
     this.mimetype = mimetype;
     let mime = mimetype.split('/')[0];
     this[mime] = quotedMessage[type];
    } else {
     this.mimetype = mimetype;
     this.message = quotedMessage[type];
    }
   }
  }
  return super._patch(data);
 }

 async downloadMediaMessage() {
  const buff = await this.m.quoted.download();
  const type = await fileType.fromBuffer(buff);
  await fs.promises.writeFile(tmpdir() + type.ext, buff);
  return tmpdir() + type.ext;
 }
}

module.exports = ReplyMessage;
