/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, setData, getData } = require('../lib/');

System({
    pattern: 'welcome ?(.*)',
    desc: 'set welcome message',
    type: 'greetings',
    fromMe: true,
}, async (message, match) => {
    if (!message.isGroup) return;
    const { welcome } = await getData(message.from);
    if (match.toLowerCase() === 'get') {
        if (!welcome || !welcome.message) return await message.send('*_Not Set Yet_*');
        return await message.send(welcome.message);
    } else if (match.toLowerCase() === 'off') {
        const status = welcome && welcome.status ? welcome.status : 'false';
        if (status === 'false') return await message.send(`_already deactivated_`);
        await setData(message.jid, welcome.message, 'false', 'welcome');
        return await message.send('*successfully deactivated*');
    } else if (match.toLowerCase() === 'on') {
        const status = welcome && welcome.status ? welcome.status : 'false';
        if (status === 'true') return await message.send(`_already activated_`);
        await setData(message.jid, welcome.message, 'true', 'welcome');
        return await message.send('*successfully activated*');
    } else if (match) {
        const status = welcome && welcome.status ? welcome.status : 'true';
        await setData(message.jid, match, status, 'welcome');
        return await message.send('*successfully set*');
    }
    return await message.reply('_*welcome get*_\n_*welcome* thank you for joining &mention_\n*_welcome false_*');
});

System({
    pattern: 'goodbye ?(.*)',
    desc: 'set goodbye message',
    type: 'greetings',
    fromMe: true,
}, async (message, match) => {
    if (!message.isGroup) return;
    const { exit } = await getData(message.jid);
    if (match.toLowerCase() === 'get') {
        if (!exit || !exit.message) return await message.send('*_Not Set Yet_*');
        return await message.send(exit.message);
    } else if (match.toLowerCase() === 'off') {
        const status = exit && exit.status ? exit.status : 'false';
        if (status === 'false') return await message.send(`_already deactivated_`);
        await setData(message.jid, exit.message, 'false', 'exit');
        return await message.send('*successfully deactivated*');
    } else if (match.toLowerCase() === 'on') {
        const status = exit && exit.status ? exit.status : 'false';
        if (status === 'true') return await message.send(`_already activated_`);
        await setData(message.jid, exit.message, 'true', 'exit');
        return await message.send('*successfully activated*');
    } else if (match) {
        const status = exit && exit.status ? exit.status : 'true';
        await setData(message.jid, match, status, 'exit');
        return await message.send('*successfully set*');
    }
    return await message.reply('_*goodbye get*_\n_*goodbye* thank you for joining &mention_\n*_goodbye false_*');
});
