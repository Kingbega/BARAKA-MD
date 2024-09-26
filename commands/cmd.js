/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const {
    System,
    setData,
    database,
    isPrivate,
    removeData
} = require("../lib/");

System({
    pattern: "setcmd",
    fromMe: true,
    desc: "set a sticker as a cmd",
    type: "tool",
}, async (message, match) => { 
    if (!message.reply_message || !message.reply_message.i || !message.reply_message.msg || !message.reply_message.msg.fileSha256) 
    return await message.reply('_Reply to an image/video/audio/sticker_'); 
    if (!match) return await message.reply('_Example: setcmd ping_'); 
    const hash = message.reply_message.msg.fileSha256.join("");
    const setcmd = await setData(hash, match, "true", "setCmd");
    if (!setcmd) return await message.reply('_Failed_');
    await message.reply('_Success_');
});

System({
    pattern: 'delcmd ?(.*)',
    fromMe: true,
    desc: 'to delete audio/image/video cmd',
    type: 'tool'
}, async (message, match) => {
    if (!message.reply_message || !message.reply_message.i) 
    return await message.reply('_Reply to an image/video/audio/sticker_');
    let hash = message.reply_message.msg.fileSha256.join("")
    if (!hash) return await message.reply('_Failed_');
    const delcmd = await removeData(hash, "setCmd");
    if (!delcmd) return await message.reply('_Failed_');
    await message.reply('_Success_');
});

System({
    pattern: 'listcmd ?(.*)',
    fromMe: true,
    desc: 'to list all commands',
    type: 'tool'
}, async (message, match) => {
    const result = await database.findAll({ where: { name: "setCmd" } });
    if (!result || result.length === 0) return await message.reply("_*No commands set*_");
    const messages = result.map((entry, index) => `_${index + 1}. ${entry.dataValues.message}_`);
    const formattedList = messages.join('\n');
    return await message.reply("*List Cmd*\n\n" + formattedList);
});
