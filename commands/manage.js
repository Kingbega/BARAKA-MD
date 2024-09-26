/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const {
    System,
    setData,
    getData,
    transformData,
    makeInDb
} = require('../lib');
const actions = ['kick','warn','null']


System({
    pattern: 'antiword ?(.*)',
    desc: 'remove users who use restricted words',
    type: "manage",
    fromMe: true 
}, async (message, match, m) => {
    if(!message.isGroup) return;
    if (!match) return await message.reply("_*antiword* on/off_\n_*antiword* action warn/kick/null_");
        const antiword = await transformData(message.jid, "antiword")
    if(match.toLowerCase() == 'get') {
    	const status = antiword && antiword.status == 'true' ? true : false
        if(!status  || !antiword.value) return await message.send('_Not Found_');
        return await message.send(`_*activated antiwords*: ${antiword.value}_`);
    } else if(match.toLowerCase() == 'on') {
    	const action = antiword && antiword.action ? antiword.action : 'null';
        const word = antiword && antiword.value ? antiword.value : undefined;
        await makeInDb(message.jid, { status: "true", action: action, value: word }, "antiword");
        return await message.send(`_antiword Activated with action null_\n_*antiword action* warn/kick/null for chaning actions_`)
    } else if(match.toLowerCase() == 'off') {
    	const action = antiword && antiword.action ? antiword.action : 'null';
        const word = antiword && antiword.value ? antiword.value : undefined;
        await makeInDb(message.jid, { status: "false", action: action, value: word }, "antiword");
        return await message.send(`_antiword deactivated_`)
    } else if(match.toLowerCase().match('action')) {
    	const status = antiword && antiword.status ? antiword.status : 'false';
	const word = antiword && antiword.value ? antiword.value : undefined;
        match = match.replace(/action/gi,'').trim();
        if(!actions.includes(match)) return await message.send('_action must be warn,kick or null_')
        await makeInDb(message.jid, { status: status, action: match, value: word }, "antiword");
        return await message.send(`_antiword Action Updated_`);
    } else {
    	if(!match) return await message.send('_*Example:* antiword 🇹🇿, gay, nigga_');
    	const status = antiword && antiword.status ? antiword.status : 'false';
        const action = antiword && antiword.action ? antiword.action : 'null';
        await makeInDb(message.jid, { status: status, action: action, value: match }, "antiword");
        return await message.send(`_Antiwords Updated_`);
    }
});

System({
    pattern: 'antilink ?(.*)',
    desc: 'remove users who use bot',
    type: "manage",
    fromMe: true 
}, async (message, match) => {
    if(!message.isGroup) return;
    if (!match) return await message.reply("_*antilink* on/off_\n_*antilink* action warn/kick/null_");
    const { antilink } = await getData(message.chat);
    if(match.toLowerCase() === 'on') {
    	const action = antilink && antilink.message ? antilink.message : 'null';
        await setData(message.jid, action, "true", "antilink");
        return await message.send(`_antilink Activated with action null_\n_*antilink action* warn/kick/null for chaning actions_`)
    } else if(match.toLowerCase() === 'off') {
    	const action = antilink && antilink.message ? antilink.message : 'null';
        await setData(message.jid, action, "false", "antilink");
        return await message.send(`_antilink deactivated_`)
    } else if(match.toLowerCase().match('action')) {
    	const status = antilink && antilink.status ? antilink.status : 'true';
        match = match.replace(/action/gi,'').trim();
        if(!actions.includes(match)) return await message.send('_action must be warn,kick or null_')
        await setData(message.jid, match, status, "antilink");
        return await message.send(`_Link Action Updated_`);
    }
});

