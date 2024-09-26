const {
  prepareWAMessageMedia
} = require("@whiskeysockets/baileys");
class Serialize {
  constructor(_0x298d42, _0x1a0f24, _0x83f6b5) {
    Object.defineProperty(this, "client", {
      'value': _0x298d42
    });
    this.jid = _0x1a0f24.from;
    Object.defineProperty(this, "store", {
      'value': _0x83f6b5
    });
  }
  async ["reportUser"](_0xfd66ad) {
    await this.client.query({
      'tag': 'iq',
      'attrs': {
        'to': _0xfd66ad + "@s.whatsapp.net",
        'type': "set",
        'xmlns': "spam"
      },
      'content': [{
        'tag': "spam_list",
        'attrs': {
          'spam_flow': "account_info_report",
          'jid': _0xfd66ad + "@s.whatsapp.net"
        }
      }]
    });
  }
  async ["emit"](_0x1c615e, _0x3ab4d4 = "messages.upsert") {
    if (_0x3ab4d4 === "messages.upsert") {
      _0x1c615e = {
        'messages': [_0x1c615e],
        'type': "notify"
      };
    }
    await this.client.ev.emit(_0x3ab4d4, _0x1c615e);
  }
  async ["generateProfileCatalog"](_0x25c020, _0x2d8241) {
    const _0x142982 = await prepareWAMessageMedia({
      'image': _0x25c020
    }, {
      'upload': this.client.waUploadToServer
    });
    return {
      'productMessage': {
        'product': {
          'productImage': _0x142982.imageMessage,
          'productId': _0x2d8241.productId || "24423456273920498",
          'title': _0x2d8241.title || "baraka 🍓",
          'description': _0x2d8241.description || "ᴍᴀᴅᴇ ᴡɪᴛʜ 🍉",
          'currencyCode': _0x2d8241.currencyCode || "INR",
          'priceAmount1000': _0x2d8241.priceAmount || "555555555555555",
          'productImageCount': _0x2d8241.productImageCount || 1,
          'salePriceAmount1000': _0x2d8241.salePriceAmount || "555555555555555"
        },
        'businessOwnerJid': this.client.user.jid,
        'contextInfo': {
          'mentionedJid': _0x2d8241.mentionedJid || [],
          'groupMentions': _0x2d8241.groupMentions || [],
          'forwardingScore': _0x2d8241.forwardingScore || 5555,
          'isForwarded': _0x2d8241.isForwarded !== undefined ? _0x2d8241.isForwarded : true
        }
      }
    };
  }
}
module.exports = {
  'Serialize': Serialize
};