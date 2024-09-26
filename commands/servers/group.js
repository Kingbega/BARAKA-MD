const { decodeJid } = require("./baileys");

const isBotAdmins = async (message) => {
  	const groupMetadata = await message.store.fetchGroupMetadata(message.chat)
	const admins = await groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id)
  	return admins.includes(message.user.jid);
};

const getAllGroups = async (client) => {
    const list = await client.groupFetchAllParticipating();
    return Object.values(list).map(group => `JID: ${group.id}\nGroup Name: ${group.subject}\n`).join("\n");
};

const isAdmin = async function(m, user) {
  const groupMetadata = await m.store.fetchGroupMetadata(m.jid);
    const groupAdmins = groupMetadata.participants
      .filter((participant) => participant.admin !== null)
      .map((participant) => participant.id);

    return groupAdmins.includes(decodeJid(user));
}

const parseJid = function(text = "") {
  return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
    (v) => v[1] + "@s.whatsapp.net"
  );
};

const parsedJid = function(text) {
  return text.match(/[0-9]+(-[0-9]+|)@(g.us|s.whatsapp.net)/g);
};

module.exports = {
  isAdmin,
  parseJid,
  parsedJid,
  isBotAdmins,
  getAllGroups
}