System({
    pattern: 'antifake ?(.*)',
    desc: 'remove fake numbers',
    fromMe: true,
    type: 'manage'
}, async (message, match) => {
    if(!message.isGroup) return;
    if (!match) return await message.reply('_*antifake* 94,92_\n_*antifake* on/off_\n_*antifake* list_');
    const { antifake } = await getData(message.chat);
    if(match.toLowerCase()==='get'){
    if(!antifake || antifake.status === 'false' || !antifake.message) return await message.send('_Not Found_');
    return await message.send(`_*activated restricted numbers*: ${antifake.message}_`);
    } else if(match.toLowerCase() === 'on') {
    	const data = antifake && antifake.message ? antifake.message : '';
    	await setData(message.jid, data, "true", "antifake");
        return await message.send(`_Antifake Activated_`)
    } else if(match.toLowerCase() === 'off') {
        const data = antifake && antifake.message ? antifake.message : '';
    	await setData(message.jid, data, "false", "antifake");
    return await message.send(`_Antifake Deactivated_`)
    }
    match = match.replace(/[^0-9,!]/g, '');
    if(!match) return await message.send('value must be number');
    const status = antifake && antifake.status ? antifake.status : 'true';
    await setData(message.jid, match, status, "antifake");
    return await message.send(`_Antifake Updated_`);
});

System({
    pattern: 'antibot ?(.*)',
    desc: 'remove users who use bot',
    type: "manage",
    fromMe: true 
}, async (message, match) => {
    if(!message.isGroup) return;
    if (!match) return await message.reply("_*antibot* on/off_\n_*antibot* action warn/kick/null_");
    const { antibot } = await getData(message.chat)
    if(match.toLowerCase() === 'on') {
    	const action = antibot && antibot.message ? antibot.message : 'null';
        await setData(message.jid, action, "true", "antibot");
        return await message.send(`_antibot Activated with action null_\n_*antibot action* warn/kick/null for chaning actions_`)
    } else if(match.toLowerCase() === 'off') {
    	const action = antibot && antibot.message ? antibot.message : 'null';
        await setData(message.jid, action, "false", "antibot");
        return await message.send(`_antibot deactivated_`)
    } else if(match.toLowerCase().match('action')) {
    	const status = antibot && antibot.status ? antibot.status : 'true';
        match = match.replace(/action/gi,'').trim();
        if(!actions.includes(match)) return await message.send('_action must be warn,kick or null_')
        await setData(message.jid, match, status, "antibot");
        return await message.send(`_AntiBot Action Updated_`);
    }
});

System({
    pattern: 'antidemote ?(.*)',
    desc: 'demote actor and re-promote demoted person',
    type: 'manage',
    fromMe: true
}, async (message, match) => {
    if(!message.isGroup) return;
    if (!match) return await message.send("Choose settings to change antidemote settings", { values: [{ displayText: "on", id: "antidemote on"}, { displayText: "off", id: "antidemote off"}], onlyOnce: true, withPrefix: true, participates: [message.sender] }, "poll");
    if (match != 'on' && match != 'off') return message.reply('_antidemote on_');
    const { antidemote } = await getData(message.jid);
    if (match === 'on') {
        if (antidemote && antidemote.status == 'true') return message.reply('_Already activated_');
        await setData(message.jid, "active", "true", "antidemote");
        return await message.reply('_activated_');
    } else if (match === 'off') {
        if (antidemote && antidemote.status == 'false') return message.reply('_Already Deactivated_');
        await setData(message.jid, "disactive", "false", "antidemote");
        return await message.reply('_deactivated_')
    }
});

System({
    pattern: 'antipromote ?(.*)',
    desc: 'demote actor and re-promote demoted person',
    type: 'manage',
    fromMe: true
}, async (message, match) => {
    if(!message.isGroup) return;
    if (!match) return await message.send("Choose settings to change antipromote settings", { values: [{ displayText: "on", id: "antipromote on"}, { displayText: "off", id: "antipromote off"}], onlyOnce: true, withPrefix: true, participates: [message.sender] }, "poll");
    if (match != 'on' && match != 'off') return message.reply('antipromote on');
    const { antipromote } = await getData(message.chat);
    if (match === 'on') {
        if (antipromote && antipromote.status == 'true') return message.reply('_Already activated_');
        await setData(message.jid, "active", "true", "antipromote");
        return await message.reply('_activated_')
    } else if (match === 'off') {
        if (antipromote && antipromote.status == 'false') return message.reply('_Already Deactivated_');
        await setData(message.jid, "disactive", "false", "antipromote");
        return await message.reply('_deactivated_')
    }
});

