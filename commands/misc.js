/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const {
    isUrl,
    System,
    config,
    LokiXer,
    getJson,
    postJson,
    isPrivate,
    ssweb,
    extractUrlFromMessage
  } = require("../lib/");
  const axios = require("axios");
  
  
  System({
      pattern: "wame",
      fromMe: isPrivate,
      desc: "wame generator",
      type: "misc",
  },async (message, match) => {
      if (!message.quoted) return message.reply("_*Reply to a user*_");
      let sender = 'https://wa.me/' + (message.reply_message.sender || message.mention[0] || message.text).split('@')[0];
      await message.reply(sender);
  });

  System({
  pattern: 'ss ?(.*)',
  fromMe: isPrivate,
  desc: 'Takes a screenshot of a website',
  type: 'misc',
}, async (message, match, m) => {
  if (!match) return await message.reply(`*Please provide a URL*`);
  const url = match;
  const response = await ssweb(url);
  const screenshotUrl = response.iurl; 
  await m.sendFromUrl(screenshotUrl, { quoted: message.data, caption: `*Screenshot of ${url}*` });
});

  System({
      pattern: "save", 
      fromMe: true,
      desc: "used to save messages", 
      type: "misc",
  }, async (message) => {
     if (!message.quoted) return;
     await message.client.forwardMessage(message.user.jid, message.reply_message.message);
  });
  
 
  
  System({
      pattern: "attp",
      fromMe: isPrivate,
      desc: "Text to animated sticker",
      type: "converter",
  }, async (message, match) => {
     match = match || message.reply_message && message.reply_message.text 
     if (!match) return await message.reply("_Give me some text_");       
        await message.send("_making text into attp, it may take up to 1 minute_");
        const buff = await LokiXer(`attp?text=${encodeURIComponent(match)}`);
        const stickerPackNameParts = config.STICKER_PACKNAME.split(";");
        const packname = stickerPackNameParts[0];
        const author = stickerPackNameParts[1];
        await message.send(buff, { packname, author }, "sticker");
  });
  
 
  
  System({
      pattern: 'whois ?(.*)',
      fromMe: isPrivate,
      desc: 'to find how is',
      type: "info",
  }, async (message, match) => {
     let pp;
     let status;
     let user = message.quoted ? message.reply_message.sender : match.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
     if (!user) return message.reply('_Reply to someone/mention_\n*Example:* . whois @user');
     try { pp = await message.client.profilePictureUrl(user, 'image'); } catch { pp = 'https://i.imgur.com/HRl2Um1.jpeg'; }
     try { status = await message.client.fetchStatus(user); } catch { status = 'private'; }
      const date = new Date(status.setAt);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }; 
      let wm = 'https://wa.me/' + user.split('@')[0];
      const setAt = date.toLocaleString('en-US', options);
      const NaMe = await message.store.getName(user);
      await message.send({ url: pp }, { caption: `*Name :* ${NaMe}\n*About :* ${status.status}\n*About Set Date :* ${setAt}\n*whatsapp :* ${wm}`, quoted: message }, 'image');
  });
  
  System({
      pattern: 'tts ?(.*)',
      fromMe: isPrivate,
      desc: 'It converts text to sound.',
      type: 'converter'
  }, async (message, match) => {
      if (!(match || message.quoted.text)) return await message.reply('_Need Text!_\n_Example: tts Hello_\n_tts Hello {en}_');
      let LANG = config.LANG.toLowerCase();
      const lang = match.match("\\{([a-z]+)\\}");
      if (lang) {
        match = match.replace(lang[0], '');
        LANG = lang[1];
        if (message.quoted.text) match = message.reply_message.text;
      }
      const { data } = await axios.post('https://api-loki-ser-1o2h.onrender.com/google/tts', { text: match, lang: LANG}, { responseType: 'arraybuffer' })
      await message.reply(data, { mimetype: 'audio/ogg; codecs=opus', ptt: true }, "audio");
  });
  
  
  System({
      on: 'text',
      fromMe: isPrivate,
      dontAddCommandList: true,
  },async (message) => {
      if (message.isBot || !message.reply_message.fromMe || !message.reply_message.text) return;
      if (!message.body.includes('@') || !message.body.includes('‣')) return;
      if (message.body.includes("1")) {
          const text = message.body.split(" ");
          const data = await postJson(config.API + "scraper/checkmail", { email: text[2] });
      if (data.tempmail.length === 0) return message.reply("_*Mail box is empty*_");
          const formattedResponse = `\n  *Temp Mail ✉️*\n\n${data.tempmail.map((mail, index) => `\n  • *From :* ${mail.from}\n  • *Subject :* ${mail.subject}\n  • *Date :* ${mail.date}\n  • *Id :* ${mail.id}\n  • *Mail Number:* ${index + 1}`).join("\n\n")}`;
          await message.send(formattedResponse);
      } else if (message.body.includes("2")) {
         const { tempmail } = await getJson("https://api.lokiser.xyz/scraper/tempmail");
         const user = await message.store.getName(message.sender);
         const data = await postJson(config.API + "scraper/checkmail", { email: tempmail });
         await message.send(`*_${tempmail}_*\n\n*Dear user, this is your temp mail*\n\n*User: ${user}*\n*Mail received: ${data.tempmail.length}*\n\n\`\`\`1 ‣\`\`\` *Check mail*\n\`\`\`2 ‣\`\`\` *Next mail*\n\n*_Send a Number as reply_*`);
      }
  });

  System({ pattern: "mee", fromMe: true, desc: "self mention", type: "user", }, async (message, match) => { await message.client.sendMessage(message.chat, { text: `@${message.sender.split("@")[0]}`, mentions: [message.sender] }) });
