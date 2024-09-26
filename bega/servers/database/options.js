const config = require('../../../config');
const { DataTypes } = require('sequelize');

const options = config.DATABASE.define('Options', {
 chat: {
  type: DataTypes.STRING,
  allowNull: false
 },
 type: {
  type: DataTypes.TEXT,
  allowNull: false
 },
 status: {
  type: DataTypes.BOOLEAN,
  allowNull: false
 }
});

async function toggle(jid = null, type = null) {
 const existingMessage = await options.findOne({
  where: {
   chat: jid,
   type
  }
 });

 if (!existingMessage) {
  return await options.create({
   chat: jid,
   type,
   status: true
  });
 } else {
  const newStatus = !existingMessage.dataValues.status;
  return await existingMessage.update({ chat: jid, status: newStatus });
 }
}

module.exports = toggle;