System({
    pattern: "antidelete",
    fromMe: true,
    desc: "Manage anti-delete settings",
    type: "manage",
}, async (message, match) => {
	if(!match) return await message.reply(`*To Update Antidelete Settings*\n\n${message.prefix} *Antidelete On.* - \`\`\`Enable Antidelete\`\`\` \n${message.prefix} *Antidelete Off.* - \`\`\`Disable Antidelete\`\`\` \n\n${message.prefix} *Antidelete Only/PM.* - \`\`\`Activate Antidelete for private messages only.\`\`\` \n${message.prefix} *Antidelete Only/Group.* - \`\`\`Activate Antidelete for group messages only.\`\`\` \n${message.prefix} *Antidelete PM/Group.* - \`\`\`Activate Antidelete for both groups and private messages.\`\`\` \n\n${message.prefix} *Antidelete Send Deleted Message to /chat.* - \`\`\`Send deleted messages to a specific chat. Use /chat, /sudo for your bot number, /pm for another number use /JID.\`\`\` `);
	const antidelete = await transformData(message.user.id, "antidelete")
	const target = match.split("/")[1];
	  if (match === "on") {
		const sendto = antidelete && antidelete.action ? antidelete.action : "chat";
		const value = antidelete && antidelete.value ? antidelete.value : "all";
		await makeInDb(message.user.id, { status: "true", action: sendto, value: value }, "antidelete");
		await message.send(`_*Anti-delete is active. Messages will be sent to ${sendto}*_`);
	} else if (match === "off") {
		const sendto = antidelete && antidelete.action ? antidelete.action : "chat";
		const value = antidelete && antidelete.value ? antidelete.value : "all";
		await makeInDb(message.user.id, { status: "false", action: sendto, value: value }, "antidelete");
		await message.send(`_*Anti-delete is disabled*_`);
	} else if (match === "only/pm") {
		const sendto = antidelete && antidelete.action ? antidelete.action : "chat";
		const status = antidelete && antidelete.status ? antidelete.status : "false";
		await makeInDb(message.user.id, { status: "false", action: sendto, value: "only/pm" }, "antidelete");
		await message.send(`_*Anti-delete is active only for pm. Messages will be sent to ${sendto}*_`);
	} else if (match === "pm/group") {
		const sendto = antidelete && antidelete.action ? antidelete.action : "chat";
		const status = antidelete && antidelete.status ? antidelete.status : "false";
		await makeInDb(message.user.id, { status: "false", action: sendto, value: "all" }, "antidelete");
		await message.send(`_*Anti-delete is active. Messages will be sent to ${sendto}*_`);
	} else if (match === "only/group") {
		const sendto = antidelete && antidelete.action ? antidelete.action : "chat";
		const status = antidelete && antidelete.status ? antidelete.status : "false";
		await makeInDb(message.user.id, { status: "false", action: sendto, value: "only/group" }, "antidelete");
		await message.send(`_*Anti-delete is active only for group messages. Messages will be sent to ${sendto}*_`);
	} else if (["pm", "chat", "sudo"].includes(target) || target.includes("@")) {
         const sendto = target === "sudo" ? message.sudo[0] : target;
         const status = antidelete && antidelete.status ? antidelete.status : "false";
         const value = antidelete && antidelete.value ? antidelete.value : "all";
         await makeInDb(message.user.id, { status: status, action: sendto, value: value }, "antidelete");
         await message.send(`_*Anti-delete is active. Messages will be sent to ${target}*_`);
	} else {
	 await message.reply(`*To Update Antidelete Settings*\n\n${message.prefix} *Antidelete On.* - \`\`\`Enable Antidelete\`\`\` \n${message.prefix} *Antidelete Off.* - \`\`\`Disable Antidelete\`\`\` \n\n${message.prefix} *Antidelete Only/PM.* - \`\`\`Activate Antidelete for private messages only.\`\`\` \n${message.prefix} *Antidelete Only/Group.* - \`\`\`Activate Antidelete for group messages only.\`\`\` \n${message.prefix} *Antidelete PM/Group.* - \`\`\`Activate Antidelete for both groups and private messages.\`\`\` \n\n${message.prefix} *Antidelete Send Deleted Message to /chat.* - \`\`\`Send deleted messages to a specific chat. Use /chat, /sudo for your bot number, /pm for another number use /JID.\`\`\` `);
	}
    });
