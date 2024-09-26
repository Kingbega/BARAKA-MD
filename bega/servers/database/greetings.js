const config = require('../../../config');
const { DataTypes } = require('sequelize');

const GreetingsDB = config.DATABASE.define('Greetings', {
 chat: {
  type: DataTypes.STRING,
  allowNull: false
 },
 type: {
  type: DataTypes.TEXT,
  allowNull: false
 },
 message: {
  type: DataTypes.TEXT,
  allowNull: false
 },
 status: {
  type: DataTypes.BOOLEAN,
  allowNull: false
 }
});

async function getMessage(jid = null, type = null) {
 const message = await GreetingsDB.findOne({
  where: {
   chat: jid,
   type
  }
 });

 return message ? message.dataValues : false;
}

async function setMessage(jid = null, type = null, text = null) {
 const existingMessage = await GreetingsDB.findOne({
  where: {
   chat: jid,
   type
  }
 });

 if (!existingMessage) {
  return await GreetingsDB.create({
   chat: jid,
   message: text,
   type,
   status: true
  });
 } else {
  return await existingMessage.update({ chat: jid, message: text });
 }
}

async function toggleStatus(jid = null, type = null) {
 const existingMessage = await GreetingsDB.findOne({
  where: {
   chat: jid,
   type
  }
 });

 if (!existingMessage) {
  return false;
 } else {
  const newStatus = !existingMessage.dataValues.status;
  return await existingMessage.update({ chat: jid, status: newStatus });
 }
}

async function delMessage(jid = null, type = null) {
 const existingMessage = await GreetingsDB.findOne({
  where: {
   chat: jid,
   type
  }
 });

 if (existingMessage) {
  await existingMessage.destroy();
 }
}

async function getStatus(jid = null, type = null) {
 try {
  const existingMessage = await GreetingsDB.findOne({
   where: {
    chat: jid,
    type
   }
  });

  return existingMessage ? existingMessage.dataValues.status : false;
 } catch {
  return false;
 }
}

module.exports = {
 GreetingsDB,
 setMessage,
 getMessage,
 delMessage,
 toggleStatus,
 getStatus
};
