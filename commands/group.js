/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 
 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const {
    Vote,
    isUrl,
    sleep,
    System,
    isPrivate,
    warnMessage,
    extractUrlFromMessage,
} = require("../lib/");
const { parsedJid, isAdmin, isBotAdmins, getAllGroups } = require("./client/");

System({
    pattern: 'add ?(.*)',
    type: 'group',
    fromMe: true,
    desc: "add a person to group"
}, async (message, match) => {
    if (!message.isGroup) return;
    match = message.reply_message?.sender || match;
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_I'm not admin_");
    if (!match) return await message.reply("_Reply to user or need number_\n*Example:* .add 255762190568_");
    match = match.replaceAll(' ', '');
    if (match) {
        let users = match.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let info = await message.client.onWhatsApp(users);
        let ex = info.map((jid) => jid.jid);
        if (!ex.includes(users)) return await message.reply('h');
        const su = await message.client.groupParticipantsUpdate(message.jid, [users], "add");
        if (su[0].status == 403) {
            await message.reply("_Couldn't add. Invite sent!_");
            return await message.sendGroupInviteMessage(users);
        } else if (su[0].status == 408) {
            await message.send(`Couldn't add @${users.split("@")[0]} because they left the group recently. Group invitation sent!`, {
                mentions: [users]
            });
            const code = await message.client.groupInviteCode(message.jid);
            return await message.client.sendMessage(users, { text: `https://chat.whatsapp.com/${code}` });
        } else if (su[0].status == 401) {
            return await message.send(`Couldn't add @${users.split("@")[0]} because they blocked the bot number.`, {
                mentions: [users]
            });
        } else if (su[0].status == 200) {
            return await message.send(`@${users.split("@")[0]}, Added to the group.`, {
                mentions: [users]
            });
        } else if (su[0].status == 409) {
            return await message.send(`@${users.split("@")[0]}, Already in the group.`, {
                mentions: [users]
            });
        } else {
            return await message.reply(JSON.stringify(su));
        }
    }
});


System({
    pattern: "kick$",
    fromMe: true,
    desc: "Kicks a person from the group",
    type: "group",
}, async (message, match) => {
    if (!message.isGroup) return await message.send("_This command is for groups_");   
    match = message.mention?.jid?.[0] || message.reply_message?.sender || match;
    if (!match) return await message.reply("_Reply to someone/mention_\n*Example:* .kick @user");    
    if (!await isAdmin(message, message.user.jid)) return await message.send("_I'm not an admin_");
    if (match === "all") {
        let { participants } = await message.client.groupMetadata(message.jid);
        participants = participants.filter(p => p.id !== message.user.jid);       
        await message.reply("_To stop this process, use the restart command_");
        for (let key of participants) {
            const jid = parsedJid(key.id);
            await message.client.groupParticipantsUpdate(message.jid, jid, "remove");
            await message.send(`_@${jid[0].split("@")[0]} kicked successfully_`, { mentions: jid });
        }
    } else {
        const jid = parsedJid(match);
        await message.client.groupParticipantsUpdate(message.jid, jid, "remove");
        await message.send(`_@${jid[0].split("@")[0]} kicked successfully_`, { mentions: jid, });
    }
});

System({
	pattern: "promote$",
	fromMe: true,
	desc: "promote a member",
	type: "group",
}, async (message, match) => {
	if (!message.isGroup)
	return await message.send("_This command is for groups_");
	match = message.mention.jid?.[0] || message.reply_message.sender || match
	if (!match) return await message.reply("_Reply to someone/mention_\n*Example:* . promote @user");
	let isadmin = await isAdmin(message, message.user.jid);
	if (!isadmin) return await message.reply("_I'm not admin_");
	let jid = parsedJid(match);
	await await message.client.groupParticipantsUpdate(message.jid, jid, "promote");
	return await message.send(`_@${jid[0].split("@")[0]} promoted as admin successfully_`, { mentions: jid, });
});


System({
	pattern: "demote$",
	fromMe: true,
	desc: "demote a member",
	type: "group",
}, async (message, match) => {
	if (!message.isGroup)
	return await message.send("_This command is for groups_");
	match = message.mention.jid?.[0] || message.reply_message.sender || match
	if (!match) return await message.reply("_Reply to someone/mention_\n*Example:* . demote @user");
	let isadmin = await isAdmin(message, message.user.jid);
	if (!isadmin) return await message.reply("_I'm not admin_");
	let jid = parsedJid(match);
	await await message.client.groupParticipantsUpdate(message.jid, jid, "demote");
	return await message.send(`_@${jid[0].split("@")[0]} demoted from admin successfully_`, { mentions: jid });
});


