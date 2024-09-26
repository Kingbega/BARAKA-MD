/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const {
    yts,
    isUrl,
    YtInfo,
    System,
    GetYta,
    GetYtv,
    config,
    toAudio,
    Ytsearch,
    getBuffer,
    isPrivate,
    IronMan,
    AddMp3Meta,
    extractUrlFromMessage,
  } = require('../lib/');

/*
System({
      pattern: 'video',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
     const matchUrl = extractUrlFromMessage(match);
     if (isUrl(matchUrl)) {
         const { title } = await YtInfo(matchUrl);
         await message.reply("_*" + "downloading " + title + "*_");
         return await message.send(await GetYtv(matchUrl), { caption: '*made with bega*', quoted: message.data }, 'video');
      } else {
        const data = await Ytsearch(match);
        await message.reply("_*" + "downloading " + data.title + "*_"); 
        return await message.send(await GetYtv(data.url), { caption: '*made with bega*', quoted: message.data }, 'video');
      }
});

System({
      pattern: 'ytv',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
     const matchUrl = extractUrlFromMessage(match);
     if (isUrl(matchUrl)) {
         const { title } = await YtInfo(matchUrl);
         await message.reply("_*" + "downloading " + title + "*_");
         return await message.send(await GetYtv(matchUrl), { caption: '*made with bega*', quoted: message.data }, 'video');
      } else {
        const data = await Ytsearch(match);
        await message.reply("_*" + "downloading " + data.title + "*_"); 
        return await message.send(await GetYtv(data.url), { caption: '*made with bega*', quoted: message.data }, 'video');
      }
});
*/

System({
  pattern: 'video ?(.*)',
  fromMe: isPrivate,
  desc: 'Downloads YouTube video',
  type: 'youtube',
}, async (message, match) => {
  const sq = match || extractUrlFromMessage(message.reply_message?.text);
  if (!sq) return message.reply("*Need a video URL or query.*");
  
  let url = sq;
  if (!isUrl(sq)) {
    if (isUrl(message.reply_message?.text)) {
      url = message.reply_message.text;
    } else {
      const data = await Ytsearch(sq);
      url = data.url;
    }
  }
  const res = await fetch(IronMan(`ironman/dl/ytdl2?url=${url}`));
  const dataa = await res.json();
  if (!dataa) return await message.reply("*No suitable video found.*");
  await message.reply(`- *Downloading ${dataa.title}...*`);
  await message.sendFromUrl(dataa.video, { quoted: message });
});

System({
  pattern: 'ytv ?(.*)',
  fromMe: isPrivate,
  desc: 'Download YouTube videos',
  type: 'youtube',
}, async (message, match) => {
  if (!match) return await message.reply('Please provide a valid YouTube URL.');
  const res = await fetch(IronMan(`ironman/dl/ytdl?url=${match}`));
  const data = await res.json();
  if (!data.download || data.download.length === 0) return await message.reply('No download links found.');
  let qualities = data.download.map((item, index) => `${index + 1}. ${item.quality}`).join('\n');
  await message.reply(`*_${data.title}_*\n\nAvailable qualities:\n${qualities}\n\n*Reply with the number to download the video in that quality*\n✧${match}`);
});

System({
  on: 'text',
  fromMe: isPrivate,
  dontAddCommandList: true,
}, async (message) => {
  if (message.isBot) return;
  if (!message.reply_message || !message.reply_message.fromMe || !message.reply_message.text.includes('✧')) return;
  const match = message.reply_message.text.split('✧')[1];
  const qualitylist = parseInt(message.body.trim());
  const res = await fetch(IronMan(`ironman/dl/ytdl?url=${match}`));
  const data = await res.json();
  if (isNaN(qualitylist) || qualitylist < 1 || qualitylist > data.download.length) return;
  const q = data.download[qualitylist - 1];
  await message.reply(`Downloading *${data.title}* in *${q.quality}*, please wait...`);
  await message.client.sendMessage(message.chat, {
    video: {
      url: q.download
    },
    caption: `*${data.title}*\n\nQuality: ${q.quality}`,
  });
});

/*System({
      pattern: 'yta ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
      const matchUrl = extractUrlFromMessage(match);
      if (isUrl(matchUrl)) {
          const { title, author, thumbnail } = await YtInfo(matchUrl);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl)), await getBuffer(thumbnail), { title: title, body: author });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
      } else {
          const { title, author, thumbnail, url } = await Ytsearch(match);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(url)), await getBuffer(thumbnail), { title: title, body: author.name });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
     }
});*/

