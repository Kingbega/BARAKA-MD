const config = require('../../../config');
const { DataTypes } = require('sequelize');

const WarnsDB = config.DATABASE.define('warns', {
 userId: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true
 },
 reasons: {
  type: DataTypes.STRING,
  allowNull: true,
  get() {
   const rawValue = this.getDataValue('reasons');
   return rawValue ? JSON.parse(rawValue) : null;
  },
  set(value) {
   this.setDataValue('reasons', value ? JSON.stringify(value) : null);
  }
 },
 warnCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
 },
 createdAt: {
  type: DataTypes.DATE,
  allowNull: false
 },
 updatedAt: {
  type: DataTypes.DATE,
  allowNull: false
 }
});

async function getWarns(userId) {
 return await WarnsDB.findOne({ where: { userId } });
}

async function saveWarn(userId, reason) {
 let existingWarn = await getWarns(userId);

 if (existingWarn) {
  existingWarn.warnCount += 1;

  if (reason) {
   existingWarn.reasons = existingWarn.reasons || [];
   existingWarn.reasons.push(reason);
  }

  await existingWarn.save();
 } else {
  existingWarn = await WarnsDB.create({
   userId,
   reasons: reason ? [reason] : null,
   warnCount: 0,
   createdAt: new Date(),
   updatedAt: new Date()
  });
 }

 return existingWarn;
}

async function resetWarn(userId) {
 return await WarnsDB.destroy({
  where: { userId },
  truncate: true
 });
}

module.exports = {
 WarnsDB,
 getWarns,
 saveWarn,
 resetWarn
};