System({
    pattern: 'invite ?(.*)',
    fromMe: true,
    desc: "Provides the group's invitation link.",
    type: 'group'
}, async (message) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_I'm not admin_");
    const data = await message.client.groupInviteCode(message.jid);
    return await message.reply(`https://chat.whatsapp.com/${data}`);
});


System({
	pattern: "mute",
	fromMe: true,
	desc: "nute group",
	type: "group",
}, async (message) => {
	if (!message.isGroup)
	return await message.send("_This command is for groups_");
	let isadmin = await isAdmin(message, message.user.jid);
	if (!isadmin) return await message.reply("_I'm not admin_");
	const mute = await message.reply("_Muting Group_");
	await sleep(500);
	await message.client.groupSettingUpdate(message.jid, "announcement");
	return await mute.edit("_Group Muted successfully_");
});

System({
	pattern: "unmute",
	fromMe: true,
	desc: "unmute group",
	type: "group",
}, async (message) => {
	if (!message.isGroup)
	return await message.send("_This command is for groups_");
	let isadmin = await isAdmin(message, message.user.jid);
	if (!isadmin) return await message.reply("_I'm not admin_");
	const mute = await message.reply("_Unmuting Group_");
	await sleep(500);
	await message.client.groupSettingUpdate(message.jid, "not_announcement");
	return await mute.edit("_Group Unmuted successfully_");
});

System({
    pattern: "tag",
    fromMe: true,
    desc: "mention all users in the group",
    type: "group",
}, async (message, match) => {
    if (!message.isGroup) return;   
    const { participants } = await message.client.groupMetadata(message.from).catch(e => {});
    let admins = await participants.filter(v => v.admin !== null).map(v => v.id);
    let msg = "";
    if (match === "all" || match === "everyone") {
        for (let i = 0; i < participants.length; i++) {
            msg += `${i + 1}. @${participants[i].id.split('@')[0]}\n`;
        }
        await message.send(msg, { mentions: participants.map(a => a.id) });
    } 
    else if (match === "admin" || match === "admins") {
        for (let i = 0; i < admins.length; i++) {
            msg += `${i + 1}. @${admins[i].split('@')[0]}\n`;
        }
        return await message.send(msg, { mentions: participants.map(a => a.id) });
    } 
    else if (match === "me" || match === "mee") {
        await message.client.sendMessage(message.chat, { text: `@${message.sender.split("@")[0]}`, mentions: [message.sender] });
    } 
    else if (match || message.reply_message.text) {
        match = match || message.reply_message.text;
        if (!match) return await message.reply('*Example :* \n_*tag all*_\n_*tag admin*_\n_*tag text*_\n_*Reply to a message*_');
        await message.send(match, { mentions: participants.map(a => a.id) });
    } 
    else if (message.reply_message.i) {
        return await message.client.forwardMessage(message.jid, message.reply_message.message, { contextInfo: { mentionedJid: participants.map(a => a.id) } });
    } 
    else {
        return await message.reply('*Example :* \n_*tag all*_\n*_tag admin*_\n*_tag text*_\n_*Reply to a message*_');
    }
});

System({
    pattern: "gpp$",
    fromMe: true,
    desc: "Set full-screen profile picture",
    type: "group",
}, async (message, match) => {
    if (!message.isGroup) return await message.send("_This command is for groups_"); 
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_I'm not an admin_");
    if(match && match === "remove") {
        await message.client.removeProfilePicture(message.jid);
        return await message.reply("_Group Profile Picture Removed_");
    }
    if (!message.reply_message?.image) return await message.reply("_Reply to a photo_");
    const media = await message.reply_message.download();
    await message.client.updateProfile(media, message.jid);
    return await message.send("_Group Profile Picture Updated_");
});

System({
    pattern: 'revoke ?(.*)',
    fromMe: true,
    desc: "Revoke Group invite link.",
    type: 'group'
}, async (message) => {
    if (!message.isGroup)
    return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_I'm not admin_");
    await message.client.groupRevokeInvite(message.jid)
    await message.send('_Revoked_');
});

