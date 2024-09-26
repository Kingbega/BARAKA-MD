const config = require('../../../config');
const util = require('util');
const { DataTypes } = require('sequelize');

const banBotDb = config.DATABASE.define('banbot', {
 chatid: {
  type: DataTypes.STRING,
  allowNull: false
 },
 ban: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
 }
});

const isBanned = async chatid => {
 return new Promise(async (resolve, reject) => {
  try {
   const ban = await banBotDb.findOne({ where: { chatid } });
   return resolve(ban ? ban.ban : false);
  } catch (e) {
   console.log(util.format(e));
  }
 });
};

const banUser = async chatid => {
 return new Promise(async (resolve, reject) => {
  try {
   const ban = await banBotDb.findOne({ where: { chatid } });
   if (ban) {
    await ban.update({ ban: true });
   } else {
    await banBotDb.create({ chatid, ban: true });
   }
   return resolve(true);
  } catch (e) {
   console.log(util.format(e));
  }
 });
};

const unbanUser = async chatid => {
 return new Promise(async (resolve, reject) => {
  try {
   const ban = await banBotDb.findOne({ where: { chatid } });
   if (ban) {
    await ban.update({ ban: false });
   } else {
    await banBotDb.create({ chatid, ban: false });
   }
   return resolve(true);
  } catch (e) {
   console.log(util.format(e));
  }
 });
};

module.exports = { isBanned, banUser, unbanUser };
