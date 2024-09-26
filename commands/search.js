/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 
 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, IronMan, isPrivate, getJson, Google } = require("../lib/");


System({
    pattern: 'ig ?(.*)',
    fromMe: isPrivate,
    desc: 'Instagram profile details',
    type: 'search',
}, async (message, match) => {
    if (!match) return await message.reply("*Need a username*\n_Example: .ig Baraka Bega_");
    const data = await getJson(Barakabega(`baraka/igstalk?id=${match}`));
    let caption = '';
    if (data.name) caption += `*𖢈ɴᴀᴍᴇ:* ${data.name}\n`;
    if (data.username) caption += `*𖢈ᴜꜱᴇʀɴᴀᴍᴇ:* ${data.username}\n`;
    if (data.bio) caption += `*𖢈ʙɪᴏ:* ${data.bio}\n`;
    if (data.pronouns && data.pronouns.length > 0) caption += `*𖢈ᴘʀᴏɴᴏᴜɴꜱ:* ${data.pronouns.join(', ')}\n`;
    if (data.followers) caption += `*𖢈ꜰᴏʟʟᴏᴡᴇʀꜱ:* ${data.followers}\n`;
    if (data.following) caption += `*𖢈ꜰᴏʟʟᴏᴡɪɴɢ:* ${data.following}\n`;
    if (data.category) caption += `*𖢈ᴄᴀᴛᴇɢᴏʀʏ:* ${data.category}\n`;
    if (typeof data.private !== 'undefined') caption += `*𖢈ᴘʀɪᴠᴀᴛᴇ ᴀᴄᴄ:* ${data.private}\n`;
    if (typeof data.business !== 'undefined') caption += `*𖢈ʙᴜꜱꜱɪɴᴇꜱ ᴀᴄᴄ:* ${data.business}\n`;
    if (data.email) caption += `*𖢈ᴇᴍᴀɪʟ:* ${data.email}\n`;
    if (data.url) caption += `*𖢈ᴜʀʟ:* ${data.url}\n`;
    if (data.contact) caption += `*𖢈ɴᴜᴍʙᴇʀ:*${data.contact}\n`;
    if (data.action_button) caption += `*𖢈ᴀᴄᴛɪᴏɴ ʙᴜᴛᴛᴏɴ:* ${data.action_button}\n`;
    await message.send({ url: data.hdpfp }, { caption: caption.trim() }, "image");
});

System({
    pattern: 'google ?(.*)',
    fromMe: isPrivate,
    desc: 'Searches Google',
    type: 'search',
}, async (message, match, m) => {
    if (!match) return await message.reply("*Need a query to search*\n_Example: who is Baraka Bega_");
    const query = match;
    const results = await Google(query);
    let response = '';
    results.forEach((result, i) => {
        response += `━━━──────${i + 1}─────━━━\n`;
        response += `*TITLE:* ${result.title}\n`;
        response += `*LINK:* ${result.link}\n`;
        response += `*DESCRIPTION:* ${result.description}\n\n`;
    });
    await message.send(response, { quoted: message.data });
});

System({
        pattern: "gs ?(.*)",
        fromMe: isPrivate,
        desc: "Google search (short)",
        type: "search"
}, async (message, match) => {
        if (!match) return await message.send("*Need a query to search*\n_Example: who is Baraka Bega_");
        const response = await Google(match);
        const text = `*⬢ Title*: ${response[0].title}\n\n*⬢ Description*: _${response[0].description}_\n`
        await message.send([{ name: "cta_url", display_text: "Visit Google", url: response[0].link, merchant_url: response[0].link, action: "url", icon: "", style: "link" }], { body: "", footer: "*BARAKA-MD*", title: text }, "button");
});