System({
    pattern: 'join ?(.*)',
    fromMe: true,
    desc: "to join a group",
    type: 'group'
}, async (message, match) => {
   match = match || message.reply_message.text;
   if(!match) return await message.reply('_Enter a valid group link!_');
   if(!isUrl(match)) return await message.send('_Enter a valid group link!_');
   const matchUrl = extractUrlFromMessage(match);
   if(!matchUrl) return await message.send('_Enter a valid group link!_');
   if (matchUrl && matchUrl.includes('chat.whatsapp.com')) {
       const groupCode = matchUrl.split('https://chat.whatsapp.com/')[1];
       const joinResult = await message.client.groupAcceptInvite(groupCode);
       if (joinResult) return await message.reply('_Joined!_'); 
           await message.reply('_Invalid Group Link!_'); 
   } else {
       await message.reply('_Invalid Group Link!_'); 
   }
});

System({
	pattern: 'left ?(.*)',
	fromMe: true,
	desc: 'Left from group',
	type: 'group'
}, async (message) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    await message.client.groupLeave(message.jid);
});

System({
    pattern: 'lock ?(.*)',
    fromMe: true,
    desc: "only allow admins to modify the group's settings",
    type: 'group'
}, async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_I'm not admin_");
    const meta = await message.client.groupMetadata(message.chat)
    if (meta.restrict) return await message.send("_Already only admin can modify group settings_")
    await message.client.groupSettingUpdate(message.jid, 'locked')
    return await message.send("*Only admin can modify group settings*")
});

System({
    pattern: 'unlock ?(.*)',
    fromMe: true,
    desc: "allow everyone to modify the group's settings -- like display picture etc.",
    type: 'group'
}, async (message, match) => {
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    let isadmin = await isAdmin(message, message.user.jid);
    if (!isadmin) return await message.reply("_bot not admin_");
    const meta = await message.client.groupMetadata(message.jid);
    if (!meta.restrict) return await message.send("_Already everyone can modify group settings_")
    await message.client.groupSettingUpdate(message.jid, 'unlocked')
    return await message.send("*Everyone can modify group settings*")
});


System({
	pattern: 'gname ?(.*)',
	fromMe: true,
	desc: "To change the group's subject",
	type: 'group'
}, async (message, match, m, client) => {
    if(!message.isGroup) return;
	match = match || message.reply_message.text
	if (!match) return await message.reply('*Need Subject!*\n*Example: gname New Subject!*.')
	const meta = await message.client.groupMetadata(message.chat);
	if (!meta.restrict) {
		await client.groupUpdateSubject(message.chat, match)
		return await message.send("*Subject updated*")
	}
	const isbotAdmin = await isBotAdmins(message);
	if (!isbotAdmin) return await message.reply("I'm not an admin")
	await client.groupUpdateSubject(message.chat, match)
	return await message.send("*Subject updated*")
});

System({
    pattern: 'gdesc ?(.*)',
    fromMe: true,
    desc: "To change the group's description",
    type: 'group'
}, async (message, match, client) => {
    match = match || message.reply_message.text
    if (!message.isGroup) return await message.reply("_This command is for groups_");
    if (!match) return await message.reply('*Need Description!*\n*Example: gdesc New Description!*.')
    const meta = await message.client.groupMetadata(message.jid);
    if (!meta.restrict) {
      await message.client.groupUpdateDescription(message.jid, match)
      return await message.send("_*Description updated*_")
    }
    const isbotAdmin = await isBotAdmins(message);
    if (!isbotAdmin) return await message.send("_I'm not an admin_")
    await message.client.groupUpdateDescription(message.jid, match)
    return await message.send("_*Description updated*_")
})

System({
    pattern: 'gjid ?(.*)',
    fromMe: true,
    desc: "To get group jid",
    type: 'group'
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!message.isGroup || match === "info") return message.send(`*All Group Jid*\n${await getAllGroups(message.client)}`);    
    if (match === "participants jid") {
        const { participants, subject } = await message.client.groupMetadata(message.jid);
        const participantJids = participants.map(u => u.id).join("\n\n")
        return message.reply(`*Group Participants Jid*\n\n*Group Name:* ${subject}\n*All Participants Jid*\n\n${participantJids}`);
    }
    await message.send([ { name: "quick_reply", display_text: "All Group Info", id: "gjid info" }, { name: "quick_reply", display_text: "Group Participants Jid", id: "gjid participants jid" } ], { body: "", footer: "*BARAKA-MD*", title: "*Group Jid Info 🎏*\n" }, "button");
});


