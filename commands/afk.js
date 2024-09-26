/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System } = require('../lib/');
const { secondsToHms } = require("./client/"); 

let AFK = {
	isAfk: false,
	reason: false,
	lastseen: 0
};

System({
	on: 'all',
	fromMe: false
}, async (message, match) => {
	if(message.isBot) return;
	if(message.fromMe) return;
	if (!AFK.isAfk)  return;
	if(!message.mention.isBotNumber && !message.reply_message.i && message.isGroup)  return;
	if (message.mention.isBotNumber && message.isGroup) {
   	    await message.send('```This is a bot. My owner is not here at the moment```\n' +
		              (AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
		    	      (AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + '```' : ''), {
			      quoted: message.data
			    });
	} else if (message.isGroup && message.reply_message.sender == message.user.jid) {
	    await message.send('```This is a bot. My owner is not here at the moment```\n' +
			      (AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
			      (AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + '```' : ''), {
			      quoted: message.data
			   });

	} else if(!message.isGroup) {
	    await message.send('```This is a bot. My owner is not here at the moment```\n' +
				(AFK.reason !== false ? '\n*Reason:* ```' + AFK.reason + '```' : '') +
				(AFK.lastseen !== 0 ? '\n*Last Seen:* ```' + secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen) + '```' : ''), {
				quoted: message.data
			      });
	}
});


System({
	on: 'text',
	fromMe: true
}, async (message, match) => {
	if(message.isBot) return;
	if (!AFK.isAfk)  return;
	AFK.lastseen = 0;
	AFK.reason = false;
	AFK.isAfk = false;
	await message.send('```I am not AFK anymore!```');
});

System({
	pattern: 'afk ?(.*)',
	fromMe: true,
	desc: 'away from keyboard'
}, async (message, match) => {
	if (AFK.isAfk) return;
        if(message.isBot) return;
	AFK.lastseen = Math.round((new Date()).getTime() / 1000);
	if (match !== '') AFK.reason = match;
	AFK.isAfk = true;
	await message.send(AFK.reason ? '*_Im AFK now!_*\n*Reason:* ' + AFK.reason :  '*_Im AFK now!_*');
});