System({
        pattern: "scs (.*)",
        fromMe: isPrivate,
        desc: "SoundCloud search",
        type: "search"
}, async (message, match) => {
        if (!match) return await message.reply("*Need a query to search*\n_Example: .scs life waster_");
        const fullResult = match.trim().startsWith("-full");
        const query = fullResult ? match.replace("-full", "").trim() : match.trim();
        const { result: results } = await getJson(IronMan(`ironman/s/soundcloud?query=${query}`));
        if (!results || results.length === 0) return await message.send("No results found.");
        if (fullResult) {
            let fullit = "";
            results.forEach(result => {
                fullit += `*Title*: ${result.title}\n*URL*: ${result.url}\n*Artist*: ${result.artist}\n*Views*: ${result.views}\n*Release*: ${result.release}\n*Duration*: ${result.duration}\n\n`;
            });
            await message.send(fullit);
        } else {
            const furina = results[0];
            const { title, artist, views, release, duration, thumb, url } = furina;
            let caption = `╔═════◇\n\n*➭Title*: ${title}\n*➭Artist*: ${artist}\n*➭Views*: ${views}\n*➭Release*: ${release}\n*➭Duration*: ${duration}\n*➭URL*: ${url}\n\n*Use -full in front of query to get full results*\n_Example: .scs -full ${match}_\n\n╚══════════════════╝`;
            if (thumb) {
                await message.send({ url: thumb }, { caption: caption }, "image");
            } else {
                await message.send(caption);
            }
        }
});

System({
    pattern: "device ?(.*)",
    fromMe: isPrivate,
    desc: "Get details of a Device",
    type: "search"
}, async (message, match, m) => {
    if (!match) return await message.send("*Need a device name*\n_Example: device Xiaomi 11 i_");
    var data = await getJson(IronMan(`ironman/device?query=${match}`));
    if (Array.isArray(data) && data.length > 0) {
        const { id, name, img, description } = data[0];
        const cap = `*➭Name:* ${name}\n*➭Id:* ${id}\n*➭Description:* ${description}`;
        await message.send({ url: img }, { caption: cap }, "image");
    } else {
        await message.send("*Device not Found*");
    }
});

System({
    pattern: 'wallpaper ?(.*)',
    fromMe: isPrivate,
    desc: 'wallpaper search',
    type: 'search'
}, async (message, match, m) => {
    if (!match) return await message.send("*Need a wallpaper name*\n_Example: .wallpaper furina_");
    const images = await getJson(IronMan(`ironman/wallpaper/wlhven?name=${encodeURIComponent(match)}`));
    const urls = images.filter(item => item.url).map(item => item.url);
    if (urls.length > 0) {
        const selectedUrls = urls.sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const imageUrl of selectedUrls) {
            await message.send({ url: imageUrl }, {}, "image");
        }
    } else {
        await message.send("No wallpapers found for the given query.");
    }
});

System({
  pattern: 'img ?(.*)',
  fromMe: isPrivate,
  desc: 'Search google images',
  type: 'search',
}, async (message, match) => {
  const [query, count] = match.split(',').map(item => item.trim());
  const imageCount = count ? parseInt(count, 10) : 5;
  if (!query) return await message.send("*Need a Query*\n_Example: .img ironman, 5_");
  const msg = await message.send(`Downloading ${imageCount} images of *${query}*`);
  const urls = await getJson(IronMan(`ironman/s/google?image=${encodeURIComponent(query)}`));
  if (urls.length === 0) return await message.send("No images found for the query");
  const list = urls.length <= imageCount ? urls : urls.sort(() => 0.5 - Math.random()).slice(0, imageCount);
  for (const url of list) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await message.send(url, {}, "image");
  }
  await msg.edit("*Downloaded*");
});

System({
    pattern: 'gitinfo ?(.*)',
    fromMe: isPrivate,
    desc: 'github user details',
    type: 'search',
}, async (message, match) => {
    if (!match) return await message.send("*_Need Github UserName_*");   
    const data = await getJson(`https://api.github.com/users/${match}`);
    const GhUserPP = data.avatar_url || "https://i.imgur.com/HRl2Um1.jpeg";
    const userInfo = `\n⎔ *Username* : ${data.login} \n⎔ *Name* : ${data.name || "Not Available"} \n⎔ *Bio* : ${data.bio || "Not Available"} \n\n➭ *ID* : ${data.id}\n➭ *Followers* : ${data.followers}\n➭ *Following* : ${data.following}\n➭ *Type* : ${data.type}\n➭ *Company* : ${data.company || "Not Available"}\n➭ *Public Repos* : ${data.public_repos}\n➭ *Public Gists* : ${data.public_gists}\n➭ *Email* : ${data.email || "Not Available"}\n➭ *Twitter* : ${data.twitter_username || "Not Available"}\n➭ *Location* : ${data.location || "Not Available"}\n➭ *Blog* : ${data.blog || "Not Available"}\n➭ *Profile URL* : ${data.html_url}\n➭ *Created At* : ${data.created_at}\n\n`;
    await message.send({ url: GhUserPP }, { caption: userInfo }, "image");
});