System({
    pattern: 'ginfo ?(.*)',
    fromMe: true,
    desc: 'Shows group invite info',
    type: 'group'
}, async (message, match) => {
    match = match || message.reply_message.text
    if (!match) return await message.reply('*Need Group Link*\n_Example : ginfo group link_')
    const [link, invite] = match.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i) || []
    if (!invite) return await message.reply('*Invalid invite link*')
    try { const response = await message.client.groupGetInviteInfo(invite)
    await message.send("id: " + response.id + "\nsubject: " + response.subject + "\nowner: " + `${response.owner ? response.owner.split('@')[0] : 'unknown'}` + "\nsize: " + response.size + "\nrestrict: " + response.restrict + "\nannounce: " + response.announce + "\ncreation: " + require('moment-timezone')(response.creation * 1000).tz('Africa/Tanzania').format('DD/MM/YYYY HH:mm:ss') + "\ndesc" + response.desc)
    } catch (error) {
    await message.reply('*Invalid invite link*') }
})

System({
    pattern: "create",
    fromMe: true,
    desc: "to create a group",
    type: "group",
}, async (m, match) => {
    let gName = match || m.pushName;
    if (!m.reply_message.sender) return m.reply("*To create group with someone*\n_Example : . create @user/reply_");
    const group = await m.client.groupCreate(gName, [m.reply_message.sender, m.sender]);
    await m.send("_Group successfully created_ ");
});

System({
	pattern: "warn",
	fromMe: true,
	desc: "Warn a user",
	type: "group",
}, async (message, match) => {
        let user = message.mention.jid?.[0] || message.reply_message.sender;
	if (!user) return message.reply("_Reply to someone/mention_\n*Example:* . warn @user\n_To reset warn_\n*Example:* .warn reset");
	const jid = parsedJid(user);
	let isBotAdmin = await isAdmin(message, message.user.jid);
	if(!isBotAdmin) return await message.reply("_I'm not admin_");
	let userIsAdmin = await isAdmin(message, user);
	if(userIsAdmin) return await message.send(`_user is admin @${jid[0].split("@")[0]}_`, { mentions: jid });
	const name = await message.store.getName(user);
    await warnMessage(message, match, user, name);
});

System({
    pattern: "inactive", 
    fromMe: isPrivate,
    desc: "To check inactive users in group", 
    type: "group",
}, async (message, match) => {
    if (!message.isGroup) return message.reply("_*This command is for groups only.*_");
    const data = await message.store.groupStatus(message.chat, "disactive");
    let inactiveUsers = Array.isArray(data) ? `*Total Inactive Users ${data.length}*\n\n` + data.map((item, index) => `*${index + 1}. User: @${item.jid.split("@")[0]}*\n*Role: ${item.role}*\n\n`).join("") : "_*No inactive users found.*_";
    return await message.send(inactiveUsers.trim(), { mentions: data.map(a => a.jid) || [] });
});

System({
    pattern: "active", 
    fromMe: isPrivate,
    desc: "To check active users in group", 
    type: "group",
}, async (message, match) => {
    if (!message.isGroup) return message.reply("_*This command is for groups only.*_");
    const data = await message.store.groupStatus(message.jid, "active");
    let activeUsers = Array.isArray(data) ? `*Total Active Users ${data.length}*\n\n` + data.map(item => `*Name: ${item.pushName}*\n*Number: ${item.jid.split("@")[0]}*\n*Total Messages: ${item.messageCount}*\n\n`).join("") : "_*No active users found.*_";
    return await message.send([{ name: "quick_reply", display_text: "Inactive users", id: "inactive" }], { body: "", footer: "\n*JARVIS-MD*", title: activeUsers.trim() }, "button");
});

