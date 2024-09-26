const config = require('../../../config');
const { DataTypes } = require('sequelize');

const PausedChats = config.DATABASE.define('pausedChats', {
 chatId: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true
 }
});

async function getPausedChats() {
 return await PausedChats.findAll();
}

async function savePausedChat(chatId) {
 return await PausedChats.create({ chatId });
}

async function deleteAllPausedChats() {
 return await PausedChats.destroy({
  where: {},
  truncate: true
 });
}

module.exports = {
 PausedChats,
 getPausedChats,
 savePausedChat,
 deleteAllPausedChats
};