System({
    pattern: "dict", 
    fromMe: isPrivate,
    desc: "to search in dictionary", 
    type: "search",
}, async (msg, text) => {
    if (!text) return await msg.reply('*Please enter any word!*');
    await getJson('https://api.dictionaryapi.dev/api/v2/entries/en/' + text)
     .then(async (data) => {
      let word = data[0].word;
      let phonetics = data[0].phonetics[0].text;
      let partsOfSpeech = data[0].meanings[0].partOfSpeech;
      let definition = data[0].meanings[0].definitions[0].definition;
      let example = (data[0].meanings[0].definitions.find(obj => 'example' in obj) || {})['example'];
      return await msg.reply(`_Word_ : *${word}*\n_Parts of speech_ : *${partsOfSpeech}*\n_Definition_ :\n*${definition}*${example == undefined ? `` : `\n_Example_ : *${example}*`}`.trim() );
    }).catch(async (e) => {
      return await msg.reply('*Unable to find definition for ' + text + '!*');
    });
});

System({
  pattern: 'sps ?(.*)',
  fromMe: isPrivate,
  desc: 'Search for songs on Spotify',
  type: 'search',
}, async (message, match, m) => {
  if (!match) return await message.reply("*Give a Spotify query to search*\n_Example: .sps yoasobi idol_");
  const query = match.startsWith('-full') ? match.slice(5).trim() : match;
  const x = await fetch(IronMan(`ironman/spotify/s?query=${query}`));
  const result = await x.json();
  if (match.startsWith('-full')) {
    let cap = '';
    result.forEach(item => {
      cap += `━━━━━━━━━━━━━━━━━━━━⬤\n
*∘ᴛɪᴛʟᴇ:* ${item.title}\n*∘ᴀʀᴛɪꜱᴛ:* ${item.artist}\n*∘ᴅᴜʀᴀᴛɪᴏɴ:* ${item.duration}\n*∘ᴘᴏᴘᴜʟᴀʀɪᴛʏ:* ${item.popularity}\n*∘ᴜʀʟ:* ${item.url}\n*∘ᴘʀᴇᴠɪᴇᴡ:* ${item.preview}\n━━━━━━━━━━━━━━━━━━━━⬤
\n\n`;
    });
    await message.send(cap);
  } else {
    const fr = result[0];
    var caption = `*ᴛɪᴛʟᴇ:* ${fr.title}\n*ᴀʀᴛɪꜱᴛ:* ${fr.artist}\n*ᴅᴜʀᴀᴛɪᴏɴ:* ${fr.duration}\n*ᴜʀʟ:* ${fr.url}\n\n*Use -full in front of query to get full results*\n_Example: .sps -full ${match}_`;
    await message.send({ url: fr.thumbnail }, {
      caption: caption
    }, "image");
  }
});