System({
    pattern: "vote",
    fromMe: isPrivate,
    desc: "to send a vote message",
    type: "group",
}, async (message, match) => {
    let formattedResult;
    if (!message.isGroup) return message.reply("_*This command is for groups only.*_");
    if (!match) return message.reply("*Hey, where's the vote text?* Or you can use: _'vote result'_ or _'vote get'_ to get the result of a vote, _'vote delete'_ to delete a vote message, or _'vote What's your favorite color?;😂|Blue,😟|Red'_ to create a vote.");
    if (match === "delete") {
    if (!message.quoted) return message.reply("_*Reply to a vote message*_");
    const deleted = await Vote(message, {}, "delete");
    if (!deleted) return message.reply("*Vote message not found*");
      await message.send({ key: message.reply_message.data.key }, {}, 'delete');
      await message.reply("*Vote message successfully deleted*");
    } else if (match === "result" || match === "get") {
      if (!message.quoted) return message.reply("_*Reply to a vote message*_");
      const data = await Vote(message, {}, "result");
      if (!data) return message.reply("*It's not a vote message or it's patched*");
      if (data.result.length === 0) {
      formattedResult = ['_*No votes yet.*_'];
    } else {
      formattedResult = data.result.map(({ Emoji, Votes, Percentage, VotesBy, VotedOn }) => {
      const votersList = VotesBy.map(voter => `@${voter.split("@")[0]}`).join('\n');
      return `*Emoji*: ${Emoji}\n*Voted On*: ${VotedOn}\n*Total Votes:* ${Votes}\n*Percentage:* ${Percentage}\n*Votes By:* ${votersList}\n\n`;
      });
    } if (data.result.length > 0) formattedResult.unshift('*Vote Result ✨*\n\n');
      await message.send(formattedResult.join('').trim(), { mentions: data.votersJid })
    } else {
      const regex = /^([^;]*;[^;]*\|[^;]*,[^;]*\|[^;]*)$/;
      if (!regex.test(match)) return message.reply("*The text is not in the correct format. Use* ```What's your favorite color?;😂|Blue,😟|Red```");
      await Vote(message, { text: match }, "vote");
    }
});

System({
  pattern: 'getinfo',
  fromMe: isPrivate,
  desc: 'Get group info',
  type: 'group',
}, async (message, match, m) => {
  if (!message.isGroup) {
    return await message.reply('*This command only works in groups baka!*');
  }
  const ppUrl = await message.client.profilePictureUrl(message.chat, 'image');
  const metadata = await message.client.groupMetadata(message.chat);
  const admins = metadata.participants
    .filter(participant => participant.admin === 'admin')
    .map(admin => admin.id.split('@')[0]);
  const validMetadata = {
    id: metadata.id,
    subject: metadata.subject,
    subjectOwner: metadata.subjectOwner ? metadata.subjectOwner.split('@')[0] : 'Not defined',
    subjectTime: metadata.subjectTime,
    size: metadata.size,
    creation: metadata.creation,
    owner: metadata.owner || 'Not defined',
    desc: metadata.desc || 'No description',
    restrict: metadata.restrict,
    announce: metadata.announce,
    isCommunity: metadata.isCommunity,
    isCommunityAnnounce: metadata.isCommunityAnnounce,
    joinApprovalMode: metadata.joinApprovalMode,
    memberAddMode: metadata.memberAddMode,
    participants: metadata.participants
  };
  let caption = `\`\`\`
━━━───𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢───━━━
𝗡𝗔𝗠𝗘: ${validMetadata.subject}
𝗖𝗥𝗘𝗔𝗧𝗘𝗗 𝗢𝗡: ${new Date(validMetadata.creation * 1000).toLocaleString()}
𝗦𝗜𝗭𝗘: ${validMetadata.size} MEMBERS
𝗦𝗨𝗕𝗝𝗘𝗖𝗧 𝗢𝗪𝗡𝗘𝗥: ${validMetadata.subjectOwner}
𝗢𝗪𝗡𝗘𝗥: ${validMetadata.owner}
𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${validMetadata.desc}
𝗝𝗢𝗜𝗡 𝗔𝗣𝗣𝗥𝗢𝗩𝗔𝗟: ${validMetadata.joinApprovalMode ? 'ENABLED' : 'DISABLED'}
𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧: ${validMetadata.announce ? 'YES' : 'NO'}
𝗔𝗗𝗠𝗜𝗡𝗦: ${admins.join(', ')}
\`\`\``;
 await message.client.sendMessage(message.chat, { image: { url: ppUrl }, caption: caption });
});