System({
  pattern: 'yta ?(.*)',
  fromMe: isPrivate,
  desc: 'Sends YouTube audio directly',
  type: 'youtube',
}, async (message, match) => {
  if (!match && (!message.reply_message || !message.reply_message.text) || !isUrl(match || message.reply_message.text)) {
    return await message.reply("*Need a valid video URL.*");
  }

  const url = match || message.reply_message.text;

  const res = await fetch(IronMan(`ironman/dl/ytdl?url=${url}`));
  const aud = await res.json();

  if (!aud.audio || aud.audio.length === 0) {
    return await message.reply("No audio available for this video.");
  }

  const title = aud.title || 'audio';
  await message.reply(`Downloading *${title}*, please wait...`);
  await message.sendFromUrl(aud.audio[0].download,  { quoted: message});
});

System({
  pattern: 'song ?(.*)',
  fromMe: isPrivate,
  desc: 'Downloads YouTube audio',
  type: 'youtube',
}, async (message, match) => {
  if (!match) return await message.reply("*Need a video URL or query.*");
  let url;
  if (isUrl(match)) {
    url = match;
  } else {
    const data = await Ytsearch(match);
    if (!data.url) {
      return await message.reply("*No video found for the given query.*");
    }
    url = data.url;
  }
  const res = await fetch(IronMan(`ironman/dl/ytdl?url=${url}`));
  const fek = await res.json();
  await message.send(`*Downloading ${fek.title}...*`);
  await message.sendFromUrl(fek.audio[0].download, { quoted: message });
});

/*
System({
      pattern: 'song ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
      const matchUrl = extractUrlFromMessage(match);
      if (isUrl(matchUrl)) {
          const { title, author, thumbnail } = await YtInfo(matchUrl);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl)), await getBuffer(thumbnail), { title: title, body: author });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
      } else {
          const { title, author, thumbnail, url } = await Ytsearch(match);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await GetYta(url)), await getBuffer(thumbnail), { title: title, body: author.name });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
     }
});


System({
    pattern: 'play ?(.*)',
    fromMe: isPrivate,
    desc: 'YouTube video player',
    type: 'download',
}, async (message, match) => {
      if (!match) return await message.reply('_Give a *Query* to play the song or video_');
      if (isUrl(match)) {
          const matchUrl = extractUrlFromMessage(match);
          const yt = await YtInfo(matchUrl);
          await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, {
            contextInfo: {
              externalAdReply: {
                title: yt.author,
                body: yt.seconds,
                thumbnail: await getBuffer(yt.thumbnail),
                mediaType: 1,
                mediaUrl: yt.url,
                sourceUrl: yt.url,
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          });
      } else {
          const yt = await Ytsearch(match);
          await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, {
            contextInfo: {
              externalAdReply: {
                title: yt.author.name,
                body: yt.ago,
                thumbnail: await getBuffer(yt.image),
                mediaType: 1,
                mediaUrl: yt.url,
                sourceUrl: yt.url,
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          });
      }
});
  
  System({
    on: 'text',
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message) => {
    if (message.isBot) return;
    if (!message.reply_message.fromMe || !message.reply_message.text) return;
    if (!message.body.includes('⬢')) return;
    let match = message.body.replace('⬢', '');
    if (message.body.includes('1')) {
      const ytAudio = await Ytsearch(match);
      const msg = await message.send(`_*Now playing : ${ytAudio.title} 🎶*_`);
      const data = config.AUDIO_DATA.split(';');
      const aud = await AddMp3Meta(
        await toAudio(await GetYta(ytAudio.url), 'mp3'),
        await getBuffer(data[2]),
        {
          title: data[0],
          body: data[1],
        }
      );
      await message.client.sendMessage(message.from, {
        audio: aud,
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: ytAudio.author.name,
            body: ytAudio.ago,
            thumbnail: await getBuffer(ytAudio.image),
            mediaType: 1,
            mediaUrl: ytAudio.url,
            sourceUrl: ytAudio.url,
            showAdAttribution: false,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg });
    } else if (message.body.includes('2')) {
      const data = await Ytsearch(match);
      const q = await message.send(`_*Now playing : ${data.title} 🎶*_`);
      await message.send(
        await GetYtv(data.url),
        { caption: `_*${data.title}*_`, quoted: q },
        'video'
      );
    } else {
      return;
    }
  });
  */

  System({
       pattern: 'yts ?(.*)',
       fromMe: isPrivate,
       desc: "yt search",
       type: "search",
  }, async (message, match) => {
      if (!match) {
        return await message.reply('_Please provide an *Query*');
      } else {
        if (isUrl(match)) {
          return await message.reply("_Not a *Url* Please provide an *Query*");
        } else {
          const videos = await yts(match);
          const result = videos.all.map(video => `*🏷️ Title :* _*${video.title}*_\n*📁 Duration :* _${video.duration}_\n*🔗 Link :* _${video.url}_`);
          return await message.reply(`\n\n_*Result Of ${match} 🔍*_\n\n`+result.join('\n\n')+"\n\n*🤍 صنع بواسطة لوكي*")
        }
      }
  });