System({
  pattern: 'ps ?(.*)',
  fromMe: isPrivate,
  desc: 'Searches for an app on Play Store',
  type: 'search',
}, async (message, match, m) => {
  if (!match) return await message.reply("*Nᴇᴇᴅ ᴀɴ ᴀᴘᴘ ɴᴀᴍᴇ*\n*Example.ps WhatsApp*");
  const query = match.startsWith('-full')? match.slice(5).trim() : match;
  const x = await fetch(IronMan(`ironman/search/playstore?app=${query}`));
  const result = await x.json();
  if (match.startsWith('-full')) {
    let cap = '';
    result.forEach(item => {
      cap += `┈──────────────────────⏣\n
*ɴᴀᴍᴇ:* ${item.name}\n*ᴅᴇᴠᴇʟᴏᴘᴇʀ:* ${item.developer}\n*ʀᴀᴛᴇ:* ${item.rate2}\n*ʟɪɴᴋ:* ${item.link}\n┈──────────────────────⏣
\n\n`;
    });
    await message.send(cap);
  } else {
    const fr = result[0];
    var caption = `*◦ɴᴀᴍᴇ:* ${fr.name}\n*◦𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁:* ${fr.developer}\n*◦ʀᴀᴛᴇ:* ${fr.rate2}\n*◦ʟɪɴᴋ:* ${fr.link}\n\n*Use -full in front of query to get full results*\n_Example: .ps -full ${match}_`;
    await message.send({ url: fr.img }, {
      caption: caption
    }, "image");
  }
});

System({
  pattern: 'tt ?(.*)',
  fromMe: isPrivate,
  desc: 'TikTok Stalk',
  type: 'search',
}, async (message, match) => {
  if (!match) return await message.send("*Need a TikTok username*");
  const response = await fetch(IronMan(`ironman/stalk/tiktok?id=${encodeURIComponent(match)}`));
  const data = await response.json();
  const { user, stats } = data;
  const caption = `*⭑⭑⭑⭑ᴛɪᴋᴛᴏᴋ ꜱᴛᴀʟᴋ ʀᴇꜱᴜʟᴛ⭑⭑⭑⭑*\n\n`
    + `*➥ᴜꜱᴇʀɴᴀᴍᴇ:* ${user.uniqueId}\n`
    + `*➥ɴɪᴄᴋɴᴀᴍᴇ:* ${user.nickname}\n`
    + `*➥ʙɪᴏ:* ${user.signature}\n`
    + `*➥ᴠᴇʀɪꜰɪᴇᴅ:* ${user.verified}\n`
    + `*➥ꜰᴏʟʟᴏᴡᴇʀꜱ:* ${stats.followerCount}\n`
    + `*➥ꜰᴏʟʟᴏᴡɪɴɢ:* ${stats.followingCount}\n`
    + `*➥ʜᴇᴀʀᴛꜱ:* ${stats.heartCount}\n`
    + `*➥ᴠɪᴅᴇᴏꜱ:* ${stats.videoCount}`;
  await message.send({ url: user.avatarLarger }, { caption }, "image");
});

System({
    pattern: 'pinimg ?(.*)',
    fromMe: isPrivate,
    desc: 'Search for images on Pinterest',
    type: 'search',
}, async (message, match, m) => {
    if (!match) return await message.send("*Need a query to search on Pinterest*\n_Example: .pinimg furina_\nWith count eg: .pinimg furina,5");
    var [query, count] = match.trim().split(',').map(str => str.trim());
    var res = await fetch(IronMan(`search/pin?query=${query}`));
    var images = await res.json();
    if (images.length > 0) {
        let ri;
        if (count && !isNaN(count)) {
            ri = Array.from({ length: Math.min(parseInt(count), images.length) }, () => {
                const rix = Math.floor(Math.random() * images.length);
                return images.splice(rix, 1)[0];
            });
        } else {
            ri = [images[Math.floor(Math.random() * images.length)]];
        }
        
        for (const img of ri) {
            await message.client.sendMessage(message.chat, { image: { url: img }, caption: "" }, { quoted: message });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } else {
        await message.send("No images found for the given query.");
    }
});

System({
  pattern: 'pinvid ?(.*)',
  fromMe: isPrivate,
  desc: 'Search for a Pinterest video.',
  type: 'search',
}, async (message, match, m) => {
  if (!match) return await message.reply("_Give a pinterest video *query*_\n*Example* : .pinvid furina edit");
  var query = match.trim();
  var res = await fetch(IronMan(`ironman/search/pinterest?q=${encodeURIComponent(query)}`));
  var data = await res.json();
  var vidurl = data;
  if (vidurl.length > 0) {
    var ri = Math.floor(Math.random() * vidurl.length);
    var rvu = vidurl[ri];
    await message.sendFromUrl(rvu, { quoted: message });
  } else {
    await message.reply('No video results found');
  }
});
